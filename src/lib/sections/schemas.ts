// src/lib/sections/schemas.ts
import { z } from "zod";

// ── Hero ─────────────────────────────────────────────────
const heroSchema = z.object({
  headline: z.string().default("مرحباً، أنا ..."),
  subheadline: z.string().default(""),
  ctaText: z.string().default("تواصل معي"),
  ctaUrl: z.string().default("#contact"),
  bgType: z.enum(["gradient", "image", "solid", "video"]).default("gradient"),
  bgValue: z.string().default(""),
  imageUrl: z.string().default(""),
  layout: z.enum(["centered", "split-left", "split-right", "fullscreen"]).default("centered"),
});

// ── About ────────────────────────────────────────────────
const aboutSchema = z.object({
  heading: z.string().default("عني"),
  bio: z.string().default(""),
  photoUrl: z.string().default(""),
  skills: z.array(z.string()).default([]),
  layout: z.enum(["default", "timeline", "minimal"]).default("default"),
});

// ── Services ─────────────────────────────────────────────
const serviceItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(""),
  icon: z.string().default(""),
  price: z.string().default(""),
});

const servicesSchema = z.object({
  heading: z.string().default("خدماتي"),
  subheading: z.string().default(""),
  items: z.array(serviceItemSchema).default([]),
  layout: z.enum(["grid-2", "grid-3", "grid-4", "list"]).default("grid-3"),
});

// ── Portfolio / Work ──────────────────────────────────────
const projectItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().default(""),
  imageUrl: z.string().default(""),
  url: z.string().default(""),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

const portfolioSectionSchema = z.object({
  heading: z.string().default("أعمالي"),
  subheading: z.string().default(""),
  items: z.array(projectItemSchema).default([]),
  layout: z.enum(["grid", "masonry", "carousel", "list"]).default("grid"),
  showFilter: z.boolean().default(true),
});

// ── Contact ───────────────────────────────────────────────
const contactSchema = z.object({
  heading: z.string().default("تواصل معي"),
  subheading: z.string().default(""),
  email: z.string().email().default(""),
  phone: z.string().default(""),
  showForm: z.boolean().default(true),
  socialLinks: z.object({
    github: z.string().default(""),
    linkedin: z.string().default(""),
    twitter: z.string().default(""),
    instagram: z.string().default(""),
  }).default({
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  }),
});

// ── Custom HTML ───────────────────────────────────────────
const customHtmlSchema = z.object({
  html: z.string().default(""),
  css: z.string().default(""),
  js: z.string().default(""),
});

// ── Registry — بربط كل type بالـ schema بتاعه ─────────────
export const sectionSchemas = {
  hero: heroSchema,
  about: aboutSchema,
  services: servicesSchema,
  portfolio: portfolioSectionSchema,
  contact: contactSchema,
  custom_html: customHtmlSchema,
  // هتضيف باقي الـ types بنفس الـ pattern
} as const;

export type SectionType = keyof typeof sectionSchemas;

// ── Validate function — بتستخدمها في الـ API ─────────────
export function validateSectionContent(type: string, content: unknown) {
  const schema = sectionSchemas[type as SectionType];
  if (!schema) {
    return { success: false as const, error: `Unknown section type: ${type}` };
  }

  const result = schema.safeParse(content);
  if (!result.success) {
    return { success: false as const, error: result.error.issues[0].message };
  }

  return { success: true as const, data: result.data };
}

// ── Default content لكل type — للـ "Add Section" button ──
export function getDefaultContent(type: SectionType) {
  return sectionSchemas[type].parse({});
}