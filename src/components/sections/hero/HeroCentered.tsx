// src/components/sections/hero/HeroCentered.tsx
import type { HeroContent } from "@/types/sections";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HeroCentered({ content: c }: { content: HeroContent }) {
  return (
    <section
      dir="ltr"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--color-background, #fff)" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "var(--color-primary, #6C63FF)",
          opacity: 0.06,
          filter: "blur(120px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
        style={{
          background: "var(--color-primary, #6C63FF)",
          opacity: 0.04,
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 w-full mx-auto max-w-3xl px-6 sm:px-10 py-28 flex flex-col items-center text-center gap-5">
        {/* Avatar */}
        {c.imageUrl && (
          <div
            className="relative w-60 h-60 rounded-full overflow-hidden mb-1"
            style={{
              boxShadow:
                "0 0 0 4px color-mix(in srgb, var(--color-primary, #6C63FF) 20%, transparent), 0 8px 32px color-mix(in srgb, var(--color-primary, #6C63FF) 20%, transparent)",
            }}
          >
            <Image
              src={c.imageUrl}
              alt={c.headline || "profile"}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Badge */}
        {c.badgeText && (
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border"
            style={{
              background:
                "color-mix(in srgb, var(--color-primary, #6C63FF) 8%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--color-primary, #6C63FF) 22%, transparent)",
              color: "var(--color-primary, #6C63FF)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-primary, #6C63FF)" }}
            />
            {c.badgeText}
          </span>
        )}

        {/* Headline */}
        <h1
          className="text-[clamp(2.6rem,6vw,5rem)] leading-[1.08] tracking-tight"
          style={{
            fontFamily: "var(--font-heading, sans-serif)",
            fontWeight: "var(--font-weight-heading, 700)",
            color: "var(--color-heading, #111)",
          }}
        >
          {c.headline}
        </h1>

        {/* Subheadline */}
        {c.subheadline && (
          <p
            className="text-base sm:text-lg max-w-xl leading-relaxed"
            style={{ color: "var(--color-text-secondary, #666)" }}
          >
            {c.subheadline}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 justify-center mt-3">
          {c.ctaText && (
            <Link
              href={c.ctaUrl || "#"}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "var(--color-primary, #6C63FF)",
                boxShadow:
                  "0 4px 14px color-mix(in srgb, var(--color-primary, #6C63FF) 35%, transparent)",
              }}
            >
              {c.ctaText}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
          {c.secondaryCtaText && (
            <Link
              href={c.secondaryCtaUrl || "#"}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                borderColor: "var(--color-border, #e2e2e2)",
                color: "var(--color-text-primary, #111)",
                background: "transparent",
              }}
            >
              {c.secondaryCtaText}
            </Link>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 flex flex-col items-center gap-2 animate-bounce">
          <ChevronDown
            className="w-5 h-5"
            style={{ color: "var(--color-text-secondary, #999)" }}
            strokeWidth={1.5}
          />
        </div>
      </div>
    </section>
  );
}