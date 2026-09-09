import { DxWidget } from "@/components/dx-widget";
import { FeaturesGrid } from "@/components/features-grid";
import { HeroSection } from "@/components/hero-section";
import { FeedbackForm } from "@/features/feedback";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-grid-mesh pb-20">
      <HeroSection />

      <section id="features">
        <FeaturesGrid />
      </section>

      <section id="dx">
        <DxWidget />
      </section>

      <section
        id="feedback"
        className="container mx-auto px-4 py-16 max-w-4xl relative z-10 sm:px-6 lg:px-8"
      >
        <FeedbackForm />
      </section>
    </div>
  );
}
