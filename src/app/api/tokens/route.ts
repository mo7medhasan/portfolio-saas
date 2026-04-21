// src/app/api/tokens/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { designTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// GET /api/tokens
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const tokens = await db
    .select()
    .from(designTokens)
    .where(eq(designTokens.portfolioId, portfolio.id))
    .orderBy(designTokens.sortOrder);

  return Response.json({ tokens });
}

// PATCH /api/tokens — bulk update
const bulkUpdateSchema = z.object({
  updates: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      darkValue: z.string().nullable().optional(),
    })
  ),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = bulkUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const now = new Date().toISOString();

  await db.transaction(async (tx) => {
    for (const update of parsed.data.updates) {
      await tx
        .update(designTokens)
        .set({ value: update.value, darkValue: update.darkValue ?? null, updatedAt: now })
        .where(
          and(
            eq(designTokens.portfolioId, portfolio.id),
            eq(designTokens.key, update.key)
          )
        );
    }
  });

  revalidatePath(`/${portfolio.slug}`);
  return Response.json({ success: true });
}