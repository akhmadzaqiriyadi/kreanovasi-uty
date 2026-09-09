import { ArrowRight, Compass, Lightbulb, Users } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AboutStoryProps {
  storyRef?: React.Ref<HTMLElement>;
}

export function AboutStory({ storyRef }: AboutStoryProps) {
  return (
    <article
      ref={storyRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
    >
      {/* Left Column: Official Welcome & Narrative */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
        <div className="space-y-3 sm:space-y-4 text-foreground/85 dark:text-foreground/85">
          <p className="text-sm xs:text-base sm:text-lg font-medium leading-relaxed sm:leading-relaxed">
            Selamat datang di{" "}
            <strong className="text-primary dark:text-blue-200 font-bold">
              UTY Creative Hub
            </strong>
            , pusat kreativitas dan inovasi resmi Universitas Teknologi
            Yogyakarta! Kami adalah wadah yang dirancang khusus untuk mahasiswa
            dan komunitas UTY dalam mengembangkan ide-ide brilian di bidang{" "}
            <span className="text-primary dark:text-blue-100 font-semibold">
              kreativitas
            </span>
            , <span className="text-secondary font-semibold">inovasi</span>, dan{" "}
            <span className="text-primary dark:text-blue-100 font-semibold">
              teknologi
            </span>
            .
          </p>

          <p className="text-sm xs:text-base sm:text-lg font-medium leading-relaxed sm:leading-relaxed text-muted-foreground">
            Dengan fasilitas modern dan program-program yang inspiratif, UTY
            Creative Hub menjadi rumah bagi para pemikir kreatif, inovator muda,
            dan calon pemimpin masa depan yang ingin membuat perubahan positif
            melalui karya-karya inovatif.
          </p>
        </div>

        {/* CTA Actions */}
        <nav
          aria-label="Aksi Tentang Kami"
          className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
        >
          <Link
            href="/programs"
            className={cn(
              buttonVariants({ size: "default" }),
              "h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2",
            )}
          >
            <span>Jelajahi Program</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <Link
            href="/booking"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "h-11 px-5 border-2 border-primary/30 text-primary hover:bg-accent font-semibold rounded-xl transition-colors",
            )}
          >
            <span>Reservasi Ruangan</span>
          </Link>
        </nav>
      </div>

      {/* Right Column: Key Focus Card Matrix */}
      <aside
        aria-label="Fokus Utama UTY Creative Hub"
        className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 shadow-xs space-y-2 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Lightbulb className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-primary">
              Wadah Ide & Inkubasi
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Menjembatani ide kreatif mahasiswa menjadi produk riset, startup,
            dan kekayaan intelektual bernilai nyata.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 shadow-xs space-y-2 hover:border-secondary/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/15 text-secondary-foreground flex items-center justify-center shrink-0">
              <Compass className="h-5 w-5 text-secondary" aria-hidden="true" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-primary">
              Fasilitas & Lab Modern
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Dilengkapi sarana workshop, co-working space, dan laboratorium
            teknologi untuk eksperimen tanpa batas.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 shadow-xs space-y-2 hover:border-primary/40 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-primary">
              Komunitas & Ekosistem Kolaboratif
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Menghubungkan mahasiswa lintas fakultas, dosen pembimbing, mentor
            industri, dan mitra eksternal.
          </p>
        </div>
      </aside>
    </article>
  );
}
