// src/lib/sections/schemas.ts
// Zod validation for each section content shape.
// Used in API routes to validate before DB write.
import { z } from "zod";
import type { SectionType } from "@/types/sections";

// ── Per-type schemas ──────────────────────────────────────────────────────────
const heroSchema = z.object({
  badgeText: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  ctaText: z.string().default(""),
  ctaUrl: z.string().default(""),
  secondaryCtaText: z.string().default(""),
  secondaryCtaUrl: z.string().default(""),
  imageUrl: z.string().default(""),
});

const aboutSchema = z.object({
  heading: z.string().default("عني"),
  subheading: z.string().default(""),
  bio: z.string().default(""),
  photoUrl: z.string().default(""),
  yearsExp: z.string().default(""),
  projectsCount: z.string().default(""),
  clientsCount: z.string().default(""),
  skills: z.array(z.string()).default([]),
  cvUrl: z.string().default(""),
});

const serviceItemSchema = z.object({
  id: z.string(), title: z.string(), description: z.string().default(""),
  icon: z.string().default(""), price: z.string().default(""),
});
const servicesSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  items: z.array(serviceItemSchema).default([]),
});

const projectItemSchema = z.object({
  id: z.string(), title: z.string(), description: z.string().default(""),
  imageUrl: z.string().default(""), url: z.string().default(""),
  repoUrl: z.string().default(""), tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});
const portfolioSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  items: z.array(projectItemSchema).default([]),
  showFilter: z.boolean().default(true),
});

const skillItemSchema = z.object({
  id: z.string(), name: z.string(),
  level: z.number().min(0).max(100).default(50), category: z.string().default(""),
});
const skillsSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  items: z.array(skillItemSchema).default([]),
});

const experienceItemSchema = z.object({
  id: z.string(), role: z.string(), company: z.string(),
  period: z.string().default(""), description: z.string().default(""),
  logoUrl: z.string().default(""), current: z.boolean().default(false),
});
const experienceSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  items: z.array(experienceItemSchema).default([]),
});

const testimonialItemSchema = z.object({
  id: z.string(), name: z.string(), role: z.string().default(""),
  company: z.string().default(""), avatarUrl: z.string().default(""),
  quote: z.string(), rating: z.number().min(1).max(5).default(5),
});
const testimonialsSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  items: z.array(testimonialItemSchema).default([]),
});

const faqItemSchema = z.object({
  id: z.string(), question: z.string(), answer: z.string(),
});
const faqSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  items: z.array(faqItemSchema).default([]),
});

const statItemSchema = z.object({
  id: z.string(), value: z.string(), label: z.string(),
  prefix: z.string().default(""), suffix: z.string().default(""),
});
const statsSchema = z.object({
  heading: z.string().default(""),
  items: z.array(statItemSchema).default([]),
});

const contactSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  email: z.string().default(""), phone: z.string().default(""),
  location: z.string().default(""), showForm: z.boolean().default(true),
  socialLinks: z.object({
    github: z.string().default(""),
    linkedin: z.string().default(""),
    twitter: z.string().default(""),
    instagram: z.string().default(""),
    behance: z.string().default(""),
    dribbble: z.string().default(""),
  }).default({
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    behance: "",
    dribbble: "",
  }),
});

const ctaSchema = z.object({
  heading: z.string().default(""), subheading: z.string().default(""),
  ctaText: z.string().default(""), ctaUrl: z.string().default(""),
});

const customHtmlSchema = z.object({
  html: z.string().default(""), css: z.string().default(""), js: z.string().default(""),
});

// ── Registry map ──────────────────────────────────────────────────────────────
const schemaMap = {
  hero: heroSchema, about: aboutSchema, services: servicesSchema,
  portfolio: portfolioSchema, skills: skillsSchema, experience: experienceSchema,
  testimonials: testimonialsSchema, contact: contactSchema,
  faq: faqSchema, stats: statsSchema, cta: ctaSchema, custom_html: customHtmlSchema,
} as const;

// ── Public helpers ────────────────────────────────────────────────────────────
export type ValidationResult =
  | { success: true;  data: Record<string, unknown> }
  | { success: false; error: string };

export function validateSectionContent(
  type: string,
  content: unknown
): ValidationResult {
  const schema = schemaMap[type as SectionType];
  if (!schema) return { success: false, error: `Unknown section type: ${type}` };
  const result = schema.safeParse(content ?? {});
  if (!result.success) return { success: false, error: result.error.issues[0].message };
  return { success: true, data: result.data as Record<string, unknown> };
}

export function getEmptyContent(type: SectionType): Record<string, unknown> {
  return schemaMap[type].parse({}) as Record<string, unknown>;
}