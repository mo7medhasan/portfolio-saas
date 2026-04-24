"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  currentStatus: string;
}

export function PublishButton({ currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const published = currentStatus === "published";

  async function toggle() {
    setLoading(true);
    await fetch("/api/portfolio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: published ? "draft" : "published" }),
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
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 14 14" fill="none">
          <circle className="opacity-25" cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2"/>
          <path className="opacity-75" fill="currentColor" d="M7 1.5a5.5 5.5 0 015.5 5.5h-2A3.5 3.5 0 007 3.5V1.5z"/>
        </svg>
      ) : published ? (
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v6M4 5l3-3 3 3M2.5 10.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {loading ? "..." : published ? "Published" : "Publish"}
    </button>
  );
}