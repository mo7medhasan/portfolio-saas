// src/components/portfolio/PasswordGate.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
}

export function PasswordGate({ slug }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/portfolio/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password }),
    });

    if (res.ok) {
      // الـ API بتحط cookie وبعدين نعمل refresh
      router.refresh();
    } else {
      setError("الباسورد غلط");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-(--color-background,#fff)">
      <div
        className="w-full max-w-sm p-8 rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5)"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "color-mix(in srgb, var(--color-primary,#6C63FF) 10%, transparent)" }}
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary,#6C63FF)" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h1
          className="text-xl font-bold text-center mb-1"
          style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}
        >
          محتوى محمي
        </h1>
        <p
          className="text-sm text-center mb-6"
          style={{ color: "var(--color-text-secondary,#555)" }}
        >
          أدخل الباسورد عشان تشوف الـ portfolio
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="الباسورد"
            required
            className="w-full px-4 py-3 text-sm rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) outline-none transition-all focus:border-(--color-primary,#6C63FF) focus:ring-2 focus:ring-(--color-primary,#6C63FF)/10"
            style={{
              background: "var(--color-surface,#f8f8f8)",
              color: "var(--color-text-primary,#111)",
            }}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-(--radius-md,8px) text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--color-primary,#6C63FF)" }}
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}