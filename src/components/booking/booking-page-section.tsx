"use client";

import { useBookingForm } from "@/hooks/use-booking-form";
import { useBookingSchedule } from "@/hooks/use-booking-schedule";
import { BookingCta } from "./booking-cta";
import { BookingFormModal } from "./booking-form-modal";
import { BookingHeroBanner } from "./booking-hero-banner";
import { BookingInfoSection } from "./booking-info-section";
import { BookingRoomCards } from "./booking-room-cards";
import { BookingScheduleNavigator } from "./booking-schedule-navigator";

export function BookingPageSection() {
  const scheduleController = useBookingSchedule();

  const bookingController = useBookingForm(undefined, (newBooking) => {
    scheduleController.addBooking(newBooking);
  });

  return (
    <main aria-label="Halaman Reservasi Ruangan UTY Creative Hub">
      {/* 1. Hero Banner */}
      <BookingHeroBanner />

      {/* 2. Interactive Date Navigator & Room Availability Schedule (Reference Flow) */}
      <BookingScheduleNavigator
        scheduleController={scheduleController}
        onBookRoom={(roomId, dateStr) =>
          bookingController.openBookingModal(roomId, dateStr)
        }
      />

      {/* 3. Catalog Room Cards with Detail Facilities */}
      <BookingRoomCards
        onSelectRoom={(roomId) =>
          bookingController.openBookingModal(
            roomId,
            scheduleController.formattedSelectedDate,
          )
        }
      />

      {/* 4. Operational Hours & Peminjaman Guidelines */}
      <BookingInfoSection />

      {/* 5. Bottom CTA */}
      <BookingCta onOpenModal={() => bookingController.openBookingModal()} />

      {/* 6. Booking Form Dialog Modal (Decoupled & Accessible) */}
      <BookingFormModal bookingController={bookingController} />
    </main>
  );
}
