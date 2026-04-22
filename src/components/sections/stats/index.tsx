// src/components/sections/stats/index.tsx
import type { StatsContent } from "@/types/sections";

interface Props { content: StatsContent; variant: string; }

function StatNumber({ item }: { item: StatsContent["items"][number] }) {
  return (
    <div className="text-center">
      <p className="text-[clamp(2rem,4vw,3rem)] font-[var(--font-weight-heading,700)] leading-none"
        style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-primary,#6C63FF)" }}>
        {item.prefix}{item.value}{item.suffix}
      </p>
      <p className="text-sm mt-2" style={{ color:"var(--color-text-secondary,#555)" }}>{item.label}</p>
    </div>
  );
}

export function StatsSection({ content: c, variant }: Props) {
  if (variant === "with-bg") {
    return (
      <section className="py-[var(--section-padding-y,6rem)]" style={{ background:"var(--color-primary,#6C63FF)" }}>
        <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {c.items.map((item) => (
              <div key={item.id} className="text-center">
                <p className="text-[clamp(2rem,4vw,3rem)] font-[var(--font-weight-heading,700)] leading-none text-white"
                  style={{ fontFamily:"var(--font-heading,sans-serif)" }}>
                  {item.prefix}{item.value}{item.suffix}
                </p>
                <p className="text-sm mt-2 text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  const gridCls = variant === "grid"
    ? "grid grid-cols-2 md:grid-cols-4 gap-8"
    : "flex flex-wrap justify-center gap-12";
  return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {c.heading && (
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[var(--font-weight-heading,700)] text-center mb-10"
            style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>{c.heading}</h2>
        )}
        <div className={gridCls}>{c.items.map((item) => <StatNumber key={item.id} item={item} />)}</div>
      </div>
    </section>
  );
}
