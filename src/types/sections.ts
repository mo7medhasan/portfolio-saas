// src/types/sections.ts
// Single source of truth — all section types, variants, content shapes.

export const SECTION_TYPES = [
  "hero","about","services","portfolio","skills",
  "experience","testimonials","contact","faq","stats","cta","custom_html",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface VariantMeta { id: string; label: string; description: string; }

export interface RegistryEntry {
  type: SectionType;
  label: string;
  description: string;
  icon: string;
  variants: VariantMeta[];
  defaultVariant: string;
  defaultContent: Record<string, unknown>;
}

// ── Content shapes ────────────────────────────────────────────────────────────
export interface HeroContent {
  badgeText: string; headline: string; subheadline: string;
  ctaText: string; ctaUrl: string;
  secondaryCtaText: string; secondaryCtaUrl: string; imageUrl: string;
}
export interface AboutContent {
  heading: string; subheading: string; bio: string; photoUrl: string;
  yearsExp: string; projectsCount: string; clientsCount: string;
  skills: string[]; cvUrl: string;
}
export interface ServiceItem { id: string; title: string; description: string; icon: string; price: string; }
export interface ServicesContent { heading: string; subheading: string; items: ServiceItem[]; }

export interface ProjectItem {
  id: string; title: string; description: string; imageUrl: string;
  url: string; repoUrl: string; tags: string[]; featured: boolean;
}
export interface PortfolioContent { heading: string; subheading: string; items: ProjectItem[]; showFilter: boolean; }

export interface SkillItem { id: string; name: string; level: number; category: string; }
export interface SkillsContent { heading: string; subheading: string; items: SkillItem[]; }

export interface ExperienceItem {
  id: string; role: string; company: string; period: string;
  description: string; logoUrl: string; current: boolean;
}
export interface ExperienceContent { heading: string; subheading: string; items: ExperienceItem[]; }

export interface TestimonialItem {
  id: string; name: string; role: string; company: string;
  avatarUrl: string; quote: string; rating: number;
}
export interface TestimonialsContent { heading: string; subheading: string; items: TestimonialItem[]; }

export interface FaqItem { id: string; question: string; answer: string; }
export interface FaqContent { heading: string; subheading: string; items: FaqItem[]; }

export interface StatItem { id: string; value: string; label: string; prefix: string; suffix: string; }
export interface StatsContent { heading: string; items: StatItem[]; }

export interface ContactContent {
  heading: string; subheading: string; email: string; phone: string;
  location: string; showForm: boolean;
  socialLinks: { github: string; linkedin: string; twitter: string; instagram: string; behance: string; dribbble: string; };
}
export interface CtaContent { heading: string; subheading: string; ctaText: string; ctaUrl: string; }
export interface CustomHtmlContent { html: string; css: string; js: string; }

// ── Exhaustive map ────────────────────────────────────────────────────────────
export interface SectionContentMap {
  hero: HeroContent; about: AboutContent; services: ServicesContent;
  portfolio: PortfolioContent; skills: SkillsContent; experience: ExperienceContent;
  testimonials: TestimonialsContent; contact: ContactContent;
  faq: FaqContent; stats: StatsContent; cta: CtaContent; custom_html: CustomHtmlContent;
}

// ── DB row (matches Drizzle schema) ──────────────────────────────────────────
export interface SectionRow {
  id: string; type: SectionType; variant: string;
  label: string | null; content: string; isVisible: boolean; sortOrder: number;
}