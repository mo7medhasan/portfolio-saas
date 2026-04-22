// src/components/sections/testimonials/index.tsx
"use client";
import { useState } from "react";
import type { TestimonialsContent } from "@/types/sections";

interface Props { content: TestimonialsContent; variant: string; }

function Stars({ n }: { n: number }) {
  return <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=>(
    <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 16 16" fill={i < n ? "var(--color-primary,#6C63FF)" : "var(--color-border,#e5e5e5)"}>
      <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10l-3.6 2 .7-4L2.2 5.2l4-.6L8 1z"/>
    </svg>
  ))}</div>;
}

function Card({ item }: { item: TestimonialsContent["items"][number] }) {
  return (
    <div className="p-6 rounded-[var(--radius-lg,16px)] border border-[var(--color-border,#e5e5e5)] space-y-4"
      style={{ background:"var(--color-background,#fff)", boxShadow:"var(--shadow-card)" }}>
      <Stars n={item.rating} />
      <p className="text-sm leading-relaxed italic" style={{ color:"var(--color-text-secondary,#555)" }}>"{item.quote}"</p>
      <div className="flex items-center gap-3">
        {item.avatarUrl
          ? <img src={item.avatarUrl} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
          : <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 15%,transparent)", color:"var(--color-primary,#6C63FF)" }}>
              {item.name[0]}
            </div>
        }
        <div>
          <p className="text-sm font-semibold" style={{ color:"var(--color-text-primary,#111)" }}>{item.name}</p>
          <p className="text-xs" style={{ color:"var(--color-text-secondary,#555)" }}>{item.role}{item.company ? ` — ${item.company}` : ""}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ content: c, variant }: Props) {
  const [active, setActive] = useState(0);

  const header = c.heading ? (
    <div className="text-center mb-12">
      <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[var(--font-weight-heading,700)]"
        style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>{c.heading}</h2>
      {c.subheading && <p className="text-base mt-3" style={{ color:"var(--color-text-secondary,#555)" }}>{c.subheading}</p>}
    </div>
  ) : null;

  if (variant === "slider") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-2xl px-6">
        {header}
        {c.items[active] && <Card item={c.items[active]} />}
        <div className="flex justify-center gap-2 mt-6">
          {c.items.map((_,i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === active ? "w-6" : ""}`}
              style={{ background: i === active ? "var(--color-primary,#6C63FF)" : "var(--color-border,#e5e5e5)" }} />
          ))}
        </div>
      </div>
    </section>
  );

  // masonry: same grid but CSS columns
  if (variant === "masonry") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {header}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-[var(--gap-cards,24px)]">
          {c.items.map(item => (
            <div key={item.id} className="mb-[var(--gap-cards,24px)] break-inside-avoid">
              <Card item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // default: grid
  return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        {header}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--gap-cards,24px)]">
          {c.items.map(item => <Card key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
