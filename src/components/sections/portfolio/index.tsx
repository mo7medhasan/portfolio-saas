// src/components/sections/portfolio/index.tsx
import type { PortfolioContent } from "@/types/sections";

interface Props { content: PortfolioContent; variant: string; }

export function PortfolioSection({ content: c, variant }: Props) {
  const gridCls = variant==="masonry"
    ? "columns-1 sm:columns-2 lg:columns-3 gap-(--gap-cards,24px)"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-(--gap-cards,24px)";

  const featured = c.items.filter(i=>i.featured);
  const rest     = c.items.filter(i=>!i.featured);

  return (
    <section id="portfolio" className="py-(--section-padding-y,6rem) bg-(--color-background,#fff)">
      <div className="mx-auto max-w-(--container-max-width,1200px) px-6">
        {c.heading && (
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-(--font-weight-heading,700) whitespace-nowrap"
              style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>{c.heading}</h2>
            <div className="flex-1 h-px bg-(--color-border,#e5e5e5)" />
          </div>
        )}

        {variant==="featured" && featured.length>0 && (
          <div className="mb-8">
            {featured.map(p=>(
              <div key={p.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl border border-(--color-border,#e5e5e5) overflow-hidden mb-6"
                style={{ background:"var(--color-surface,#f8f8f8)" }}>
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-64 md:h-full object-cover" />}
                <div className="p-8 flex flex-col justify-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(t=><span key={t} className="px-2.5 py-1 text-xs rounded-full" style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)", color:"var(--color-primary,#6C63FF)" }}>{t}</span>)}
                  </div>
                  <h3 className="text-xl font-bold" style={{ color:"var(--color-heading,#111)" }}>{p.title}</h3>
                  {p.description&&<p className="text-sm leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{p.description}</p>}
                  <div className="flex gap-3">
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" className="text-sm font-medium" style={{ color:"var(--color-primary,#6C63FF)" }}>عرض المشروع →</a>}
                    {p.repoUrl&&<a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-sm" style={{ color:"var(--color-text-secondary,#555)" }}>GitHub</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={gridCls}>
          {(variant==="featured" ? rest : c.items).map(p=>(
            <div key={p.id} className={`rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5) overflow-hidden group transition-all hover:-translate-y-1 ${variant==="masonry"?"mb-(--gap-cards,24px) break-inside-avoid":""}`}
              style={{ background:"var(--color-surface,#f8f8f8)", boxShadow:"var(--shadow-card)" }}>
              {p.imageUrl && (
                <div className="overflow-hidden h-48">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0,3).map(t=><span key={t} className="px-2 py-0.5 text-xs rounded-full" style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)", color:"var(--color-primary,#6C63FF)" }}>{t}</span>)}
                </div>
                <h3 className="font-semibold" style={{ color:"var(--color-text-primary,#111)" }}>{p.title}</h3>
                {p.description&&<p className="text-xs leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{p.description}</p>}
                {(p.url||p.repoUrl)&&(
                  <div className="flex gap-3 pt-1">
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" className="text-xs font-medium" style={{ color:"var(--color-primary,#6C63FF)" }}>عرض →</a>}
                    {p.repoUrl&&<a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-xs" style={{ color:"var(--color-text-secondary,#555)" }}>GitHub</a>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
