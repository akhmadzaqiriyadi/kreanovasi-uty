"use client";

import { useBookingForm } from "@/hooks/use-booking-form";
import { BookingCta } from "./booking-cta";
import { BookingFormModal } from "./booking-form-modal";
import { BookingHeroBanner } from "./booking-hero-banner";
import { BookingInfoSection } from "./booking-info-section";
import { BookingRoomCards } from "./booking-room-cards";

export function BookingPageSection() {
  const bookingController = useBookingForm();

  return (
    <main aria-label="Halaman Reservasi Ruangan UTY Creative Hub">
      {/* 1. Hero Banner with Brand Depth */}
      <BookingHeroBanner />

      {/* 2. Room Cards with Availability Status Badges */}
      <BookingRoomCards
        onSelectRoom={(roomId) => bookingController.openBookingModal(roomId)}
      />

      {/* 3. Operational Hours & Peminjaman Guidelines */}
      <BookingInfoSection />

      {/* 4. Bottom CTA */}
      <BookingCta onOpenModal={() => bookingController.openBookingModal()} />

      {/* 5. Booking Form Dialog Modal (Decoupled & Accessible) */}
      <BookingFormModal bookingController={bookingController} />
    </main>
  );
}
