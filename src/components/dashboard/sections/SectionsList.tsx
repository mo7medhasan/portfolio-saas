// src/components/dashboard/sections/SectionsList.tsx
// Replaces old SectionsList — Add / Edit / Toggle / Delete.
// Uses useOptimistic (React 19) for instant UI feedback.
"use client";
import { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AddSectionModal } from "./AddSectionModal";
import { EditSectionModal } from "./EditSectionModal";
import { getEntry } from "@/lib/sections/registry";
import type { SectionRow } from "@/types/sections";
import Link from "next/link";

interface Props { sections: SectionRow[]; }

export function SectionsList({ sections: initial }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<SectionRow | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [sections, setOptimistic] = useOptimistic(
    initial,
    (state, action: { type: "remove" | "toggle"; id: string }) => {
      if (action.type === "remove") return state.filter(s => s.id !== action.id);
      if (action.type === "toggle") return state.map(s => s.id === action.id ? { ...s, isVisible: !s.isVisible } : s);
      return state;
    }
  );

  async function handleDelete(id: string) {
    if (!confirm("حذف الـ section؟")) return;
    setDeleting(id);
    startTransition(() => setOptimistic({ type: "remove", id }));
    await fetch(`/api/sections/${id}`, { method: "DELETE" });
    router.refresh();
    setDeleting(null);
  }

  async function handleToggle(id: string) {
    startTransition(() => setOptimistic({ type: "toggle", id }));
    const sec = sections.find(s => s.id === id);
    await fetch(`/api/sections/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isVisible: !sec?.isVisible }) });
    router.refresh();
  }

  return (
    <>
      {/* Add button */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h2 className="text-lg font-bold m-0" style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}>
            إدارة الـ Sections
          </h2>
        </div>
        {/* Add button */}
        <div className="flex flex-wrap items-center gap-5 justify-between">
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md,8px)] text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-primary,#6C63FF)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            إضافة Section
          </button>

          <Link href="/dashboard/theme">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md,8px)] text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--color-primary,#6C63FF)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              إدارة الثيمات
            </button>
          </Link>
        </div>
      </div>

      {/* List */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed gap-4"
          style={{ borderColor: "var(--color-border,#e5e5e5)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)" }}>◈</div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary,#111)" }}>مفيش sections لسه</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary,#555)" }}>اضغط &ldquo;إضافة Section&rdquo; لتبدأ</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map(sec => {
            const entry = getEntry(sec.type);
            const variantLabel = entry.variants.find(v => v.id === sec.variant)?.label ?? sec.variant;
            return (
              <div key={sec.id}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--color-border,#e5e5e5)] transition-all hover:border-[var(--color-primary,#6C63FF)]/30"
                style={{ background: "var(--color-background,#fff)", opacity: sec.isVisible ? 1 : 0.55 }}>

                {/* Drag handle */}
                <div className="cursor-grab opacity-30 hover:opacity-60 flex-shrink-0" style={{ color: "var(--color-text-secondary,#555)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="5" r="1.5" /><circle cx="11" cy="5" r="1.5" />
                    <circle cx="5" cy="11" r="1.5" /><circle cx="11" cy="11" r="1.5" />
                  </svg>
                </div>

                {/* Icon */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)" }}>
                  {entry.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary,#111)" }}>
                    {sec.label ?? entry.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>{variantLabel}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Edit */}
                  <button onClick={() => setEditing(sec)}
                    className="h-8 px-3 text-xs font-medium rounded-lg border border-[var(--color-border,#e5e5e5)] transition-all hover:border-[var(--color-primary,#6C63FF)] hover:text-[var(--color-primary,#6C63FF)]"
                    style={{ color: "var(--color-text-secondary,#555)" }}>تعديل</button>

                  {/* Visibility */}
                  <button onClick={() => handleToggle(sec.id)} title={sec.isVisible ? "إخفاء" : "إظهار"}
                    className="w-8 h-8 rounded-lg border border-[var(--color-border,#e5e5e5)] flex items-center justify-center transition-colors hover:border-[var(--color-primary,#6C63FF)]"
                    style={{ color: "var(--color-text-secondary,#555)" }}>
                    {sec.isVisible
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12a18.09 18.09 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>
                    }
                  </button>

                  {/* Delete */}
                  <button onClick={() => handleDelete(sec.id)} disabled={deleting === sec.id}
                    className="w-8 h-8 rounded-lg border border-[var(--color-border,#e5e5e5)] flex items-center justify-center transition-colors hover:border-red-300 hover:text-red-500 disabled:opacity-40"
                    style={{ color: "var(--color-text-secondary,#555)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <AddSectionModal onClose={() => { setShowAdd(false); router.refresh(); }} />}
      {editing && <EditSectionModal section={editing} onClose={() => { setEditing(null); router.refresh(); }} />}
    </>
  );
}
