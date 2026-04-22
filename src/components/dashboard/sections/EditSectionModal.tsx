// src/components/dashboard/sections/EditSectionModal.tsx
// Edit existing section: switch between Content tab and Design tab.
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionVariantPicker } from "./SectionVariantPicker";
import { SectionContentEditor } from "./SectionContentEditor";
import type { SectionRow } from "@/types/sections";

type Tab = "content" | "design";
interface Props { section: SectionRow; onClose: () => void; }

export function EditSectionModal({ section, onClose }: Props) {
  const router  = useRouter();
  const [tab,     setTab]     = useState<Tab>("content");
  const [variant, setVariant] = useState(section.variant);
  const [content, setContent] = useState<Record<string, unknown>>(()=>{
    try { return JSON.parse(section.content); } catch { return {}; }
  });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  async function save() {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: "PATCH", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ variant, content }),
      });
      if (!res.ok) throw new Error("فشل الحفظ");
      router.refresh(); onClose();
    } catch(e) {
      setError(e instanceof Error ? e.message : "حصل خطأ");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background:"rgba(0,0,0,.4)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--color-border,#e5e5e5)] flex flex-col max-h-[90vh]"
        style={{ background:"var(--color-background,#fff)" }}>

        {/* Header tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border,#e5e5e5)]">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background:"var(--color-surface,#f8f8f8)" }}>
            {(["content","design"] as Tab[]).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${tab===t ? "bg-[var(--color-background,#fff)] shadow-sm" : "opacity-60 hover:opacity-100"}`}
                style={{ color:"var(--color-text-primary,#111)" }}>
                {t==="content" ? "المحتوى" : "التصميم"}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-surface,#f8f8f8)]"
            style={{ color:"var(--color-text-secondary,#555)" }}>✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab==="content" && (
            <SectionContentEditor sectionType={section.type} content={content} onChange={setContent} />
          )}
          {tab==="design" && (
            <SectionVariantPicker sectionType={section.type} selectedVariant={variant} onSelect={setVariant} onBack={onClose} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border,#e5e5e5)] flex items-center justify-between">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 ml-auto">
            <button onClick={onClose}
              className="px-4 py-2.5 text-sm rounded-[var(--radius-md,8px)] border border-[var(--color-border,#e5e5e5)] hover:border-[var(--color-primary,#6C63FF)] transition-colors"
              style={{ color:"var(--color-text-primary,#111)" }}>إلغاء</button>
            <button onClick={save} disabled={saving}
              className="px-6 py-2.5 text-sm font-medium rounded-[var(--radius-md,8px)] text-white disabled:opacity-50"
              style={{ background:"var(--color-primary,#6C63FF)" }}>
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
