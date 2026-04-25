// src/components/dashboard/sections/SectionVariantPicker.tsx
"use client";
import { getEntry, getVariants } from "@/lib/sections/registry";
import type { SectionType } from "@/types/sections";

interface Props {
  sectionType: SectionType;
  selectedVariant: string;
  onSelect: (v: string) => void;
  onBack: () => void;
}

export function SectionVariantPicker({ sectionType, selectedVariant, onSelect, onBack }: Props) {
  const entry    = getEntry(sectionType);
  const variants = getVariants(sectionType);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="w-8 h-8 rounded-lg border border-(--color-border,#e5e5e5) flex items-center justify-center"
          style={{ color:"var(--color-text-secondary,#555)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <h2 className="text-lg font-semibold" style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
            اختار التصميم — {entry.label}
          </h2>
          <p className="text-xs mt-0.5" style={{ color:"var(--color-text-secondary,#555)" }}>{variants.length} تصاميم متاحة</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {variants.map((v) => {
          const selected = v.id === selectedVariant;
          return (
            <button key={v.id} onClick={() => onSelect(v.id)}
              className={`flex flex-col gap-3 p-4 rounded-xl border-2 text-left transition-all ${selected ? "border-(--color-primary,#6C63FF)" : "border-(--color-border,#e5e5e5) hover:border-(--color-primary,#6C63FF)/50 hover:-translate-y-0.5"}`}
              style={{ background: selected ? "color-mix(in srgb,var(--color-primary,#6C63FF) 4%,var(--color-background,#fff))" : "var(--color-background,#fff)" }}>
              <div className="w-full h-20 rounded-lg flex items-center justify-center text-2xl"
                style={{ background: selected ? "color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)" : "var(--color-surface,#f8f8f8)" }}>
                {entry.icon}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: selected ? "var(--color-primary,#6C63FF)" : "var(--color-text-primary,#111)" }}>{v.label}</p>
                  <p className="text-xs mt-0.5" style={{ color:"var(--color-text-secondary,#555)" }}>{v.description}</p>
                </div>
                {selected && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background:"var(--color-primary,#6C63FF)" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
