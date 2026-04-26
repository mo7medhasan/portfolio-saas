// src/components/sections/hero/HeroFullscreen.tsx
import type { HeroContent } from "@/types/sections";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HeroFullscreen({ content: c }: { content: HeroContent }) {
  return (
    <section
      dir="ltr"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden w-full"
      style={!c.imageUrl ? { background: "var(--color-primary, #6C63FF)" } : {}}
    >
      {/* Background image + overlay */}
      {c.imageUrl && (
        <>
          <Image
            src={c.imageUrl}
            alt={c.headline || "Hero background"}
            fill
            priority
            className="object-cover absolute inset-0 z-0"
          />
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </>
      )}

      {/* Subtle noise grain on solid color */}
      {!c.imageUrl && (
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full mx-auto max-w-3xl px-6 sm:px-12 py-28 flex flex-col items-center text-center gap-5">
        {c.badgeText && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-white/25 bg-white/10 text-white backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            {c.badgeText}
          </span>
        )}

        <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.06] tracking-tight text-white">
          {c.headline}
        </h1>

        {c.subheadline && (
          <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
            {c.subheadline}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 justify-center mt-3">
          {c.ctaText && (
            <Link
              href={c.ctaUrl || "#"}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold bg-white transition-all duration-200 hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
              style={{ color: "var(--color-primary, #6C63FF)" }}
            >
              {c.ctaText}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
          {c.secondaryCtaText && (
            <Link
              href={c.secondaryCtaUrl || "#"}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold border-2 border-white/35 text-white hover:bg-white/12 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm"
            >
              {c.secondaryCtaText}
            </Link>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-bounce">
        <ChevronDown className="w-5 h-5 text-white/70" strokeWidth={1.5} />
      </div>
    </section>
  );
}