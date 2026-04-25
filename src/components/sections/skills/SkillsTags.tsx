// src/components/sections/skills/SkillsTags.tsx
import type { SkillsContent } from "@/types/sections";

export function SkillsTags({ content: c }: { content: SkillsContent }) {
  return (
    <section id="skills" className="py-(--section-padding-y,6rem) bg-(--color-surface,#f8f8f8)">
      <div className="mx-auto max-w-(--container-max-width,1200px) px-6">
        <SectionHeader heading={c.heading} subheading={c.subheading} />
        <div className="flex flex-wrap gap-3 justify-center">
          {c.items.map((skill) => (
            <span key={skill.id} className="px-4 py-2 text-sm font-medium rounded-(--radius-full,9999px) border border-(--color-border,#e5e5e5) transition-all hover:border-(--color-primary,#6C63FF) hover:text-(--color-primary,#6C63FF) cursor-default"
              style={{ background:"var(--color-background,#fff)", color:"var(--color-text-primary,#111)" }}>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ heading, subheading }: { heading: string; subheading: string }) {
  if (!heading) return null;
  return (
    <div className="text-center mb-12 space-y-3">
      <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-(--font-weight-heading,700)"
        style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
        {heading}
      </h2>
      {subheading && <p className="text-base" style={{ color:"var(--color-text-secondary,#555)" }}>{subheading}</p>}
    </div>
  );
}