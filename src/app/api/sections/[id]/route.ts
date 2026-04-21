// src/app/api/sections/[id]/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { validateSectionContent } from "@/lib/sections/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// PATCH /api/sections/[id] — تعديل section
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  // تأكد إن الـ section دي بتاعة الـ portfolio ده
  // (مش بس بتاعة أي portfolio)
  const section = await db.query.sections.findFirst({
    where: and(
      eq(sections.id, id),
      eq(sections.portfolioId, portfolio.id) // ← authorization check
    ),
  });

  if (!section) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  // لو في content جديد، validate بناءً على الـ type
  if (body.content) {
    const contentValidation = validateSectionContent(section.type, body.content);
    if (!contentValidation.success) {
      return Response.json({ error: contentValidation.error }, { status: 400 });
    }
    body.content = JSON.stringify(contentValidation.data);
  }

  await db
    .update(sections)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(sections.id, id));

  revalidatePath(`/${portfolio.slug}`);
  return Response.json({ success: true });
}

// DELETE /api/sections/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  await db
    .delete(sections)
    .where(
      and(
        eq(sections.id, id),
        eq(sections.portfolioId, portfolio.id) // ← نفس الـ authorization
      )
    );

  revalidatePath(`/${portfolio.slug}`);
  return Response.json({ success: true });
}