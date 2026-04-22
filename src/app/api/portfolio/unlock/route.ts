// src/app/api/portfolio/unlock/route.ts
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  slug: z.string(),
  password: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid" }, { status: 400 });

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, parsed.data.slug),
  });

  if (!portfolio || !portfolio.isPasswordProtected || !portfolio.passwordHash) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const isValid = await compare(parsed.data.password, portfolio.passwordHash);
  if (!isValid) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }

  // حط cookie بتفتح الـ portfolio للـ session دي
  const cookieStore = await cookies();
  cookieStore.set(`portfolio-unlock-${portfolio.id}`, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 ساعة
    path: "/",
  });

  return Response.json({ success: true });
}