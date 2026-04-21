// src/app/api/sections/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPortfolioByUserId, getSectionsByPortfolioId } from "@/db/queries/portfolio";
import { validateSectionContent } from "@/lib/sections/schemas";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";

// GET /api/sections — جيب كل sections الـ portfolio
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const allSections = await getSectionsByPortfolioId(portfolio.id);
  return Response.json({ sections: allSections });
}

// POST /api/sections — إضافة section جديدة
const createSectionSchema = z.object({
  type: z.enum([
    "hero", "about", "services", "portfolio", "experience",
    "skills", "testimonials", "blog", "contact", "pricing",
    "faq", "team", "stats", "clients", "cta", "custom_html",
  ]),
  variant: z.string().default("default"),
  content: z.record(z.string(), z.unknown()).default({}),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = createSectionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // تحقق من الـ content بناءً على الـ type
  const contentValidation = validateSectionContent(
    parsed.data.type,
    parsed.data.content
  );
  if (!contentValidation.success) {
    return Response.json({ error: contentValidation.error }, { status: 400 });
  }

  // احسب الـ sortOrder — الـ section الجديدة بتروح في الآخر
  const existingSections = await getSectionsByPortfolioId(portfolio.id);
  const maxOrder = existingSections.length > 0
    ? Math.max(...existingSections.map(s => s.sortOrder))
    : -1;

  const now = new Date().toISOString();
  const newSection = {
    id: nanoid(),
    portfolioId: portfolio.id,
    type: parsed.data.type,
    variant: parsed.data.variant,
    content: JSON.stringify(contentValidation.data), // خزّن كـ JSON string
    isVisible: true,
    sortOrder: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(sections).values(newSection);
  revalidatePath(`/${portfolio.slug}`);

  return Response.json({ section: newSection }, { status: 201 });
}