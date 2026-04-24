// src/app/(dashboard)/dashboard/layout.tsx
// Root layout for ALL dashboard pages — sidebar + mobile nav + content area.
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { contactMessages } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { Sidebar }   from "@/components/dashboard/layout/Sidebar";
import { MobileNav } from "@/components/dashboard/layout/MobileNav";
import { db } from "@/db";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  // Unread messages count for the badge
  const [result] = await db
    .select({ count: count() })
    .from(contactMessages)
    .where(
      and(
        eq(contactMessages.portfolioId, portfolio.id),
        eq(contactMessages.status, "unread")
      )
    );
  const unreadCount = Number(result?.count ?? 0);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--color-surface,#f8f8f8)" }}
    >
      {/* ── Sidebar — desktop only ────────────────────────────────────────── */}
      <div
        className="hidden md:flex flex-col w-56 h-full border-r border-[var(--color-border,#e5e5e5)] flex-shrink-0"
        style={{ background: "var(--color-background,#fff)" }}
      >
        <Sidebar
          portfolioSlug={portfolio.slug}
          portfolioTitle={portfolio.title}
          userName={session.user.name ?? session.user.email}
          unreadCount={unreadCount}
        />
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ─────────────────────────────────────────────── */}
      <MobileNav />
    </div>
  );
}
