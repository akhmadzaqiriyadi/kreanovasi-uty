import type { Metadata } from "next";
import { EventsCatalogPage } from "@/components/events";
import { getAllEvents, getEventCategories } from "@/config/events";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Agenda & Events",
  description:
    "Jadwal lengkap workshop teknologi, klinik proposal PKM, seminar industri, dan demo inovasi mahasiswa di UTY Creative Hub.",
  alternates: {
    canonical: `${siteConfig.url}/events`,
  },
  openGraph: {
    title: `Agenda & Events | ${siteConfig.name}`,
    description:
      "Ikuti berbagai program pelatihan praktis, pitching inovasi, dan klinik mentoring di UTY Creative Hub.",
    url: `${siteConfig.url}/events`,
  },
};

export default function EventsPage() {
  const events = getAllEvents();
  const categories = getEventCategories();

  return <EventsCatalogPage events={events} categories={categories} />;
}
