"use client";
import { useState } from "react";
import { FolderOpen, X } from "lucide-react";
import { MediaPicker } from "./MediaPicker";

interface Props {
  label:     string;
  value:     string;
  onChange:  (url: string) => void;
  hint?:     string;
}

const inputCls = [
  "flex-1 px-3 py-2 text-sm rounded-(--radius-md,8px)",
  "border border-(--color-border,#e5e5e5) outline-none",
  "transition-all focus:border-(--color-primary,#6C63FF)",
  "focus:ring-2 focus:ring-(--color-primary,#6C63FF)/10",
  "bg-(--color-surface,#f8f8f8)",
].join(" ");

export function ImageInput({ label, value, onChange, hint }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium" style={{ color: "var(--color-text-primary,#111)" }}>
          {label}
        </label>
        {hint && <p className="text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>{hint}</p>}

        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or browse library"
            className={inputCls}
            style={{ color: "var(--color-text-primary,#111)" }}
          />
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            title="Browse media library"
            className="shrink-0 px-3 py-2 rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) transition-all hover:border-(--color-primary,#6C63FF) hover:text-(--color-primary,#6C63FF) flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--color-text-secondary,#555)", background: "var(--color-surface,#f8f8f8)" }}
          >
            <FolderOpen size={14} /> Browse
          </button>
        </div>

        {/* Preview */}
        {value && (
          <div className="relative mt-2 w-full h-32 rounded-lg overflow-hidden border border-(--color-border,#e5e5e5)">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
              title="Remove image"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {pickerOpen && (
        <MediaPicker
          onSelect={(url) => { onChange(url); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
