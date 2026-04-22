// src/components/dashboard/PublishButton.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  currentStatus: string;
}

export function PublishButton({ currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isPublished = currentStatus === "published";

  async function toggle() {
    setLoading(true);
    await fetch("/api/portfolio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: isPublished ? "draft" : "published",
      }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{ background: isPublished ? "#ef4444" : "var(--color-primary,#6C63FF)" }}
    >
      {loading ? "جاري..." : isPublished ? "إلغاء النشر" : "نشر الـ Portfolio"}
    </button>
  );
}