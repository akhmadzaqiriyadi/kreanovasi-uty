"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import type { BookingListResponse } from "@/hooks/use-booking-queries";
import apiClient, { getLocalAccessToken } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth";

export interface AppNotification {
  id: string;
  type:
    | "booking_created"
    | "booking_approved"
    | "booking_rejected"
    | "booking_checked_in"
    | "booking_updated"
    | "info";
  title: string;
  message: string;
  timestamp: string;
  timeLabel: string;
  read: boolean;
  bookingId?: string;
  roomName?: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  permission: NotificationPermission;
  isSupported: boolean;
  isConnected: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (item: Omit<AppNotification, "id" | "timeLabel">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "uch_realtime_notifications";
const READ_IDS_STORAGE_KEY = "uch_read_notification_ids";

function playNotificationSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.08);
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

function formatRelativeTime(isoString: string): string {
  try {
    const diff = Math.floor(
      (Date.now() - new Date(isoString).getTime()) / 1000,
    );
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  } catch {
    return "Baru saja";
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [_readIds, setReadIds] = useState<string[]>([]);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addNotificationRef = useRef<
    (item: Omit<AppNotification, "id" | "timeLabel">) => void
  >(() => {});

  // Initialize notifications & read IDs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const supported = "Notification" in window;
      setIsSupported(supported);
      if (supported) {
        setPermission(Notification.permission);
      }

      try {
        const storedReadIds = localStorage.getItem(READ_IDS_STORAGE_KEY);
        if (storedReadIds) {
          setReadIds(JSON.parse(storedReadIds));
        }

        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as AppNotification[];
          setNotifications(
            parsed.map((n) => ({
              ...n,
              timeLabel: formatRelativeTime(n.timestamp),
            })),
          );
        }
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied" as NotificationPermission;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        toast.success("Notifikasi PWA Berhasil Diaktifkan", {
          description:
            "Anda akan menerima pembaruan instan status pemesanan ruangan dan check-in.",
        });
      }
      return perm;
    } catch {
      return "denied" as NotificationPermission;
    }
  }, []);

  const addNotification = useCallback(
    (item: Omit<AppNotification, "id" | "timeLabel">) => {
      const newNotif: AppNotification = {
        ...item,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timeLabel: "Baru saja",
      };

      setNotifications((prev) => {
        // Filter out same booking + type duplicate
        const filtered = prev.filter(
          (p) =>
            !(
              p.bookingId &&
              p.bookingId === item.bookingId &&
              p.type === item.type
            ),
        );
        const updated = [newNotif, ...filtered].slice(0, 40);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
        return updated;
      });

      // Play soft chime sound
      playNotificationSound();

      // Show in-app Sonner toast
      if (
        item.type === "booking_approved" ||
        item.type === "booking_checked_in"
      ) {
        toast.success(item.title, {
          description: item.message,
          action: item.actionUrl
            ? {
                label: "Lihat",
                onClick: () => {
                  window.location.href = item.actionUrl || "/my-bookings";
                },
              }
            : undefined,
        });
      } else if (item.type === "booking_rejected") {
        toast.error(item.title, {
          description: item.message,
        });
      } else {
        toast.info(item.title, {
          description: item.message,
          action: item.actionUrl
            ? {
                label: "Detail",
                onClick: () => {
                  window.location.href = item.actionUrl || "/admin";
                },
              }
            : undefined,
        });
      }

      // Show Native Browser / OS notification if permission is granted
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          const nativeNotif = new Notification(item.title, {
            body: item.message,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-192x192.png",
            tag: item.bookingId || "uch-notification",
          });

          nativeNotif.onclick = () => {
            window.focus();
            if (item.actionUrl) {
              window.location.href = item.actionUrl;
            }
          };
        } catch {
          // Native notification constructor blocked in some subframes
        }
      }
    },
    [],
  );

  // Keep addNotificationRef updated for WebSocket callbacks
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(READ_IDS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });

    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      const allIds = prev.map((n) => n.id);
      setReadIds(allIds);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(READ_IDS_STORAGE_KEY, JSON.stringify(allIds));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
    toast.success("Semua notifikasi telah ditandai sudah dibaca");
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    toast.info("Riwayat notifikasi telah dibersihkan");
  }, []);

  // Synchronize actual booking statuses from backend into notifications
  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    let isMounted = true;

    async function syncBookingsNotifications() {
      try {
        const storedReadIds: string[] = JSON.parse(
          localStorage.getItem(READ_IDS_STORAGE_KEY) || "[]",
        );

        const synthesized: AppNotification[] = [];

        // 1. Fetch user's own bookings
        try {
          const res = await apiClient.get<ApiEnvelope<BookingListResponse>>(
            "/my-bookings?limit=25",
          );
          const bookings = res.data?.data?.bookings || [];

          for (const b of bookings) {
            let type: AppNotification["type"] = "info";
            let title = "Pembaruan Reservasi";
            let message = `Status reservasi ruangan ${b.room_name} adalah ${b.status}.`;

            if (b.status === "approved") {
              type = "booking_approved";
              title = "Pemesanan Disetujui!";
              message = `Pemesanan ${b.room_name} (${b.booking_date}, ${b.start_time}-${b.end_time} WIB) telah disetujui oleh Admin UCH.`;
            } else if (b.status === "rejected") {
              type = "booking_rejected";
              title = "Pemesanan Ditolak";
              message = `Pemesanan ${b.room_name} (${b.booking_date}) ditolak.${b.admin_notes ? ` Alasan: ${b.admin_notes}` : ""}`;
            } else if (b.status === "completed") {
              type = "booking_checked_in";
              title = "Presensi Selesai (Check-In)";
              message = `Presensi reservasi ${b.room_name} (ID: ${b.id}) berhasil diverifikasi di ruangan.`;
            } else if (b.status === "pending") {
              type = "booking_created";
              title = "Menunggu Verifikasi Admin";
              message = `Permohonan reservasi ${b.room_name} (${b.booking_date}) sedang ditinjau pengelola UCH.`;
            }

            const notifId = `db-booking-${b.id}-${b.status}`;
            const isRead = storedReadIds.includes(notifId);

            synthesized.push({
              id: notifId,
              type,
              title,
              message,
              timestamp: b.updated_at || b.created_at,
              timeLabel: formatRelativeTime(b.updated_at || b.created_at),
              read: isRead,
              bookingId: b.id,
              roomName: b.room_name,
              actionUrl: "/my-bookings",
            });
          }
        } catch {
          // ignore my-bookings error
        }

        // 2. If user is Admin, also fetch latest pending requests to review
        if (isAdmin) {
          try {
            const adminRes = await apiClient.get<
              ApiEnvelope<BookingListResponse>
            >("/bookings?status=pending&limit=15");
            const adminBookings = adminRes.data?.data?.bookings || [];

            for (const ab of adminBookings) {
              const notifId = `admin-pending-${ab.id}`;
              const isRead = storedReadIds.includes(notifId);

              synthesized.push({
                id: notifId,
                type: "booking_created",
                title: "Permohonan Baru Menunggu Review",
                message: `${ab.applicant_name} (${ab.applicant_role}) mengajukan peminjaman ${ab.room_name} (${ab.booking_date}, ${ab.start_time}-${ab.end_time} WIB).`,
                timestamp: ab.created_at,
                timeLabel: formatRelativeTime(ab.created_at),
                read: isRead,
                bookingId: ab.id,
                roomName: ab.room_name,
                actionUrl: "/admin",
              });
            }
          } catch {
            // ignore admin bookings error
          }
        }

        if (isMounted && synthesized.length > 0) {
          setNotifications((prev) => {
            // Merge synthesized with existing real-time notifications
            const combinedMap = new Map<string, AppNotification>();
            for (const item of synthesized) {
              combinedMap.set(item.id, item);
            }
            for (const item of prev) {
              // Real-time notifications take precedence or preserve state
              combinedMap.set(item.id, item);
            }

            const merged = Array.from(combinedMap.values())
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              )
              .slice(0, 40);

            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });
        }
      } catch {
        // ignore sync error
      }
    }

    syncBookingsNotifications();

    return () => {
      isMounted = false;
    };
  }, [user?.id, isAdmin]);

  // WebSocket connection management
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isUnmounted = false;

    const connectWebSocket = () => {
      if (isUnmounted) return;

      const token = getLocalAccessToken();
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      const hostWithPort = isLocalhost
        ? `${window.location.hostname}:8080`
        : window.location.host;

      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        `${wsProtocol}//${hostWithPort}/api/v1/ws${token ? `?token=${encodeURIComponent(token)}` : ""}`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (isUnmounted) {
            ws.close();
            return;
          }
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            const { event: evtName, data } = payload;

            if (evtName === "booking:created") {
              addNotificationRef.current({
                type: "booking_created",
                title: isAdmin
                  ? "Permohonan Ruangan Baru"
                  : "Permohonan Diajukan",
                message:
                  data.message ||
                  `Pemesanan untuk ${data.room_name} oleh ${data.applicant_name}`,
                timestamp: new Date().toISOString(),
                read: false,
                bookingId: data.id,
                roomName: data.room_name,
                actionUrl: isAdmin ? "/admin" : "/my-bookings",
              });
            } else if (evtName === "booking:approved") {
              addNotificationRef.current({
                type: "booking_approved",
                title: "Pemesanan Disetujui!",
                message:
                  data.message ||
                  `Pemesanan ruangan ${data.room_name} Anda telah disetujui.`,
                timestamp: new Date().toISOString(),
                read: false,
                bookingId: data.id,
                roomName: data.room_name,
                actionUrl: "/my-bookings",
              });
            } else if (evtName === "booking:rejected") {
              addNotificationRef.current({
                type: "booking_rejected",
                title: "Pemesanan Ditolak",
                message:
                  data.message ||
                  `Pemesanan ruangan ${data.room_name} Anda ditolak.`,
                timestamp: new Date().toISOString(),
                read: false,
                bookingId: data.id,
                roomName: data.room_name,
                actionUrl: "/my-bookings",
              });
            } else if (evtName === "booking:checked_in") {
              addNotificationRef.current({
                type: "booking_checked_in",
                title: "Check-in Presensi Berhasil",
                message:
                  data.message ||
                  `Presensi ruangan ${data.room_name} berhasil diverifikasi.`,
                timestamp: new Date().toISOString(),
                read: false,
                bookingId: data.id,
                roomName: data.room_name,
                actionUrl: isAdmin ? "/admin" : "/my-bookings",
              });
            } else if (evtName === "booking:updated") {
              addNotificationRef.current({
                type:
                  data.status === "approved"
                    ? "booking_approved"
                    : data.status === "rejected"
                      ? "booking_rejected"
                      : "booking_updated",
                title: "Pembaruan Status Reservasi",
                message:
                  data.message ||
                  `Reservasi ${data.room_name || data.id} diperbarui: ${data.status}`,
                timestamp: new Date().toISOString(),
                read: false,
                bookingId: data.id,
                actionUrl: isAdmin ? "/admin" : "/my-bookings",
              });
            }
          } catch {
            // ignore non-json messages (e.g. heartbeat)
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          wsRef.current = null;
          if (!isUnmounted) {
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 4000);
          }
        };

        ws.onerror = () => {
          setIsConnected(false);
        };
      } catch {
        setIsConnected(false);
        if (!isUnmounted) {
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        }
      }
    };

    connectWebSocket();

    return () => {
      isUnmounted = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user?.id, isAdmin]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permission,
        isSupported,
        isConnected,
        requestPermission,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

export const useNotification = useNotifications;
