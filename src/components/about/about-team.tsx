"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import {
  type AboutMentor,
  type AboutTeamMember,
  aboutConfig,
} from "@/config/about";
import { cn } from "@/lib/utils";

interface AboutTeamProps {
  sectionRef?: React.Ref<HTMLElement>;
}

function MentorCard({ mentor }: { mentor: AboutMentor }) {
  const [imgSrc, setImgSrc] = useState(mentor.image);

  return (
    <div className="group relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800/80 border border-border/70 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
      {/* Photo with 3:4 aspect ratio */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-200 dark:bg-zinc-800">
        <Image
          src={imgSrc}
          alt={mentor.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc("/images/pattern-bg.svg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
      </div>

      {/* Floating Info Box at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-border/60 shadow-md text-center transition-all duration-300">
        <h4 className="text-sm sm:text-base font-bold text-primary dark:text-foreground leading-snug line-clamp-2">
          {mentor.name}
        </h4>
        <p className="text-xs sm:text-sm font-semibold text-secondary dark:text-amber-400 mt-0.5">
          {mentor.role}
        </p>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: AboutTeamMember }) {
  const [imgSrc, setImgSrc] = useState(member.image);

  return (
    <div className="group relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800/80 border border-border/70 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
      {/* Photo with 3:4 aspect ratio */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-200 dark:bg-zinc-800">
        <Image
          src={imgSrc}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc("/images/pattern-bg.svg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
      </div>

      {/* Floating Info Box at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl p-3 border border-border/60 shadow-md text-center transition-all duration-300">
        <h4 className="text-xs sm:text-sm font-bold text-primary dark:text-foreground leading-snug line-clamp-1">
          {member.name}
        </h4>
        <p className="text-[11px] sm:text-xs font-semibold text-secondary dark:text-amber-400 mt-0.5 line-clamp-1">
          {member.role}
        </p>
      </div>
    </div>
  );
}

export function AboutTeam({ sectionRef }: AboutTeamProps) {
  const { team } = aboutConfig;
  const mentors = team.mentors;
  const members = team.members;

  // Mentors Mobile Carousel state
  const [mentorIndex, setMentorIndex] = useState(0);

  // Team Carousel state
  const [memberIndex, setMemberIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive cards per view calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setCardsPerView(5);
      } else if (width >= 1024) {
        setCardsPerView(4);
      } else if (width >= 768) {
        setCardsPerView(3);
      } else if (width >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxPositions = Math.max(1, members.length - cardsPerView + 1);

  // Keep memberIndex within bounds when viewport resizes
  useEffect(() => {
    if (memberIndex >= maxPositions) {
      setMemberIndex(Math.max(0, maxPositions - 1));
    }
  }, [maxPositions, memberIndex]);

  // Mentors navigation
  const prevMentor = useCallback(() => {
    setMentorIndex((prev) => (prev <= 0 ? mentors.length - 1 : prev - 1));
  }, [mentors.length]);

  const nextMentor = useCallback(() => {
    setMentorIndex((prev) => (prev >= mentors.length - 1 ? 0 : prev + 1));
  }, [mentors.length]);

  // Team navigation
  const prevMember = useCallback(() => {
    setMemberIndex((prev) => (prev <= 0 ? maxPositions - 1 : prev - 1));
  }, [maxPositions]);

  const nextMember = useCallback(() => {
    setMemberIndex((prev) => (prev >= maxPositions - 1 ? 0 : prev + 1));
  }, [maxPositions]);

  // Auto-scroll for mentors on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 768 && !isHovered) {
        setMentorIndex((prev) => (prev >= mentors.length - 1 ? 0 : prev + 1));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [mentors.length, isHovered]);

  // Auto-scroll for team carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setMemberIndex((prev) => (prev >= maxPositions - 1 ? 0 : prev + 1));
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [maxPositions, isHovered]);

  // Touch swipe handling for team members
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextMember();
    } else if (diff < -50) {
      prevMember();
    }
    touchStartX.current = null;
  };

  // Touch swipe handling for mentors
  const mentorTouchStartX = useRef<number | null>(null);
  const handleMentorTouchStart = (e: React.TouchEvent) => {
    mentorTouchStartX.current = e.touches[0].clientX;
  };

  const handleMentorTouchEnd = (e: React.TouchEvent) => {
    if (mentorTouchStartX.current === null) return;
    const diff = mentorTouchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextMentor();
    } else if (diff < -50) {
      prevMentor();
    }
    mentorTouchStartX.current = null;
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="w-full py-16 sm:py-20 lg:py-24 bg-background overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-16 sm:space-y-20">
        {/* Main Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-0.5 w-8 bg-secondary rounded-full" />
            <span className="text-xs font-bold text-secondary tracking-widest uppercase">
              Our Team
            </span>
            <div className="h-0.5 w-8 bg-secondary rounded-full" />
          </div>
          <h2
            id="team-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary dark:text-foreground tracking-tight"
          >
            {team.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            {team.subtitle}
          </p>
        </div>

        {/* 1. Mentors Subsection */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-foreground">
              Our Mentors
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pembina & Pengarah Strategis UTY Creative Hub
            </p>
          </div>

          {/* Desktop Mentors Grid (Centered 2 cards) */}
          <div className="hidden md:flex justify-center items-center gap-8 max-w-2xl mx-auto">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="w-64 lg:w-72 flex-shrink-0">
                <MentorCard mentor={mentor} />
              </div>
            ))}
          </div>

          {/* Mobile Mentors Carousel */}
          <div
            className="md:hidden relative max-w-sm mx-auto px-4"
            onTouchStart={handleMentorTouchStart}
            onTouchEnd={handleMentorTouchEnd}
          >
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${mentorIndex * 100}%)`,
                }}
              >
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="w-full flex-shrink-0 px-2">
                    <MentorCard mentor={mentor} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Mentor Nav Buttons */}
            <button
              type="button"
              onClick={prevMentor}
              aria-label="Mentor sebelumnya"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextMentor}
              aria-label="Mentor berikutnya"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Mobile Mentor Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {mentors.map((m, idx) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMentorIndex(idx)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    mentorIndex === idx
                      ? "bg-secondary scale-125 w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                  )}
                  aria-label={`Lihat mentor ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Team Members Carousel Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-foreground">
              Our Team Members
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Kreator muda berdedikasi di balik setiap karya dan inovasi
            </p>
          </div>

          <div
            className="relative px-2 sm:px-6"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevMember}
              aria-label="Anggota tim sebelumnya"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-white w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Carousel Track Container */}
            <div className="overflow-hidden py-4 mx-4 sm:mx-6">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${memberIndex * (100 / members.length)}%)`,
                  width: `${(members.length * 100) / cardsPerView}%`,
                }}
              >
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="px-2 sm:px-2.5 flex-shrink-0"
                    style={{ width: `${100 / members.length}%` }}
                  >
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextMember}
              aria-label="Anggota tim berikutnya"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-white w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {Array.from({ length: maxPositions }).map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setMemberIndex(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  memberIndex === index
                    ? "bg-secondary w-7"
                    : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                aria-label={`Pindah ke slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/70 font-medium">
          * Struktur tim dan divisi UTY Creative Hub didukung oleh berbagai
          disiplin keilmuan dan keahlian mahasiswa.
        </p>
      </div>
    </section>
  );
}
