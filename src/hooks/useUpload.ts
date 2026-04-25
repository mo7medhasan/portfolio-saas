"use client";
import { useState, useCallback } from "react";

export interface UploadedFile {
  id: string; url: string; originalName: string;
  mimeType: string; sizeBytes: number;
  width: number | null; height: number | null;
  folder: string; createdAt: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UseUploadReturn {
  upload:   (file: File) => Promise<UploadedFile | null>;
  status:   UploadStatus;
  progress: number;
  error:    string | null;
  reset:    () => void;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload  = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight }); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

export function useUpload(): UseUploadReturn {
  const [status,   setStatus]   = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error,    setError]    = useState<string | null>(null);

  const reset = useCallback(() => { setStatus("idle"); setProgress(0); setError(null); }, []);

  const upload = useCallback(async (file: File): Promise<UploadedFile | null> => {
    setStatus("uploading"); setProgress(10); setError(null);
    try {
      const dims = await getImageDimensions(file);
      setProgress(25);
      const form = new FormData();
      form.append("file", file);
      if (dims) { form.append("width", String(dims.width)); form.append("height", String(dims.height)); }
      setProgress(50);
      const res  = await fetch("/api/media", { method: "POST", body: form });
      setProgress(90);
      const data = await res.json() as { file?: UploadedFile; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Upload failed");
      setProgress(100); setStatus("success");
      return data.file ?? null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg); setStatus("error"); return null;
    }
  }, []);

  return { upload, status, progress, error, reset };
}
