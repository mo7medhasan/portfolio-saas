// src/app/api/sections/reorder/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reorderSchema = z.object({
  // array من { id, sortOrder } — الترتيب الجديد
  items: z.array(z.object({
    id: z.string(),
    sortOrder: z.number().int().min(0),
  })),
});

// PATCH /api/sections/reorder
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid order data" }, { status: 400 });
  }

  // update كل section بالـ sortOrder الجديد في transaction
  await db.transaction(async (tx) => {
    for (const item of parsed.data.items) {
      await tx
        .update(sections)
        .set({ sortOrder: item.sortOrder, updatedAt: new Date().toISOString() })
        .where(
          and(
            eq(sections.id, item.id),
            eq(sections.portfolioId, portfolio.id)
          )
        );
    }
  });

  revalidatePath(`/${portfolio.slug}`);
  return Response.json({ success: true });
}