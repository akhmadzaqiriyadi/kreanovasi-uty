"use client";

import { useRouter } from "next/navigation";
import { useBookingSchedule } from "@/hooks/use-booking-schedule";
import { BookingCta } from "./booking-cta";
import { BookingHeroBanner } from "./booking-hero-banner";
import { BookingInfoSection } from "./booking-info-section";
import { BookingRoomCards } from "./booking-room-cards";
import { BookingScheduleNavigator } from "./booking-schedule-navigator";

export function BookingPageSection() {
  const router = useRouter();
  const scheduleController = useBookingSchedule();

  return (
    <main aria-label="Halaman Reservasi Ruangan UTY Creative Hub">
      {/* 1. Hero Banner */}
      <BookingHeroBanner />

      {/* 2. Interactive Date Navigator & Room Availability Schedule */}
      <BookingScheduleNavigator
        scheduleController={scheduleController}
        onBookRoom={(roomId, dateStr) =>
          router.push(
            `/booking/new?room=${encodeURIComponent(roomId)}&date=${encodeURIComponent(dateStr)}`,
          )
        }
      />

      {/* 3. Catalog Room Cards (Without prefilled date) */}
      <BookingRoomCards
        onSelectRoom={(roomId) =>
          router.push(`/booking/new?room=${encodeURIComponent(roomId)}`)
        }
      />

      {/* 4. Operational Hours & Peminjaman Guidelines */}
      <BookingInfoSection />

      {/* 5. Bottom CTA */}
      <BookingCta onOpenModal={() => router.push("/booking/new")} />
    </main>
  );
}
