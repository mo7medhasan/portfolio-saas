// src/components/sections/cta/index.tsx
import type { CtaContent } from "@/types/sections";

interface Props { content: CtaContent; variant: string; }

export function CtaSection({ content: c, variant }: Props) {
  const ctaBtn = (dark: boolean) => (
    <a href={c.ctaUrl || "#contact"}
      className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-md,8px)] font-medium transition-all hover:opacity-90 hover:-translate-y-0.5"
      style={{ background: dark ? "white" : "var(--color-primary,#6C63FF)", color: dark ? "var(--color-primary,#6C63FF)" : "white" }}>
      {c.ctaText || "ابدأ الآن"}
    </a>
  );

  if (variant === "card") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-lg px-6">
        <div className="p-10 rounded-2xl text-center space-y-5 border border-[var(--color-border,#e5e5e5)]"
          style={{ background:"var(--color-background,#fff)", boxShadow:"var(--shadow-card)" }}>
          <h2 className="text-2xl font-[var(--font-weight-heading,700)]"
            style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>{c.heading}</h2>
          {c.subheading && <p className="text-base" style={{ color:"var(--color-text-secondary,#555)" }}>{c.subheading}</p>}
          {ctaBtn(false)}
        </div>
      </div>
    </section>
  );

  if (variant === "minimal") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-background,#fff)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-[var(--font-weight-heading,700)]"
            style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>{c.heading}</h2>
          {c.subheading && <p className="text-sm mt-1" style={{ color:"var(--color-text-secondary,#555)" }}>{c.subheading}</p>}
        </div>
        {ctaBtn(false)}
      </div>
    </section>
  );

  // default: banner
  return (
    <section className="py-[var(--section-padding-y,6rem)]" style={{ background:"var(--color-primary,#6C63FF)" }}>
      <div className="mx-auto max-w-2xl px-6 text-center space-y-6">
        <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-[var(--font-weight-heading,700)] text-white"
          style={{ fontFamily:"var(--font-heading,sans-serif)" }}>{c.heading}</h2>
        {c.subheading && <p className="text-white/80 text-lg">{c.subheading}</p>}
        {ctaBtn(true)}
      </div>
    </section>
  );
}
