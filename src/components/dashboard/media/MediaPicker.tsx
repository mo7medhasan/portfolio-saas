"use client";
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { DropZone }   from "./DropZone";
import { MediaGrid }  from "./MediaGrid";
import type { UploadedFile } from "@/hooks/useUpload";

interface Props {
  onSelect: (url: string) => void;
  onClose:  () => void;
}

export function MediaPicker({ onSelect, onClose }: Props) {
  const [files,   setFiles]   = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<"library" | "upload">("library");

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json() as Promise<{ media: UploadedFile[] }>)
      .then((d) => { setFiles(d.media ?? []); setLoading(false); });
  }, []);

  function handleUploaded(file: UploadedFile) {
    setFiles((prev) => [file, ...prev]);
    setTab("library");
  }

  function handleSelect(url: string) {
    onSelect(url);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-(--color-border,#e5e5e5) flex flex-col max-h-[85vh]"
        style={{ background: "var(--color-background,#fff)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-13 border-b border-(--color-border,#e5e5e5) shrink-0">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--color-surface,#f8f8f8)" }}>
            {(["library", "upload"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize"
                style={{
                  background: tab === t ? "var(--color-background,#fff)" : "transparent",
                  color:      tab === t ? "var(--color-text-primary,#111)" : "var(--color-text-secondary,#555)",
                  boxShadow:  tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t === "library" ? "Library" : "Upload new"}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-(--color-surface,#f8f8f8) transition-colors"
            style={{ color: "var(--color-text-secondary,#555)" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "upload" ? (
            <DropZone onUploaded={handleUploaded} />
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <div
                className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--color-primary,#6C63FF)", borderTopColor: "transparent" }}
              />
            </div>
          ) : (
            <MediaGrid
              files={files}
              selectable
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t border-(--color-border,#e5e5e5) flex items-center justify-between shrink-0"
          style={{ background: "var(--color-surface,#f8f8f8)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>
            {files.length} file{files.length !== 1 ? "s" : ""} in library
          </p>
          <button
            onClick={() => setTab("upload")}
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--color-primary,#6C63FF)" }}
          >
            <Upload size={12} /> Upload new file
          </button>
        </div>
      </div>
    </div>
  );
}
