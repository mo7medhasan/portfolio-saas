// src/app/(dashboard)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId, getSectionsByPortfolioId } from "@/db/queries/portfolio";
import { SectionsList } from "@/components/dashboard/SectionsList";
import { PublishButton } from "@/components/dashboard/PublishButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  const allSections = await getSectionsByPortfolioId(portfolio.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
<Link href="/dashboard/theme">Theme Editor</Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">{portfolio.title}</h1>
          <a
            href={`/${portfolio.slug}`}
            target="_blank"
            className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors mt-1 inline-block"
          >
            /{portfolio.slug} ↗
          </a>
        </div>

        {/* Publish / Unpublish */}
        <PublishButton
          portfolioId={portfolio.id}
          currentStatus={portfolio.status}
        />
      </div>

      {/* Sections List */}
      <SectionsList
        sections={allSections}
        portfolioSlug={portfolio.slug}
      />
    </div>
  );
}