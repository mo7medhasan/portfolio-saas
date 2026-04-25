"use client";
import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { useUpload, type UploadedFile } from "@/hooks/useUpload";

interface Props {
  onUploaded: (file: UploadedFile) => void;
}

export function DropZone({ onUploaded }: Props) {
  const { upload, status, progress, error, reset } = useUpload();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    const uploaded = await upload(file);
    if (uploaded) {
      onUploaded(uploaded);
      setTimeout(reset, 2000); // reset status after 2 seconds
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => {
          if (status !== "uploading") {
            inputRef.current?.click();
          }
        }}
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all text-center cursor-pointer ${
          isDragging
            ? "border-(--color-primary,#6C63FF) bg-primary/5"
            : status === "uploading"
            ? "border-(--color-border,#e5e5e5) bg-(--color-surface,#f8f8f8) cursor-default"
            : "border-(--color-border,#e5e5e5) bg-(--color-surface,#f8f8f8) hover:bg-(--color-background,#fff)"
        }`}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={onChange}
          className="hidden"
          accept="image/*,video/*,application/pdf"
        />

        {status === "uploading" ? (
          <div className="w-full max-w-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-medium" style={{ color: "var(--color-text-primary,#111)" }}>
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border,#e5e5e5)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: "var(--color-primary,#6C63FF)" }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-(--color-background,#fff) border border-(--color-border,#e5e5e5) flex items-center justify-center mb-3 shadow-sm text-(--color-primary,#6C63FF)">
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary,#111)" }}>
              Click or drag file to this area to upload
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary,#555)" }}>
              Images (up to 50MB), Video (up to 50MB) depending on plan
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
      
      {status === "success" && (
        <p className="text-sm text-green-500 font-medium">
          File uploaded successfully!
        </p>
      )}
    </div>
  );
}
