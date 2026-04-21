// src/app/api/contact/route.ts
import { db } from "@/db";
import { contactMessages, portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  portfolioSlug: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid" }, { status: 400 });

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, parsed.data.portfolioSlug),
  });
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  await db.insert(contactMessages).values({
    id: nanoid(),
    portfolioId: portfolio.id,
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    status: "unread",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return Response.json({ success: true });
}