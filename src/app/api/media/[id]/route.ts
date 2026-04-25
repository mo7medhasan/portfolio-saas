import { auth } from "@/auth";
import { db } from "@/db";
import { media } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { del } from "@vercel/blob";
import { getPortfolioByUserId } from "@/db/queries/portfolio";

// DELETE /api/media/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  // Find the file — ensure it belongs to this portfolio
  const file = await db.query.media.findFirst({
    where: and(
      eq(media.id, id),
      eq(media.portfolioId, portfolio.id)
    ),
  });

  if (!file) return Response.json({ error: "File not found" }, { status: 404 });

  // Delete from Vercel Blob
  await del(file.url);

  // Delete from DB
  await db.delete(media).where(eq(media.id, id));

  return Response.json({ success: true });
}

// PATCH /api/media/[id] — update alt text or caption
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as { alt?: string; caption?: string };

  await db
    .update(media)
    .set({
      alt:       body.alt     ?? undefined,
      caption:   body.caption ?? undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(media.id, id),
        eq(media.portfolioId, portfolio.id)
      )
    );

  return Response.json({ success: true });
}
