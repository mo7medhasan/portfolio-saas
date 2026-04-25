// src/app/(public)/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-(--color-background,#fff) animate-pulse">
      {/* Skeleton Hero */}
      <div
        className="w-full h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: "var(--color-surface,#f8f8f8)" }}
      >
        <div
          className="h-16 w-96 max-w-full rounded-xl"
          style={{ background: "var(--color-border,#e5e5e5)" }}
        />
        <div
          className="h-6 w-72 max-w-full rounded-lg"
          style={{ background: "var(--color-border,#e5e5e5)" }}
        />
        <div
          className="h-12 w-36 rounded-(--radius-md,8px)"
          style={{ background: "var(--color-border,#e5e5e5)" }}
        />
      </div>
    </div>
  );
}