import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { portfolioSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { TopBar }    from "@/components/dashboard/layout/TopBar";
import { SeoEditor } from "@/components/dashboard/seo/SeoEditor";

export default async function SeoPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  let settings = await db.query.portfolioSettings.findFirst({
    where: eq(portfolioSettings.portfolioId, portfolio.id),
  });

  // Ensure settings row exists
  if (!settings) {
    const now = new Date().toISOString();
    const [created] = await db
      .insert(portfolioSettings)
      .values({ id: crypto.randomUUID(), portfolioId: portfolio.id, createdAt: now, updatedAt: now })
      .returning();
    settings = created;
  }

  return (
    <>
      <TopBar
        title="SEO"
        description="Metadata, Open Graph, scripts & analytics"
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <SeoEditor
          portfolioId={portfolio.id}
          slug={portfolio.slug}
          settings={settings}
        />
      </div>
    </>
  );
}
