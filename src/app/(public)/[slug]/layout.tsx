// src/app/(public)/[slug]/layout.tsx
import { getPortfolioBySlug } from "@/db/queries/portfolio";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function PortfolioLayout({ params, children }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) notFound();

  const tokens = portfolio.designTokens ?? [];

  // ── Build CSS string ──────────────────────────────────
  // light mode vars
  const lightVars = tokens
    .map((t) => `${t.key}: ${t.value};`)
    .join(" ");

  // dark mode vars — بس الـ tokens اللي عندها darkValue
  const darkVars = tokens
    .filter((t) => t.darkValue)
    .map((t) => `${t.key}: ${t.darkValue};`)
    .join(" ");

  // Google Fonts — نجيب الـ font names من الـ tokens
  const headingFont = tokens.find((t) => t.key === "--font-heading")?.value ?? "";
  const bodyFont = tokens.find((t) => t.key === "--font-body")?.value ?? "";

  // Extract font name من القيمة زي "'Sora', sans-serif" → "Sora"
  const extractFontName = (v: string) =>
    v.match(/'([^']+)'/)?.[1] ?? v.split(",")[0].trim();

  const fontNames = [
    extractFontName(headingFont),
    extractFontName(bodyFont),
  ]
    .filter(Boolean)
    .filter((f) => !["sans-serif", "serif", "monospace"].includes(f));

  const googleFontsUrl =
    fontNames.length > 0
      ? `https://fonts.googleapis.com/css2?${fontNames
        .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700;800`)
        .join("&")}&display=swap`
      : null;

  // ── Settings ──────────────────────────────────────────
  const settings = portfolio.settings;
  const customCss = settings?.customCss ?? "";
  const headScripts = settings?.headScripts ?? "";
  const bodyEndScripts = settings?.bodyEndScripts ?? "";

  return (
    <>
      {/* Google Fonts — Next.js hoists link tags from nested layouts into <head> */}
      {googleFontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={googleFontsUrl} rel="stylesheet" />
        </>
      )}

      {/* Design Tokens — CSS Variables (hoisted into <head> by Next.js) */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          ${lightVars}
          font-size: var(--font-size-base, 16px);
          font-family: var(--font-body, sans-serif);
          color: var(--color-text-primary, #111);
          background: var(--color-background, #fff);
        }
        @media (prefers-color-scheme: dark) {
          :root { ${darkVars} }
        }
        ${customCss}
      `}</style>

      {/* Custom head scripts */}
      {headScripts && (
        <script dangerouslySetInnerHTML={{ __html: headScripts }} />
      )}

      {/* dir/lang wrapper — carries the portfolio's text direction */}
      <div
        lang={portfolio.locale ?? "en"}
        dir={portfolio.direction ?? "ltr"}
        style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
      >
        {children}

        {/* Custom body end scripts */}
        {bodyEndScripts && (
          <script dangerouslySetInnerHTML={{ __html: bodyEndScripts }} />
        )}
      </div>
    </>
  );
}