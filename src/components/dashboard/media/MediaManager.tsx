"use client";
import { useState } from "react";
import { DropZone }  from "./DropZone";
import { MediaGrid } from "./MediaGrid";
import type { UploadedFile } from "@/hooks/useUpload";

interface Props { initialFiles: UploadedFile[] }

function formatMB(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(1);
}

export function MediaManager({ initialFiles }: Props) {
  const [files, setFiles] = useState(initialFiles);

  const totalBytes = files.reduce((acc, f) => acc + f.sizeBytes, 0);
  // 100 MB default — real limit comes from plan (shown for awareness)
  const limitBytes = 100 * 1024 * 1024;
  const pct = Math.min((totalBytes / limitBytes) * 100, 100);

  function handleUploaded(file: UploadedFile) {
    setFiles((prev) => [file, ...prev]);
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <DropZone onUploaded={handleUploaded} />

      {/* Storage indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>
          <span>Storage used</span>
          <span>{formatMB(totalBytes)} MB / 100 MB</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border,#e5e5e5)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: pct > 80
                ? "var(--color-text-danger,#ef4444)"
                : "var(--color-primary,#6C63FF)",
            }}
          />
        </div>
      </div>

      {/* Files grid */}
      <MediaGrid files={files} onSelect={() => {}} />
    </div>
  );
}
