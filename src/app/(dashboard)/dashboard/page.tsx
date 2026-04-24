import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId, getSectionsByPortfolioId } from "@/db/queries/portfolio";
import { SectionsList }  from "@/components/dashboard/sections/SectionsList";
import { PublishButton } from "@/components/dashboard/PublishButton";
import { TopBar }        from "@/components/dashboard/layout/TopBar";
import type { SectionRow } from "@/types/sections";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  const rawSections = await getSectionsByPortfolioId(portfolio.id);
  const sections = rawSections as SectionRow[];

  return (
    <>
      <TopBar
        title="Sections"
        description={`/${portfolio.slug}`}
        actions={<PublishButton currentStatus={portfolio.status} />}
      />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <SectionsList sections={sections} />
      </div>
    </>
  );
}