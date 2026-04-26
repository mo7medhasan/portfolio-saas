// src/components/sections/hero/HeroSplit.tsx
import type { HeroContent } from "@/types/sections";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSplit({ content: c }: { content: HeroContent }) {
  return (
    <section
      dir="ltr"
      className="min-h-[90vh] flex items-center"
      style={{ background: "var(--color-background, #fff)" }}
    >
      <div className="w-full mx-auto max-w-6xl px-6 sm:px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Right: Image */}
        <div className="flex justify-center md:justify-end">
          {c.imageUrl ? (
            <div className="relative w-72 h-[380px] sm:w-80 sm:h-[420px] group">
              {/* Decorative offset border */}
              <div
                className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary, #6C63FF) 30%, transparent)",
                }}
              />
              {/* Image card */}
              <div
                className="relative z-10 w-full h-full rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <Image
                  src={c.imageUrl}
                  alt={c.headline || "Hero image"}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          ) : (
            <div
              className="w-72 h-[380px] sm:w-80 sm:h-[420px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3"
              style={{
                borderColor: "var(--color-border, #e2e2e2)",
                background: "var(--color-surface, #f8f8f8)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-primary, #6C63FF) 10%, transparent)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-primary, #6C63FF)"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-text-secondary, #999)" }}
              >
                Add your image
              </p>
            </div>
          )}
        </div>
        {/* Left: Text content */}
        <div className="flex flex-col gap-5">
          {c.badgeText && (
            <span
              className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background:
                  "color-mix(in srgb, var(--color-primary, #6C63FF) 9%, transparent)",
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

          <h1
            className="text-[clamp(2rem,4vw,3.6rem)] leading-[1.1] tracking-tight"
            style={{
              fontFamily: "var(--font-heading, sans-serif)",
              fontWeight: "var(--font-weight-heading, 700)",
              color: "var(--color-heading, #111)",
            }}
          >
            {c.headline}
          </h1>

          {c.subheadline && (
            <p
              className="text-base leading-relaxed max-w-md"
              style={{ color: "var(--color-text-secondary, #666)" }}
            >
              {c.subheadline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {c.ctaText && (
              <Link
                href={c.ctaUrl || "#"}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "var(--color-primary, #6C63FF)",
                  boxShadow:
                    "0 4px 14px color-mix(in srgb, var(--color-primary, #6C63FF) 30%, transparent)",
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
                }}
              >
                {c.secondaryCtaText}
              </Link>
            )}
          </div>
        </div>


      </div>
    </section>
  );
}