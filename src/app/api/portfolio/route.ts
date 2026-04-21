// src/app/api/portfolio/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// GET /api/portfolio — جيب portfolio الـ user الحالي
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ portfolio });
}

// PATCH /api/portfolio — تعديل الـ portfolio (title، slug، publish...)
const updateSchema = z.object({
  title: z.string().min(1).optional(),
  tagline: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // جيب الـ portfolio الأول عشان تتأكد إنه بتاع الـ user ده
  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const updatedData = {
    ...parsed.data,
    updatedAt: new Date().toISOString(),
    // لو بيعمل publish، حط الـ publishedAt
    ...(parsed.data.status === "published" && !portfolio.publishedAt
      ? { publishedAt: new Date().toISOString() }
      : {}),
  };

  await db
    .update(portfolios)
    .set(updatedData)
    .where(eq(portfolios.id, portfolio.id));

  // ← هنا السحر — بيقول لـ Next.js "الـ cache القديم انتهى"
  revalidatePath(`/${portfolio.slug}`);

  return Response.json({ success: true });
}