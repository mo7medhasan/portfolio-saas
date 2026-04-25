// src/components/sections/experience/ExperienceCards.tsx
import type { ExperienceContent } from "@/types/sections";

export function ExperienceCards({ content: c }: { content: ExperienceContent }) {
  return (
    <section id="experience" className="py-(--section-padding-y,6rem) bg-(--color-surface,#f8f8f8)">
      <div className="mx-auto max-w-(--container-max-width,1200px) px-6">
        {c.heading && (
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-(--font-weight-heading,700) text-center mb-12"
            style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
            {c.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-(--gap-cards,24px)">
          {c.items.map((item) => (
            <div key={item.id} className="p-6 rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5) space-y-3"
              style={{ background:"var(--color-background,#fff)", boxShadow:"var(--shadow-card)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.logoUrl && <img src={item.logoUrl} alt={item.company} className="w-10 h-10 rounded-lg object-cover" />}
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color:"var(--color-text-primary,#111)" }}>{item.role}</h3>
                    <p className="text-xs" style={{ color:"var(--color-primary,#6C63FF)" }}>{item.company}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {item.current && (
                    <span className="block px-2 py-0.5 text-xs rounded-full font-medium mb-1"
                      style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)", color:"var(--color-primary,#6C63FF)" }}>
                      الحالي
                    </span>
                  )}
                  <p className="text-xs" style={{ color:"var(--color-text-secondary,#555)" }}>{item.period}</p>
                </div>
              </div>
              {item.description && <p className="text-sm leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}