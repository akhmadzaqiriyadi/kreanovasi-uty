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
import { getLocalAccessToken } from "@/lib/api-client";

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
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize notifications from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const supported = "Notification" in window;
      setIsSupported(supported);
      if (supported) {
        setPermission(Notification.permission);
      }

      try {
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

  // Save notifications to localStorage on changes
  const saveNotifications = useCallback((items: AppNotification[]) => {
    setNotifications(items);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 30)));
      } catch {
        // ignore storage errors
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

      saveNotifications([newNotif, ...notifications]);

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
    [notifications, saveNotifications],
  );

  const markAsRead = useCallback(
    (id: string) => {
      saveNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    [notifications, saveNotifications],
  );

  const markAllAsRead = useCallback(() => {
    saveNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("Semua notifikasi telah ditandai sudah dibaca");
  }, [notifications, saveNotifications]);

  const clearAll = useCallback(() => {
    saveNotifications([]);
    toast.info("Riwayat notifikasi telah dibersihkan");
  }, [saveNotifications]);

  // WebSocket connection management
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isUnmounted = false;

    const connectWebSocket = () => {
      if (isUnmounted) return;

      const token = getLocalAccessToken();
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname;
      // Connect to backend port 8080 or custom WS URL
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        `${wsProtocol}//${host}:8080/api/v1/ws${token ? `?token=${encodeURIComponent(token)}` : ""}`;

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
              addNotification({
                type: "booking_created",
                title: "Pemesanan Ruangan Baru",
                message:
                  data.message ||
                  `Pemesanan baru untuk ${data.room_name} oleh ${data.applicant_name}`,
                timestamp: new Date().toISOString(),
                read: false,
                bookingId: data.id,
                roomName: data.room_name,
                actionUrl: "/admin",
              });
            } else if (evtName === "booking:approved") {
              addNotification({
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
              addNotification({
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
              addNotification({
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
              // Admin live status sync
              addNotification({
                type: "booking_updated",
                title: "Pembaruan Status Reservasi",
                message: `Reservasi ${data.id} diperbarui: status ${data.status}`,
                timestamp: new Date().toISOString(),
                read: false,
                bookingId: data.id,
                actionUrl: "/admin",
              });
            }
          } catch {
            // ignore non-json messages (e.g. heartbeat)
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          wsRef.current = null;
          // Exponential reconnect
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
  }, [addNotification, isAdmin, user?.id]);

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
