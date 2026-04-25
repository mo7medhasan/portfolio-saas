import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { Sidebar }   from "@/components/dashboard/layout/Sidebar";
import { MobileNav } from "@/components/dashboard/layout/MobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  // Unread messages badge count
  const [{ value: unreadCount }] = await db
    .select({ value: count() })
    .from(contactMessages)
    .where(
      and(
        eq(contactMessages.portfolioId, portfolio.id),
        eq(contactMessages.status, "unread")
      )
    );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-surface,#f8f8f8)" }}>

      {/* Sidebar — desktop only */}
      <div
        className="hidden md:flex flex-col w-56 shrink-0 h-full border-r border-(--color-border,#e5e5e5)"
        style={{ background: "var(--color-background,#fff)" }}
      >
        <Sidebar
          portfolioSlug={portfolio.slug}
          portfolioTitle={portfolio.title}
          userName={session.user.name ?? session.user.email}
          unreadCount={Number(unreadCount)}
        />
      </div>

      {/* Page content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
