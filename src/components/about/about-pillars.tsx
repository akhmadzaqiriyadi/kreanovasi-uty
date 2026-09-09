import { Cpu, Palette, Rocket } from "lucide-react";
import type React from "react";

interface AboutPillarsProps {
  pillarsRef?: React.Ref<HTMLElement>;
}

const pillars = [
  {
    icon: Palette,
    title: "Kreativitas",
    subtitle: "Creativity & Design",
    description:
      "Wadah berekspresi bagi mahasiswa untuk melahirkan gagasan orisinal, desain bernilai estetika tinggi, dan solusi kreatif yang berpusat pada manusia.",
    accentColor: "border-primary/20 hover:border-primary/50",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: Rocket,
    title: "Inovasi",
    subtitle: "Applied Innovation",
    description:
      "Mendorong akselerasi riset aplikatif, inkubasi startup kampus, hingga perlindungan hak cipta & paten melalui Sentra Kekayaan Intelektual.",
    accentColor: "border-secondary/30 hover:border-secondary/70",
    badgeColor: "bg-secondary/15 text-secondary-foreground",
  },
  {
    icon: Cpu,
    title: "Teknologi",
    subtitle: "Future Tech & Engineering",
    description:
      "Pemanfaatan sains komputasi, rekayasa perangkat lunak, AI, dan otomatisasi digital melalui kurikulum praktis di FastLab Academy.",
    accentColor: "border-primary/20 hover:border-primary/50",
    badgeColor: "bg-primary/10 text-primary",
  },
];

export function AboutPillars({ pillarsRef }: AboutPillarsProps) {
  return (
    <section
      ref={pillarsRef}
      aria-label="Pilar Utama UTY Creative Hub"
      className="space-y-6 sm:space-y-8 pt-4 sm:pt-6"
    >
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
          3 Pilar Utama Kami
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Fondasi ekosistem kreasi dan riset mahasiswa Universitas Teknologi
          Yogyakarta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
            <article
              key={pillar.title}
              className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border ${pillar.accentColor} shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-11 w-11 rounded-xl ${pillar.badgeColor} flex items-center justify-center`}
                  >
                    <IconComponent className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
                    {pillar.subtitle}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-foreground tracking-tight">
                  {pillar.title}
                </h4>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
