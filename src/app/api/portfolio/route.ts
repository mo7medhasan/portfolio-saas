// src/app/api/portfolio/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // session.user.id ده الـ userId اللي هتحتاجه في كل query
  const userId = session.user.id;

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, userId),
  });

  return Response.json({ portfolio });
}