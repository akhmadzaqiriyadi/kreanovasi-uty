import { AboutSection } from "@/components/about";
import { ArticlesSection } from "@/components/articles";
import { EventsSection } from "@/components/events";
import { HeroSection } from "@/components/hero-section";
import { RoomsSection } from "@/components/rooms";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <RoomsSection />
      <EventsSection />
      <ArticlesSection />
    </>
  );
}
