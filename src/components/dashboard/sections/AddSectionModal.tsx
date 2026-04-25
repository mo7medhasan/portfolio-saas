// src/components/dashboard/sections/AddSectionModal.tsx
// 3-step flow: Type → Variant → Content → Save
"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getDefaultContent, getDefaultVariant } from "@/lib/sections/registry";
import { SectionTypePicker }    from "./SectionTypePicker";
import { SectionVariantPicker } from "./SectionVariantPicker";
import { SectionContentEditor } from "./SectionContentEditor";
import type { SectionType }     from "@/types/sections";

type Step = "type" | "variant" | "content";

interface Props { onClose: () => void; }

export function AddSectionModal({ onClose }: Props) {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("type");
  const [type,    setType]    = useState<SectionType | null>(null);
  const [variant, setVariant] = useState("");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const handleType = useCallback((t: string) => {
    const st = t as SectionType;
    setType(st);
    setVariant(getDefaultVariant(st));
    setContent(getDefaultContent(st) as Record<string, unknown>);
    setStep("variant");
  }, []);

  const handleVariant = useCallback((v: string) => {
    setVariant(v);
    setStep("content");
  }, []);

  async function save() {
    if (!type) return;
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, variant, content }),
      });
      if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error ?? "فشل الحفظ");
      router.refresh();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ");
    } finally { setSaving(false); }
  }

  const steps: { id:Step; label:string }[] = [
    {id:"type",label:"النوع"},{id:"variant",label:"التصميم"},{id:"content",label:"المحتوى"},
  ];
  const stepIdx = steps.findIndex(s=>s.id===step);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background:"rgba(0,0,0,.4)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl rounded-2xl border border-(--color-border,#e5e5e5) flex flex-col max-h-[90vh]"
        style={{ background:"var(--color-background,#fff)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border,#e5e5e5)">
          <div className="flex items-center gap-2">
            {steps.map((s,i)=>(
              <div key={s.id} className="flex items-center gap-2">
                {i>0&&<span style={{ color:"var(--color-border,#e5e5e5)" }}>/</span>}
                <button
                  className={`text-sm font-medium transition-colors ${step===s.id ? "text-(--color-primary,#6C63FF)" : i<stepIdx ? "hover:text-(--color-primary,#6C63FF)" : "opacity-40"}`}
                  style={{ color: step===s.id ? "var(--color-primary,#6C63FF)" : i<stepIdx ? "var(--color-text-secondary,#555)" : undefined }}
                  onClick={()=>{ if(i<stepIdx) setStep(s.id); }}
                  disabled={i>=stepIdx && step!==s.id}
                >
                  {s.label}
                </button>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-(--color-surface,#f8f8f8)"
            style={{ color:"var(--color-text-secondary,#555)" }}>✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step==="type"    && <SectionTypePicker onSelect={handleType} />}
          {step==="variant" && type && (
            <SectionVariantPicker sectionType={type} selectedVariant={variant} onSelect={handleVariant} onBack={()=>setStep("type")} />
          )}
          {step==="content" && type && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button onClick={()=>setStep("variant")}
                  className="w-8 h-8 rounded-lg border border-(--color-border,#e5e5e5) flex items-center justify-center"
                  style={{ color:"var(--color-text-secondary,#555)" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <h2 className="text-lg font-semibold" style={{ fontFamily:"var(--font-heading,sans-serif)", color:"var(--color-heading,#111)" }}>تعديل المحتوى</h2>
              </div>
              <SectionContentEditor sectionType={type} content={content} onChange={setContent} />
            </div>
          )}
        </div>

        {/* Footer */}
        {step!=="type" && (
          <div className="px-6 py-4 border-t border-(--color-border,#e5e5e5) flex items-center justify-between gap-3">
            {error && <p className="text-sm text-red-500 flex-1">{error}</p>}
            <div className="flex gap-3 ml-auto">
              {step==="variant" && (
                <button onClick={()=>setStep("content")}
                  className="px-5 py-2.5 rounded-(--radius-md,8px) text-sm font-medium text-white hover:opacity-90"
                  style={{ background:"var(--color-primary,#6C63FF)" }}>
                  تخصيص المحتوى ←
                </button>
              )}
              {step==="content" && (
                <button onClick={save} disabled={saving}
                  className="px-6 py-2.5 rounded-(--radius-md,8px) text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                  style={{ background:"var(--color-primary,#6C63FF)" }}>
                  {saving ? "جاري الحفظ..." : "إضافة ✓"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
