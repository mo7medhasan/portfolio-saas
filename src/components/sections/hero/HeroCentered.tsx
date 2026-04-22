// src/components/sections/hero/HeroCentered.tsx
import type { HeroContent } from "@/types/sections";

export function HeroCentered({ content: c }: { content: HeroContent }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-background,#fff)]">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: "var(--color-primary,#6C63FF)", filter: "blur(100px)" }} />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 flex flex-col items-center text-center gap-6">
        {c.badgeText && (
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border"
            style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)", borderColor:"color-mix(in srgb,var(--color-primary,#6C63FF) 25%,transparent)", color:"var(--color-primary,#6C63FF)" }}>
            {c.badgeText}
          </span>
        )}
        {c.imageUrl && (
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[var(--color-primary,#6C63FF)]/20">
            <img src={c.imageUrl} alt="profile" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-[var(--font-weight-heading,700)] leading-[1.05] tracking-[var(--letter-spacing-heading,-0.02em)]"
          style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
          {c.headline}
        </h1>
        {c.subheadline && (
          <p className="text-lg max-w-xl leading-[var(--line-height-body,1.7)]" style={{ color:"var(--color-text-secondary,#555)" }}>
            {c.subheadline}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {c.ctaText && (
            <a href={c.ctaUrl || "#"} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md,8px)] font-medium text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background:"var(--color-primary,#6C63FF)" }}>
              {c.ctaText}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          )}
          {c.secondaryCtaText && (
            <a href={c.secondaryCtaUrl || "#"} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md,8px)] font-medium border border-[var(--color-border,#e5e5e5)] transition-all hover:border-[var(--color-primary,#6C63FF)]"
              style={{ color:"var(--color-text-primary,#111)" }}>
              {c.secondaryCtaText}
            </a>
          )}
        </div>
        <div className="mt-12 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="var(--color-text-secondary,#555)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}