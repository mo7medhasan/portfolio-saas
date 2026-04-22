// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { db } from "@/db";
import { portfolios, designTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "";

  // جيب البيانات
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, slug),
  });

  const tokens = portfolio
    ? await db
        .select()
        .from(designTokens)
        .where(eq(designTokens.portfolioId, portfolio.id))
    : [];

  const primary = tokens.find((t) => t.key === "--color-primary")?.value ?? "#6C63FF";
  const bg = tokens.find((t) => t.key === "--color-background")?.value ?? "#ffffff";
  const title = portfolio?.title ?? "Portfolio";
  const tagline = portfolio?.tagline ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative blob */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: primary,
            opacity: 0.07,
            filter: "blur(60px)",
          }}
        />

        {/* Slug pill */}
        <div
          style={{
            display: "flex",
            padding: "6px 20px",
            borderRadius: 999,
            background: `${primary}18`,
            color: primary,
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 28,
            letterSpacing: "0.08em",
          }}
        >
          portfolioapp.com/{slug}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: bg === "#ffffff" ? "#111111" : "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Tagline */}
        {tagline && (
          <div
            style={{
              fontSize: 28,
              color: "#888888",
              marginTop: 20,
              textAlign: "center",
              maxWidth: 700,
            }}
          >
            {tagline}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: primary,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}