// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://portfolioapp.com";

  // جيب كل الـ published portfolios
  const publishedPortfolios = await db
    .select({
      slug: portfolios.slug,
      updatedAt: portfolios.updatedAt,
    })
    .from(portfolios)
    .where(eq(portfolios.status, "published"));

  return [
    // الصفحة الرئيسية
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // كل portfolio published
    ...publishedPortfolios.map((p) => ({
      url: `${BASE_URL}/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}