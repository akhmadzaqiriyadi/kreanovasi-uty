import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  EventDetailContent,
  EventDetailHeader,
  RelatedEvents,
} from "@/components/events";
import {
  getAllEvents,
  getEventBySlug,
  getRelatedEvents,
} from "@/config/events";
import { siteConfig } from "@/config/site";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Agenda Tidak Ditemukan",
    };
  }

  return {
    title: `${event.title} | ${siteConfig.name}`,
    description: event.description,
    alternates: {
      canonical: `${siteConfig.url}/events/${event.slug}`,
    },
    openGraph: {
      title: `${event.title} | ${siteConfig.name}`,
      description: event.description,
      url: `${siteConfig.url}/events/${event.slug}`,
      images: [
        {
          url: event.coverImage.startsWith("http")
            ? event.coverImage
            : `${siteConfig.url}${event.coverImage}`,
          alt: event.title,
        },
      ],
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = getRelatedEvents(slug, 3);

  return (
    <main className="flex-1 flex flex-col w-full bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40 relative">
      <EventDetailHeader event={event} />
      <div className="relative overflow-hidden w-full">
        {/* Ambient background decoration */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-secondary/10 dark:bg-secondary/15 blur-3xl" />
        </div>
        <EventDetailContent event={event} />
      </div>
      <RelatedEvents events={relatedEvents} />
    </main>
  );
}
