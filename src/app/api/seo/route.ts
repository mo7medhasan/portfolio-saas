// PATCH — save SEO + script injection settings
import { auth } from "@/auth";
import { db } from "@/db";
import { portfolioSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const seoSchema = z.object({
  // Meta
  metaTitle:       z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords:    z.string().optional(),
  // OG
  ogTitle:         z.string().max(60).optional(),
  ogDescription:   z.string().max(160).optional(),
  ogImageUrl:      z.string().optional(),
  twitterHandle:   z.string().optional(),
  // Robots
  robotsDirective: z.enum(["index, follow","noindex, nofollow","index, nofollow","noindex, follow"]).optional(),
  // Code injection
  headScripts:     z.string().optional(),
  bodyEndScripts:  z.string().optional(),
  customCss:       z.string().optional(),
  // Analytics
  googleAnalyticsId:    z.string().optional(),
  googleTagManagerId:   z.string().optional(),
  facebookPixelId:      z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body   = await req.json();
  const parsed = seoSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await db
    .update(portfolioSettings)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(portfolioSettings.portfolioId, portfolio.id));

  // Invalidate public page cache
  revalidatePath(`/${portfolio.slug}`);

  return Response.json({ success: true });
}
