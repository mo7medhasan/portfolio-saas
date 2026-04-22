// src/components/sections/hero/HeroFullscreen.tsx
import type { HeroContent } from "@/types/sections";

export function HeroFullscreen({ content: c }: { content: HeroContent }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: c.imageUrl
        ? `linear-gradient(to bottom,rgba(0,0,0,.55),rgba(0,0,0,.45)),url(${c.imageUrl}) center/cover no-repeat`
        : "var(--color-primary,#6C63FF)" }}>
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center space-y-6">
        {c.badgeText && (
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
            {c.badgeText}
          </span>
        )}
        <h1 className="text-[clamp(3rem,7vw,6rem)] font-[var(--font-weight-heading,700)] leading-[1.05] tracking-tight text-white">
          {c.headline}
        </h1>
        {c.subheadline && <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">{c.subheadline}</p>}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          {c.ctaText && (
            <a href={c.ctaUrl || "#"} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md,8px)] font-medium bg-white transition-all hover:opacity-90"
              style={{ color:"var(--color-primary,#6C63FF)" }}>
              {c.ctaText}
            </a>
          )}
          {c.secondaryCtaText && (
            <a href={c.secondaryCtaUrl || "#"} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md,8px)] font-medium border border-white/40 text-white hover:bg-white/10 transition-all">
              {c.secondaryCtaText}
            </a>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10l6 6 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}