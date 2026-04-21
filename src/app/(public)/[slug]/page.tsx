// src/app/(public)/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPortfolioBySlug } from "@/db/queries/portfolio";
import { SectionRenderer } from "@/components/portfolio/SectionRenderer";

// ── ISR config ─────────────────────────────────────────────
// بيقول لـ Next.js "الـ page دي static بس ممكن تتجدد"
export const revalidate = false; // مش بتتجدد تلقائياً
// هتتجدد بس لما الـ dashboard يضغط save → revalidatePath

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Metadata ───────────────────────────────────────────────
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return {};

  return {
    title: portfolio.settings?.metaTitle ?? portfolio.title,
    description: portfolio.settings?.metaDescription ?? portfolio.tagline,
    openGraph: {
      title: portfolio.settings?.ogTitle ?? portfolio.title,
      description: portfolio.settings?.ogDescription ?? "",
      images: portfolio.settings?.ogImageUrl
        ? [{ url: portfolio.settings.ogImageUrl }]
        : [],
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  // مش موجود
  if (!portfolio) notFound();

  // Draft — مش منشور
  if (portfolio.status !== "published") {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <h1>هذا الـ Portfolio قيد الإعداد</h1>
      </div>
    );
  }

  return (
    <main>
      {portfolio.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}