// src/app/api/presets/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { themePresets, designTokens } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// GET /api/presets — global presets + presets الـ user
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const presets = await db
    .select()
    .from(themePresets)
    .where(
      or(
        eq(themePresets.isGlobal, true),        // الـ presets الـ built-in
        eq(themePresets.createdBy, session.user.id) // presets الـ user نفسه
      )
    )
    .orderBy(themePresets.isGlobal, themePresets.name);

  return Response.json({ presets });
}

// POST /api/presets/apply — طبّق preset على الـ portfolio
const applySchema = z.object({
  presetId: z.string(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid preset id" }, { status: 400 });
  }

  // جيب الـ preset
  const preset = await db.query.themePresets.findFirst({
    where: eq(themePresets.id, parsed.data.presetId),
  });
  if (!preset) return Response.json({ error: "Preset not found" }, { status: 404 });

  // الـ tokens في الـ preset — JSON object { '--color-primary': '#...' }
  const tokenMap = JSON.parse(preset.tokens) as Record<string, string>;
  const now = new Date().toISOString();

  // طبّق كل token في الـ preset على الـ portfolio
  await db.transaction(async (tx) => {
    for (const [key, value] of Object.entries(tokenMap)) {
      await tx
        .update(designTokens)
        .set({ value, updatedAt: now })
        .where(
          and(
            eq(designTokens.portfolioId, portfolio.id),
            eq(designTokens.key, key)
          )
        );
    }
  });

  revalidatePath(`/${portfolio.slug}`);
  return Response.json({ success: true });
}