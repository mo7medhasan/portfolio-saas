// src/app/(dashboard)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId, getSectionsByPortfolioId } from "@/db/queries/portfolio";
import { SectionsList }   from "@/components/dashboard/sections/SectionsList";
import { PublishButton }  from "@/components/dashboard/PublishButton";
import type { SectionRow } from "@/types/sections";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

const sections = (await getSectionsByPortfolioId(portfolio.id)) as SectionRow[];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}>
            {portfolio.title}
          </h1>
          <a href={`/${portfolio.slug}`} target="_blank"
            className="text-sm hover:underline"
            style={{ color: "var(--color-primary,#6C63FF)" }}>
            /{portfolio.slug} ↗
          </a>
        </div>
        <PublishButton currentStatus={portfolio.status} />
      </div>

      {/* Sections */}
      <SectionsList sections={sections} />
    </div>
  );
}