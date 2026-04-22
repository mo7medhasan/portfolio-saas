// src/components/sections/services/index.tsx
import type { ServicesContent } from "@/types/sections";

interface Props { content: ServicesContent; variant: string; }

function ServiceIcon({ icon }: { icon: string }) {
  return (
    <div className="w-12 h-12 rounded-[var(--radius-md,8px)] flex items-center justify-center text-2xl flex-shrink-0"
      style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)" }}>
      {icon || "◈"}
    </div>
  );
}

export function ServicesSection({ content: c, variant }: Props) {
  const header = (c.heading || c.subheading) ? (
    <div className="text-center mb-14">
      {c.heading && (
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[var(--font-weight-heading,700)]"
          style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
          {c.heading}
        </h2>
      )}
      {c.subheading && (
        <p className="text-base mt-3" style={{ color:"var(--color-text-secondary,#555)" }}>{c.subheading}</p>
      )}
    </div>
  ) : null;

  // ── list variant ─────────────────────────────────────────────────────────────
  if (variant === "list") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-background,#fff)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {header}
        <div className="space-y-4">
          {c.items.map(item => (
            <div key={item.id}
              className="flex items-start gap-5 p-6 rounded-[var(--radius-lg,16px)] border border-[var(--color-border,#e5e5e5)] transition-all hover:border-[var(--color-primary,#6C63FF)]/40 hover:-translate-y-0.5"
              style={{ background:"var(--color-surface,#f8f8f8)", boxShadow:"var(--shadow-card)" }}>
              <ServiceIcon icon={item.icon} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold" style={{ color:"var(--color-text-primary,#111)" }}>{item.title}</h3>
                  {item.price && (
                    <span className="text-sm font-semibold flex-shrink-0" style={{ color:"var(--color-primary,#6C63FF)" }}>{item.price}</span>
                  )}
                </div>
                <p className="text-sm mt-1.5 leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ── grid-2 variant ───────────────────────────────────────────────────────────
  if (variant === "grid-2") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {header}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--gap-cards,24px)]">
          {c.items.map(item => (
            <div key={item.id}
              className="p-8 rounded-[var(--radius-lg,16px)] border border-[var(--color-border,#e5e5e5)] space-y-5 transition-all hover:border-[var(--color-primary,#6C63FF)]/40 hover:-translate-y-1"
              style={{ background:"var(--color-background,#fff)", boxShadow:"var(--shadow-card)" }}>
              <ServiceIcon icon={item.icon} />
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold" style={{ color:"var(--color-heading,#111)" }}>{item.title}</h3>
                  {item.price && (
                    <span className="text-sm font-bold px-3 py-1 rounded-full flex-shrink-0"
                      style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)", color:"var(--color-primary,#6C63FF)" }}>
                      {item.price}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ── grid-3 (default) ─────────────────────────────────────────────────────────
  return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {header}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--gap-cards,24px)]">
          {c.items.map(item => (
            <div key={item.id}
              className="p-6 rounded-[var(--radius-lg,16px)] border border-[var(--color-border,#e5e5e5)] space-y-4 transition-all hover:border-[var(--color-primary,#6C63FF)]/40 hover:-translate-y-1"
              style={{ background:"var(--color-background,#fff)", boxShadow:"var(--shadow-card)" }}>
              <ServiceIcon icon={item.icon} />
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold" style={{ color:"var(--color-heading,#111)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{item.description}</p>
              </div>
              {item.price && (
                <p className="text-sm font-semibold pt-1 border-t border-[var(--color-border,#e5e5e5)]"
                  style={{ color:"var(--color-primary,#6C63FF)" }}>{item.price}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
