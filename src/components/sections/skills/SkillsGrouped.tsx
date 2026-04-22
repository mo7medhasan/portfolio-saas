// src/components/sections/skills/SkillsGrouped.tsx
import type { SkillsContent, SkillItem } from "@/types/sections";

export function SkillsGrouped({ content: c }: { content: SkillsContent }) {
  const grouped = c.items.reduce<Record<string, SkillItem[]>>((acc, s) => {
    const cat = s.category || "Other";
    return { ...acc, [cat]: [...(acc[cat] ?? []), s] };
  }, {});

  return (
    <section id="skills" className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {c.heading && (
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[var(--font-weight-heading,700)] mb-12 text-center"
            style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
            {c.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category} className="p-6 rounded-[var(--radius-lg,16px)] border border-[var(--color-border,#e5e5e5)]"
              style={{ background:"var(--color-background,#fff)" }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color:"var(--color-primary,#6C63FF)" }}>
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s.id} className="px-3 py-1 text-sm rounded-[var(--radius-md,8px)]"
                    style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)", color:"var(--color-primary,#6C63FF)" }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}