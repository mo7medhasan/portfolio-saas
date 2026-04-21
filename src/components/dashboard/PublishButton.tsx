// src/components/dashboard/PublishButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  portfolioId: string;
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
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
        isPublished
          ? "bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-md"
      }`}
    >
      {loading ? (
        <>
          <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
          Processing…
        </>
      ) : isPublished ? (
        <>✅ Published — click to unpublish</>
      ) : (
        <>🚀 Publish Portfolio</>
      )}
    </button>
  );
}