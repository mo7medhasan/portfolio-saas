// src/components/sections/hero/HeroSplit.tsx
import type { HeroContent } from "@/types/sections";

export function HeroSplit({ content: c }: { content: HeroContent }) {
  return (
    <section className="min-h-[90vh] flex items-center bg-[var(--color-background,#fff)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-24">
        <div className="space-y-6">
          {c.badgeText && (
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)", color:"var(--color-primary,#6C63FF)" }}>
              {c.badgeText}
            </span>
          )}
          <h1 className="text-[clamp(2.2rem,4.5vw,4rem)] font-[var(--font-weight-heading,700)] leading-[1.1] tracking-[var(--letter-spacing-heading,-0.02em)]"
            style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
            {c.headline}
          </h1>
          {c.subheadline && (
            <p className="text-base leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{c.subheadline}</p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {c.ctaText && (
              <a href={c.ctaUrl || "#"} className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md,8px)] font-medium text-white transition-all hover:opacity-90"
                style={{ background:"var(--color-primary,#6C63FF)" }}>
                {c.ctaText}
              </a>
            )}
            {c.secondaryCtaText && (
              <a href={c.secondaryCtaUrl || "#"} className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md,8px)] font-medium border border-[var(--color-border,#e5e5e5)] transition-all hover:border-[var(--color-primary,#6C63FF)]"
                style={{ color:"var(--color-text-primary,#111)" }}>
                {c.secondaryCtaText}
              </a>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          {c.imageUrl ? (
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-[var(--radius-lg,16px)] border-2 opacity-25"
                style={{ borderColor:"var(--color-primary,#6C63FF)" }} />
              <img src={c.imageUrl} alt="hero" className="relative z-10 w-80 h-96 object-cover rounded-[var(--radius-lg,16px)]"
                style={{ boxShadow:"var(--shadow-card)" }} />
            </div>
          ) : (
            <div className="w-80 h-96 rounded-[var(--radius-lg,16px)] border-2 border-dashed flex items-center justify-center"
              style={{ borderColor:"var(--color-border,#e5e5e5)" }}>
              <p className="text-sm" style={{ color:"var(--color-text-secondary,#555)" }}>أضف صورتك</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}