// src/components/dashboard/sections/SectionTypePicker.tsx
"use client";
import { getAllEntries } from "@/lib/sections/registry";

interface Props { onSelect: (type: string) => void; }

export function SectionTypePicker({ onSelect }: Props) {
  const entries = getAllEntries();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>
          اختار نوع الـ Section
        </h2>
        <p className="text-sm mt-1" style={{ color:"var(--color-text-secondary,#555)" }}>
          كل نوع عنده تصاميم مختلفة تختارها في الخطوة الجاية
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {entries.map((e) => (
          <button key={e.type} onClick={() => onSelect(e.type)}
            className="group flex flex-col gap-3 p-4 rounded-xl border border-(--color-border,#e5e5e5) text-left transition-all hover:border-(--color-primary,#6C63FF) hover:-translate-y-0.5"
            style={{ background:"var(--color-background,#fff)" }}>
            <span className="text-xl w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background:"color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)" }}>
              {e.icon}
            </span>
            <div>
              <p className="text-sm font-semibold transition-colors group-hover:text-(--color-primary,#6C63FF)"
                style={{ color:"var(--color-text-primary,#111)" }}>{e.label}</p>
              <p className="text-xs mt-0.5 leading-snug" style={{ color:"var(--color-text-secondary,#555)" }}>{e.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
