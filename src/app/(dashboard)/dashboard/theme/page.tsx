
// src/app/(dashboard)/dashboard/theme/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { ThemeEditor } from "@/components/dashboard/ThemeEditor";

export default async function ThemePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Live preview link */}
      <div
        className="flex items-center justify-between p-4 rounded-xl mb-8 border border-[var(--color-border,#e5e5e5)]"
        style={{ background: "var(--color-surface,#f8f8f8)" }}
      >
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary,#111)" }}
          >
            Preview الـ Portfolio
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary,#555)" }}>
            التغييرات بتظهر فوراً في الصفحة دي
          </p>
        </div>
        <a
          href={`/${portfolio.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--color-border,#e5e5e5)] transition-colors hover:border-[var(--color-primary,#6C63FF)]"
          style={{ color: "var(--color-text-primary,#111)" }}
        >
          فتح
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <ThemeEditor />
    </div>
  );
}