// src/app/(public)/[slug]/page.tsx — النسخة الكاملة مع password
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getPortfolioBySlug } from "@/db/queries/portfolio";
import { SectionRenderer } from "@/components/portfolio/SectionRenderer";
import { PasswordGate } from "@/components/portfolio/PasswordGate";
import type { Metadata } from "next";
import { SectionRow } from "@/types/sections";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = false;
export const dynamic = "force-static";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return { title: "Not Found" };

  const s = portfolio.settings;
  return {
    title: s?.metaTitle ?? portfolio.title,
    description: s?.metaDescription ?? portfolio.tagline ?? "",
    robots: s?.robotsDirective ?? "index, follow",
    openGraph: {
      title: s?.ogTitle ?? portfolio.title,
      description: s?.ogDescription ?? "",
      images: s?.ogImageUrl ? [s.ogImageUrl] : [`/api/og?slug=${slug}`],
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) notFound();

  // Draft
  if (portfolio.status !== "published") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}
        >
          هذا الـ Portfolio قيد الإعداد
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary,#555)" }}>
          ارجع تاني قريباً.
        </p>
      </div>
    );
  }

  // Password protection check
  if (portfolio.isPasswordProtected) {
    const cookieStore = await cookies();
    const unlocked = cookieStore.get(`portfolio-unlock-${portfolio.id}`);
    if (!unlocked) {
      return <PasswordGate slug={slug} />;
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.title,
    url: `https://portfolioapp.com/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        {portfolio.sections.map((section ) => (
          <SectionRenderer key={section.id} section={section as SectionRow} />
        ))}
      </main>
    </>
  );
}