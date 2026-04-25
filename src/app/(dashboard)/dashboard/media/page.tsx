import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { media } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { TopBar }       from "@/components/dashboard/layout/TopBar";
import { MediaManager } from "@/components/dashboard/media/MediaManager";

export default async function MediaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  const files = await db
    .select()
    .from(media)
    .where(eq(media.portfolioId, portfolio.id))
    .orderBy(desc(media.createdAt))
    .limit(100);

  return (
    <>
      <TopBar
        title="Media"
        description={`${files.length} file${files.length !== 1 ? "s" : ""} uploaded`}
      />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <MediaManager initialFiles={files as never} />
      </div>
    </>
  );
}
