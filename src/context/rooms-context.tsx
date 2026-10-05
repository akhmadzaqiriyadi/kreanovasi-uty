"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type RoomItem, roomsConfig } from "@/config/rooms";
import type { BackendRoom } from "@/hooks/use-booking-queries";
import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth";

export interface BookingItem {
  id: string;
  roomId: string;
  roomName: string;
  applicantName: string;
  applicantRole: "mahasiswa" | "dosen" | "umum";
  idNumber: string;
  prodi: string;
  purpose: string;
  audience: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  createdAt: string;
}

export const DUMMY_ROOM_IMAGES = [
  {
    label: "Co-Working Space Hall",
    url: "/images/coworking-space.jpg",
    description: "Ruang terbuka modern & fleksibel",
  },
  {
    label: "FastLab Prototyping & IoT",
    url: "/images/prototyping-room.jpg",
    description: "Lab fabrikasi perangkat keras & 3D print",
  },
  {
    label: "Think-Tank Meeting Room",
    url: "/images/think-tank-room.jpg",
    description: "Ruang rapat kedap suara & konferensi",
  },
  {
    label: "Studio Podcast & Multimedia (Dummy 1)",
    url: "/images/room1.jpeg",
    description: "Studio rekaman audio visual",
  },
  {
    label: "Auditorium Mini & Pitching (Dummy 2)",
    url: "/images/room2.jpeg",
    description: "Panggung presentasi & pitching investor",
  },
  {
    label: "Laboratorium Komputasi AI & VR (Dummy 3)",
    url: "/images/room3.jpeg",
    description: "Lab workstation grafis tinggi & headset VR",
  },
];

const DEFAULT_BOOKINGS: BookingItem[] = [];

const STORAGE_ROOMS_KEY = "uch_rooms_data_v2";
const STORAGE_BOOKINGS_KEY = "uch_bookings_data_v2";

interface RoomsContextType {
  rooms: RoomItem[];
  availableRooms: RoomItem[];
  isLoading: boolean;
  refreshRooms: () => Promise<void>;
  addRoom: (
    room: Omit<RoomItem, "id" | "slug"> & { id?: string; slug?: string },
  ) => RoomItem;
  updateRoom: (id: string, updated: Partial<RoomItem>) => void;
  deleteRoom: (id: string) => void;
  setRoomStatus: (
    id: string,
    state: RoomItem["status"]["state"],
    label?: string,
    timeSlotInfo?: string,
  ) => void;
  resetRoomsToDefault: () => void;
  bookings: BookingItem[];
  addBooking: (
    booking: Omit<BookingItem, "id" | "createdAt" | "status"> & {
      id?: string;
      status?: BookingItem["status"];
    },
  ) => BookingItem;
  updateBookingStatus: (
    id: string,
    status: BookingItem["status"],
    notes?: string,
  ) => void;
  deleteBooking: (id: string) => void;
}

function mapBackendRoomToItem(br: BackendRoom): RoomItem {
  let facilitiesList: string[] = [];
  if (Array.isArray(br.facilities)) {
    facilitiesList = br.facilities;
  } else if (typeof br.facilities === "string") {
    try {
      const parsed = JSON.parse(br.facilities);
      if (Array.isArray(parsed)) {
        facilitiesList = parsed;
      } else {
        facilitiesList = br.facilities.split(",").map((s) => s.trim());
      }
    } catch {
      facilitiesList = br.facilities.split(",").map((s) => s.trim());
    }
  }

  const state =
    br.status === "available"
      ? "available"
      : br.status === "maintenance"
        ? "maintenance"
        : "in-use";

  const label =
    br.status === "available"
      ? "Tersedia Sekarang"
      : br.status === "maintenance"
        ? "Pemeliharaan Rutin"
        : "Sedang Digunakan";

  return {
    id: br.id,
    slug: br.slug || br.id,
    name: br.name,
    type: br.category || "Fasilitas Kampus",
    description: br.description || "",
    capacity: `${br.capacity} Orang`,
    location: br.location || "Gedung UCH UTY",
    coverImage: br.image_url || "/images/coworking-space.jpg",
    facilities: facilitiesList.length > 0 ? facilitiesList : ["Wi-Fi", "AC"],
    status: {
      state,
      label,
      timeSlotInfo: br.operational_hours || "08:00 - 17:00 WIB",
    },
    featured: true,
  };
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export function RoomsProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<RoomItem[]>(roomsConfig.rooms);
  const [bookings, setBookings] = useState<BookingItem[]>(DEFAULT_BOOKINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live rooms from backend API with localStorage fallback
  const refreshRooms = useCallback(async () => {
    try {
      const res = await apiClient.get<ApiEnvelope<BackendRoom[]>>("/rooms");
      if (
        res.data?.data &&
        Array.isArray(res.data.data) &&
        res.data.data.length > 0
      ) {
        const mapped = res.data.data.map(mapBackendRoomToItem);
        setRooms(mapped);
        try {
          localStorage.setItem(STORAGE_ROOMS_KEY, JSON.stringify(mapped));
        } catch {
          // ignore localStorage error
        }
      }
    } catch (err) {
      console.warn("Menggunakan data ruangan lokal / cache:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load from localStorage & sync from backend on client mount
  useEffect(() => {
    try {
      localStorage.removeItem("uch_rooms_data_v1");
      localStorage.removeItem("uch_bookings_data_v1");

      const storedRooms = localStorage.getItem(STORAGE_ROOMS_KEY);
      if (storedRooms) {
        const parsed = JSON.parse(storedRooms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRooms(parsed);
        }
      }

      const storedBookings = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        if (Array.isArray(parsed)) {
          setBookings(parsed);
        }
      }
    } catch (err) {
      console.error("Gagal membaca cache ruangan/booking:", err);
    }

    // Always fetch live rooms from backend
    refreshRooms();
  }, [refreshRooms]);

  // Save rooms to localStorage
  const saveRooms = useCallback((newRooms: RoomItem[]) => {
    setRooms(newRooms);
    try {
      localStorage.setItem(STORAGE_ROOMS_KEY, JSON.stringify(newRooms));
    } catch (e) {
      console.error("Gagal menyimpan data ruangan:", e);
    }
  }, []);

  // Save bookings to localStorage
  const saveBookings = useCallback((newBookings: BookingItem[]) => {
    setBookings(newBookings);
    try {
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(newBookings));
    } catch (e) {
      console.error("Gagal menyimpan data booking:", e);
    }
  }, []);

  // Filter available rooms
  const availableRooms = useMemo(() => {
    return rooms.filter((r) => r.status.state === "available");
  }, [rooms]);

  const addRoom = useCallback(
    (
      roomData: Omit<RoomItem, "id" | "slug"> & { id?: string; slug?: string },
    ) => {
      const slug =
        roomData.slug ||
        roomData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const id = roomData.id || `room-${Date.now().toString(36)}`;

      const newRoom: RoomItem = {
        ...roomData,
        id,
        slug,
      };

      const updated = [newRoom, ...rooms];
      saveRooms(updated);
      return newRoom;
    },
    [rooms, saveRooms],
  );

  const updateRoom = useCallback(
    (id: string, updatedFields: Partial<RoomItem>) => {
      const updated = rooms.map((room) => {
        if (room.id === id) {
          return {
            ...room,
            ...updatedFields,
            status: updatedFields.status
              ? { ...room.status, ...updatedFields.status }
              : room.status,
          };
        }
        return room;
      });
      saveRooms(updated);
    },
    [rooms, saveRooms],
  );

  const deleteRoom = useCallback(
    (id: string) => {
      const updated = rooms.filter((room) => room.id !== id);
      saveRooms(updated);
    },
    [rooms, saveRooms],
  );

  const setRoomStatus = useCallback(
    (
      id: string,
      state: RoomItem["status"]["state"],
      customLabel?: string,
      customTimeSlotInfo?: string,
    ) => {
      let defaultLabel = "Tersedia Sekarang";
      let defaultInfo = "Bebas Digunakan Langsung";

      if (state === "in-use") {
        defaultLabel = "Sedang Digunakan";
        defaultInfo = "Hingga sesi peminjaman selesai";
      } else if (state === "reserved-soon") {
        defaultLabel = "Dipesan Sebentar Lagi";
        defaultInfo = "Akan digunakan hari ini";
      } else if (state === "maintenance") {
        defaultLabel = "Perbaikan / Maintenance";
        defaultInfo = "Sementara tidak dapat dipesan";
      }

      updateRoom(id, {
        status: {
          state,
          label: customLabel || defaultLabel,
          timeSlotInfo: customTimeSlotInfo || defaultInfo,
        },
      });
    },
    [updateRoom],
  );

  const resetRoomsToDefault = useCallback(() => {
    saveRooms(roomsConfig.rooms);
    saveBookings(DEFAULT_BOOKINGS);
  }, [saveRooms, saveBookings]);

  const addBooking = useCallback(
    (
      bookingData: Omit<BookingItem, "id" | "createdAt" | "status"> & {
        id?: string;
        status?: BookingItem["status"];
      },
    ) => {
      const id =
        bookingData.id ||
        `UCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newBooking: BookingItem = {
        ...bookingData,
        id,
        status: bookingData.status || "pending",
        createdAt: new Date().toISOString(),
      };

      const updated = [newBooking, ...bookings];
      saveBookings(updated);
      return newBooking;
    },
    [bookings, saveBookings],
  );

  const updateBookingStatus = useCallback(
    (id: string, status: BookingItem["status"], notes?: string) => {
      const updated = bookings.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status,
            notes: notes !== undefined ? notes : b.notes,
          };
        }
        return b;
      });
      saveBookings(updated);
    },
    [bookings, saveBookings],
  );

  const deleteBooking = useCallback(
    (id: string) => {
      const updated = bookings.filter((b) => b.id !== id);
      saveBookings(updated);
    },
    [bookings, saveBookings],
  );

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        availableRooms,
        isLoading,
        refreshRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        setRoomStatus,
        resetRoomsToDefault,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomsProvider");
  }
  return context;
}
