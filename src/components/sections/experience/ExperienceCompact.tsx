// src/components/sections/experience/ExperienceCompact.tsx
import type { ExperienceContent } from "@/types/sections";

export function ExperienceCompact({ content: c }: { content: ExperienceContent }) {
  return (
    <section id="experience" className="py-(--section-padding-y,6rem) bg-(--color-background,#fff)">
      <div className="mx-auto max-w-2xl px-6">
        {c.heading && (
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-(--font-weight-heading,700) mb-10"
            style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
            {c.heading}
          </h2>
        )}
        <div className="space-y-4">
          {c.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-(--color-border,#e5e5e5) last:border-0">
              <div>
                <span className="text-sm font-medium" style={{ color:"var(--color-text-primary,#111)" }}>{item.role}</span>
                <span className="text-sm mx-2" style={{ color:"var(--color-text-secondary,#555)" }}>—</span>
                <span className="text-sm" style={{ color:"var(--color-primary,#6C63FF)" }}>{item.company}</span>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color:"var(--color-text-secondary,#555)" }}>{item.period}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}