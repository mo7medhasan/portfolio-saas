// src/db/queries/portfolio.ts
import { db } from "@/db";
import { portfolios, sections, portfolioSettings, designTokens } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

// ── جيب الـ portfolio بتاع الـ user اللي logged in ─────────
export async function getPortfolioByUserId(userId: string) {
  return db.query.portfolios.findFirst({
    where: eq(portfolios.userId, userId),
    with: {
      settings: true, // JOIN مع portfolio_settings
    },
  });
}

// ── جيب الـ portfolio بالـ slug — للـ public page ──────────
export async function getPortfolioBySlug(slug: string) {
  return db.query.portfolios.findFirst({
    where: eq(portfolios.slug, slug),
    with: {
      settings: true,
      sections: {
        where: eq(sections.isVisible, true),
        orderBy: [asc(sections.sortOrder)], // مرتبين حسب الترتيب
      },
      designTokens: true,
    },
  });
}

// ── جيب الـ sections بتاعة portfolio معين ─────────────────
export async function getSectionsByPortfolioId(portfolioId: string) {
  return db
    .select()
    .from(sections)
    .where(eq(sections.portfolioId, portfolioId))
    .orderBy(asc(sections.sortOrder));
}