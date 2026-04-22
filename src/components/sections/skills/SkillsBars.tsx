// src/components/sections/skills/SkillsBars.tsx
import type { SkillsContent } from "@/types/sections";

export function SkillsBars({ content: c }: { content: SkillsContent }) {
  return (
    <section id="skills" className="py-[var(--section-padding-y,6rem)] bg-[var(--color-background,#fff)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {c.heading && (
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[var(--font-weight-heading,700)] whitespace-nowrap"
              style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
              {c.heading}
            </h2>
            <div className="flex-1 h-px bg-[var(--color-border,#e5e5e5)]" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {c.items.map((skill) => (
            <div key={skill.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium" style={{ color:"var(--color-text-primary,#111)" }}>{skill.name}</span>
                <span style={{ color:"var(--color-text-secondary,#555)" }}>{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background:"var(--color-border,#e5e5e5)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width:`${skill.level}%`, background:"var(--color-primary,#6C63FF)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}