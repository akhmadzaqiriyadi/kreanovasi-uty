import type { Metadata } from "next";
import { EventsCatalogPage } from "@/components/events";
import {
  getAllEvents,
  getEventCategories,
  mapBackendEventToEventItem,
} from "@/config/events";
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

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events = getAllEvents();
  let categories = getEventCategories();

  try {
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/v1/events?limit=100`, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data?.events && json.data.events.length > 0) {
        events = json.data.events.map(mapBackendEventToEventItem);
        const dynamicCats = Array.from(
          new Set(events.map((e) => e.category.name)),
        );
        if (dynamicCats.length > 0) {
          categories = dynamicCats;
        }
      }
    }
  } catch {
    // Graceful fallback to static events
  }

  return <EventsCatalogPage events={events} categories={categories} />;
}
