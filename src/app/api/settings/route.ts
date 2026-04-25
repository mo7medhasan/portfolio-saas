// PATCH — save portfolio general settings
import { auth } from "@/auth";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  title:     z.string().min(1).max(80).optional(),
  tagline:   z.string().max(160).optional(),
  locale:    z.enum(["ar", "en"]).optional(),
  direction: z.enum(["ltr", "rtl"]).optional(),
  isPasswordProtected: z.boolean().optional(),
  showPlatformBranding: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body   = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await db
    .update(portfolios)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(portfolios.id, portfolio.id));

  revalidatePath(`/${portfolio.slug}`);
  return Response.json({ success: true });
}

// DELETE — delete portfolio (danger zone)
export async function DELETE() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  // Cascade deletes handle sections, tokens, settings, media etc.
  await db.delete(portfolios).where(eq(portfolios.id, portfolio.id));

  return Response.json({ success: true });
}
