// src/components/sections/faq/index.tsx
"use client";
import { useState } from "react";
import type { FaqContent, FaqItem } from "@/types/sections";

interface Props { content: FaqContent; variant: string; }

function SectionHeader({ heading, subheading }: { heading: string; subheading: string }) {
  return heading ? (
    <div className="text-center mb-12">
      <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[var(--font-weight-heading,700)]"
        style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>{heading}</h2>
      {subheading && <p className="text-base mt-3" style={{ color:"var(--color-text-secondary,#555)" }}>{subheading}</p>}
    </div>
  ) : null;
}

function AccordionItem({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--color-border,#e5e5e5)] last:border-0">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors hover:text-[var(--color-primary,#6C63FF)]"
        style={{ color:"var(--color-text-primary,#111)" }}>
        <span className="font-medium text-sm">{item.question}</span>
        <svg className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{item.answer}</p>}
    </div>
  );
}

export function FaqSection({ content: c, variant }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen(prev => prev === id ? null : id);

  if (variant === "two-col") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]">
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
        <SectionHeader heading={c.heading} subheading={c.subheading} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
          {c.items.map(item => <AccordionItem key={item.id} item={item} open={open === item.id} onToggle={() => toggle(item.id)} />)}
        </div>
      </div>
    </section>
  );

  if (variant === "minimal") return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-background,#fff)]">
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeader heading={c.heading} subheading={c.subheading} />
        <div className="space-y-6">
          {c.items.map(item => (
            <div key={item.id}>
              <p className="font-semibold text-sm mb-1.5" style={{ color:"var(--color-text-primary,#111)" }}>{item.question}</p>
              <p className="text-sm leading-relaxed" style={{ color:"var(--color-text-secondary,#555)" }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // default: accordion
  return (
    <section className="py-[var(--section-padding-y,6rem)] bg-[var(--color-background,#fff)]">
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeader heading={c.heading} subheading={c.subheading} />
        <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border,#e5e5e5)] px-6"
          style={{ background:"var(--color-surface,#f8f8f8)" }}>
          {c.items.map(item => <AccordionItem key={item.id} item={item} open={open === item.id} onToggle={() => toggle(item.id)} />)}
        </div>
      </div>
    </section>
  );
}
