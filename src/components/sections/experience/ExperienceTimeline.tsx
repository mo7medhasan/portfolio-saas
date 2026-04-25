// src/components/sections/experience/ExperienceTimeline.tsx
import type { ExperienceContent } from "@/types/sections";

export function ExperienceTimeline({ content: c }: { content: ExperienceContent }) {
  return (
    <section id="experience" className="py-(--section-padding-y,6rem) bg-(--color-background,#fff)">
      <div className="mx-auto max-w-(--container-max-width,1200px) px-6">
        {c.heading && (
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-(--font-weight-heading,700) whitespace-nowrap"
              style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
              {c.heading}
            </h2>
            <div className="flex-1 h-px bg-(--color-border,#e5e5e5)" />
          </div>
        )}
        <div className="relative max-w-2xl">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-(--color-border,#e5e5e5)" />
          <div className="space-y-10">
            {c.items.map((item) => (
              <div key={item.id} className="relative flex gap-8 pl-12">
                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full flex items-center justify-center z-10"
                  style={{ background: item.current ? "var(--color-primary,#6C63FF)" : "var(--color-surface,#f8f8f8)", border:`2px solid ${item.current ? "var(--color-primary,#6C63FF)" : "var(--color-border,#e5e5e5)"}` }}>
                  {item.logoUrl
                    ? <img src={item.logoUrl} alt={item.company} className="w-5 h-5 rounded-full object-cover" />
                    : <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.current ? "white" : "var(--color-text-secondary,#555)" }} />
                  }
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="font-semibold text-base" style={{ color:"var(--color-text-primary,#111)" }}>{item.role}</h3>
                      <p className="text-sm" style={{ color:"var(--color-primary,#6C63FF)" }}>{item.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.current && (
                        <span className="px-2 py-0.5 text-xs rounded-full font-medium"
                          style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)", color:"var(--color-primary,#6C63FF)" }}>
                          الحالي
                        </span>
                      )}
                      <span className="text-xs" style={{ color:"var(--color-text-secondary,#555)" }}>{item.period}</span>
                    </div>
                  </div>
                  {item.description && <p className="text-sm leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}