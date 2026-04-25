"use client";
import { useState } from "react";
import { Copy, Trash2, Check, FileText, Film, Image as ImageIcon } from "lucide-react";
import type { UploadedFile } from "@/hooks/useUpload";

interface Props {
  files: UploadedFile[];
  selectable?: boolean;             // used by MediaPicker
  onSelect?:   (url: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function FileIcon({ mime }: { mime: string }) {
  if (mime.startsWith("image/")) return <ImageIcon size={20} style={{ color: "var(--color-text-secondary,#555)" }} />;
  if (mime.startsWith("video/")) return <Film      size={20} style={{ color: "var(--color-text-secondary,#555)" }} />;
  return <FileText size={20} style={{ color: "var(--color-text-secondary,#555)" }} />;
}

function FileCard({
  file, selectable, onSelect,
  onDelete,
}: {
  file: UploadedFile;
  selectable?: boolean;
  onSelect?:  (url: string) => void;
  onDelete:   (id: string) => void;
}) {
  const [copied,   setCopied]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isImage = file.mimeType.startsWith("image/");
  const isVideo = file.mimeType.startsWith("video/");

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this file?")) return;
    setDeleting(true);
    await fetch(`/api/media/${file.id}`, { method: "DELETE" });
    onDelete(file.id);
  }

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      onClick={() => selectable && onSelect?.(file.url)}
      className="group relative rounded-xl border border-(--color-border,#e5e5e5) overflow-hidden transition-all"
      style={{
        background:  "var(--color-background,#fff)",
        cursor:      selectable ? "pointer" : "default",
      }}
    >
      {/* Preview */}
      <div
        className="relative w-full h-32 flex items-center justify-center"
        style={{ background: "var(--color-surface,#f8f8f8)" }}
      >
        {isImage ? (
          <img
            src={file.url}
            alt={file.originalName}
            className="w-full h-full object-cover"
          />
        ) : isVideo ? (
          <video src={file.url} className="w-full h-full object-cover" muted />
        ) : (
          <FileIcon mime={file.mimeType} />
        )}

        {/* Hover actions */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          {!selectable && (
            <>
              <button
                onClick={handleCopy}
                title="Copy URL"
                className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center transition-transform hover:scale-105"
              >
                {copied
                  ? <Check  size={14} style={{ color: "#16a34a" }} />
                  : <Copy   size={14} style={{ color: "#111" }} />
                }
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                title="Delete"
                className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50"
              >
                <Trash2 size={14} style={{ color: "#ef4444" }} />
              </button>
            </>
          )}
          {selectable && (
            <span
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: "var(--color-primary,#6C63FF)" }}
            >
              Select
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2">
        <p
          className="text-xs font-medium truncate"
          style={{ color: "var(--color-text-primary,#111)" }}
        >
          {file.originalName}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-secondary,#555)" }}>
          {formatSize(file.sizeBytes)}
          {file.width && file.height ? ` · ${file.width}×${file.height}` : ""}
        </p>
      </div>
    </div>
  );
}

export function MediaGrid({ files: initial, selectable, onSelect }: Props) {
  const [files, setFiles] = useState(initial);

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  if (files.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed gap-3"
        style={{ borderColor: "var(--color-border,#e5e5e5)" }}
      >
        <ImageIcon size={28} style={{ color: "var(--color-text-secondary,#555)", opacity: 0.3 }} />
        <p className="text-sm" style={{ color: "var(--color-text-secondary,#555)" }}>
          No files yet — upload one above
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          selectable={selectable}
          onSelect={onSelect}
          onDelete={removeFile}
        />
      ))}
    </div>
  );
}
