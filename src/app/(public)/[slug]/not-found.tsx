import Link from "next/link";

// src/app/(public)/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center bg-(--color-background,#fff)">
      <p
        className="text-8xl font-black tracking-tighter"
        style={{
          fontFamily: "var(--font-heading,sans-serif)",
          color: "var(--color-primary,#6C63FF)",
          opacity: 0.15,
        }}
      >
        404
      </p>
      <div className="-mt-8 space-y-2">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}
        >
          الصفحة مش موجودة
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary,#555)" }}>
          الـ portfolio ده مش موجود أو اتحذف.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-(--radius-md,8px) text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: "var(--color-primary,#6C63FF)" }}
      >
        الرجوع للرئيسية
      </Link>
    </div>
  );
}