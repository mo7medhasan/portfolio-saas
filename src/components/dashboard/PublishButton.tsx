"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Loader2 } from "lucide-react";

interface Props { currentStatus: string }

export function PublishButton({ currentStatus }: Props) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);
  const published = currentStatus === "published";

  async function toggle() {
    setLoading(true);
    await fetch("/api/portfolio", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: published ? "draft" : "published" }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{ background: published ? "#ef4444" : "var(--color-primary,#6C63FF)" }}
    >
      {loading    ? <Loader2    size={14} className="animate-spin" />
       : published ? <CheckCircle size={14} />
       :             <Upload     size={14} />}
      {loading ? "..." : published ? "Published" : "Publish"}
    </button>
  );
}