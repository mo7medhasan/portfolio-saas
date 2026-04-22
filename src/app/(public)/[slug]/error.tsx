// src/app/(public)/[slug]/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "color-mix(in srgb, #EF4444 10%, transparent)" }}
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#EF4444">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      <div className="space-y-2">
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}
        >
          حصل خطأ
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--color-text-secondary,#555)" }}>
          {error.message ?? "حاجة غلط حصلت. حاول تاني."}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-[var(--radius-md,8px)] text-sm font-medium text-white"
        style={{ background: "var(--color-primary,#6C63FF)" }}
      >
        حاول تاني
      </button>
    </div>
  );
}