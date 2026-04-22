import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
};

// ─────────────────────────────────────────────
// 1. PLANS
// الـ pricing tiers — مش hardcoded عشان تقدر تضيف plan جديد من DB
// ─────────────────────────────────────────────
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(), // 'free' | 'pro' | 'business'
  name: text("name").notNull(), // 'Free' | 'Pro' | 'Business'
  description: text("description"),
  priceMonthly: real("price_monthly").notNull().default(0), // USD
  priceYearly: real("price_yearly").notNull().default(0),   // USD (discounted)
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),

  // Feature flags — بتتحكم في الـ features per plan
  maxPortfolios: integer("max_portfolios").notNull().default(1),
  allowCustomDomain: integer("allow_custom_domain", { mode: "boolean" }).notNull().default(false),
  allowCustomScripts: integer("allow_custom_scripts", { mode: "boolean" }).notNull().default(false),
  allowAdvancedSeo: integer("allow_advanced_seo", { mode: "boolean" }).notNull().default(false),
  allowAnalytics: integer("allow_analytics", { mode: "boolean" }).notNull().default(false),
  allowPasswordProtect: integer("allow_password_protect", { mode: "boolean" }).notNull().default(false),
  allowRemoveBranding: integer("allow_remove_branding", { mode: "boolean" }).notNull().default(false),
  maxMediaMb: integer("max_media_mb").notNull().default(100), // Storage limit
  maxSections: integer("max_sections").notNull().default(10),
  supportLevel: text("support_level").notNull().default("community"), // 'community' | 'email' | 'priority'

  ...timestamps,
});

// ─────────────────────────────────────────────
// 2. USERS
// ─────────────────────────────────────────────
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(), // nanoid()
    email: text("email").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    hashedPassword: text("hashed_password"), // null لو OAuth
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
    emailVerifiedAt: text("email_verified_at"),

    // Auth providers
    provider: text("provider").default("credentials"), // 'credentials' | 'google' | 'github'
    providerId: text("provider_id"), // OAuth ID

    // Status
    role: text("role").notNull().default("user"), // 'user' | 'admin'
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    isBanned: integer("is_banned", { mode: "boolean" }).notNull().default(false),
    bannedReason: text("banned_reason"),

    // Onboarding
    onboardingCompleted: integer("onboarding_completed", { mode: "boolean" }).notNull().default(false),
    onboardingStep: integer("onboarding_step").default(0),

    lastLoginAt: text("last_login_at"),
    ...timestamps,
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    providerIdx: index("users_provider_idx").on(t.provider, t.providerId),
  })
);

// ─────────────────────────────────────────────
// 3. SUBSCRIPTIONS
// ربط user بـ plan — واحد active في نفس الوقت
// ─────────────────────────────────────────────
export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: text("plan_id")
      .notNull()
      .references(() => plans.id),

    status: text("status").notNull().default("active"),
    // 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired'

    billingCycle: text("billing_cycle").notNull().default("monthly"), // 'monthly' | 'yearly'

    // Payment gateway (Stripe / Paddle / Lemon Squeezy)
    gatewayProvider: text("gateway_provider"), // 'stripe' | 'lemonsqueezy'
    gatewaySubscriptionId: text("gateway_subscription_id"),
    gatewayCustomerId: text("gateway_customer_id"),

    trialEndsAt: text("trial_ends_at"),
    currentPeriodStart: text("current_period_start"),
    currentPeriodEnd: text("current_period_end"),
    canceledAt: text("canceled_at"),
    cancelReason: text("cancel_reason"),

    ...timestamps,
  },
  (t) => ({
    userIdx: index("subscriptions_user_idx").on(t.userId),
    statusIdx: index("subscriptions_status_idx").on(t.status),
  })
);

// ─────────────────────────────────────────────
// 4. PORTFOLIOS
// كل user عنده portfolio واحد (للـ MVP)
// بس الـ schema يدعم multi لو كبرنا
// ─────────────────────────────────────────────
export const portfolios = sqliteTable(
  "portfolios",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Identity
    slug: text("slug").notNull(), // yoursite.com/[slug] أو subdomain
    title: text("title").notNull(),
    tagline: text("tagline"),
    description: text("description"),
    locale: text("locale").notNull().default("en"), // 'en' | 'ar' | ...
    direction: text("direction").notNull().default("ltr"), // 'ltr' | 'rtl'

    // Status
    status: text("status").notNull().default("draft"),
    // 'draft' | 'published' | 'archived' | 'suspended'

    publishedAt: text("published_at"),

    // Password protection (Pro+)
    isPasswordProtected: integer("is_password_protected", { mode: "boolean" }).notNull().default(false),
    passwordHash: text("password_hash"),

    // Branding
    showPlatformBranding: integer("show_platform_branding", { mode: "boolean" }).notNull().default(true),

    // Thumbnail for dashboard preview
    thumbnailUrl: text("thumbnail_url"),

    ...timestamps,
  },
  (t) => ({
    slugIdx: uniqueIndex("portfolios_slug_idx").on(t.slug),
    userIdx: index("portfolios_user_idx").on(t.userId),
  })
);

// ─────────────────────────────────────────────
// 5. DOMAINS
// subdomain دايماً موجود
// custom domain حسب الـ plan
// ─────────────────────────────────────────────
export const domains = sqliteTable(
  "domains",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),

    type: text("type").notNull(), // 'subdomain' | 'custom'
    domain: text("domain").notNull(),
    // subdomain: 'john' → john.portfolioapp.com
    // custom: 'john.com'

    // Verification للـ custom domains
    isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
    verificationToken: text("verification_token"),
    verifiedAt: text("verified_at"),

    // SSL status (Vercel/Cloudflare بيديروا ده)
    sslStatus: text("ssl_status").default("pending"),
    // 'pending' | 'active' | 'error'

    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),

    ...timestamps,
  },
  (t) => ({
    domainIdx: uniqueIndex("domains_domain_idx").on(t.domain),
    portfolioIdx: index("domains_portfolio_idx").on(t.portfolioId),
  })
);

// ─────────────────────────────────────────────
// 6. SECTIONS
// الـ building blocks للـ portfolio
// ordered list، كل section ليه type وcontent (JSON)
// ─────────────────────────────────────────────
export const sections = sqliteTable(
  "sections",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),

    type: text("type").notNull(),
    // 'hero' | 'about' | 'services' | 'portfolio' | 'experience'
    // 'skills' | 'testimonials' | 'blog' | 'contact' | 'pricing'
    // 'faq' | 'team' | 'stats' | 'clients' | 'cta' | 'custom_html'

    label: text("label"), // اسم custom للـ section في الـ dashboard

    // Layout variant لكل type
    variant: text("variant").notNull().default("default"),
    // hero: 'centered' | 'split' | 'fullscreen' | 'minimal'
    // portfolio: 'grid' | 'masonry' | 'carousel' | 'list'

    // الـ content — JSON stored as text
    content: text("content").notNull().default("{}"),
    // structured per type, validated by Zod on API layer

    // Visibility & order
    isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),

    // Section-level overrides
    backgroundColor: text("background_color"),   // override --color-surface
    paddingTop: integer("padding_top"),           // px
    paddingBottom: integer("padding_bottom"),     // px
    fullWidth: integer("full_width", { mode: "boolean" }).notNull().default(false),

    // Anchor للـ navigation
    anchorId: text("anchor_id"), // 'about', 'contact', etc.

    ...timestamps,
  },
  (t) => ({
    portfolioIdx: index("sections_portfolio_idx").on(t.portfolioId),
    orderIdx: index("sections_order_idx").on(t.portfolioId, t.sortOrder),
  })
);

// ─────────────────────────────────────────────
// 7. DESIGN TOKENS
// CSS variables system — per portfolio
// ─────────────────────────────────────────────
export const designTokens = sqliteTable(
  "design_tokens",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),

    // Token identity
    key: text("key").notNull(),      // '--color-primary'
    value: text("value").notNull(),  // '#6C63FF'
    darkValue: text("dark_value"),   // قيمة مختلفة لـ dark mode

    // Metadata للـ dashboard UI
    label: text("label").notNull(),  // 'Primary Color'
    category: text("category").notNull(),
    // 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'effect'

    type: text("type").notNull(),
    // 'color' | 'font-family' | 'px' | 'rem' | 'select' | 'boolean'

    options: text("options"),        // JSON array للـ select type
    defaultValue: text("default_value").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),

    ...timestamps,
  },
  (t) => ({
    portfolioKeyIdx: uniqueIndex("design_tokens_portfolio_key_idx").on(
      t.portfolioId,
      t.key
    ),
    categoryIdx: index("design_tokens_category_idx").on(t.portfolioId, t.category),
  })
);

// ─────────────────────────────────────────────
// 8. THEME PRESETS
// مجموعات tokens جاهزة — global أو per-user
// ─────────────────────────────────────────────
export const themePresets = sqliteTable("theme_presets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),          // 'Minimal Dark'
  description: text("description"),
  previewImageUrl: text("preview_image_url"),
  tokens: text("tokens").notNull(),      // JSON: { '--color-primary': '#...' }
  isGlobal: integer("is_global", { mode: "boolean" }).notNull().default(false),
  createdBy: text("created_by").references(() => users.id),
  ...timestamps,
});

// ─────────────────────────────────────────────
// 9. PORTFOLIO SETTINGS
// SEO + Scripts + Analytics + Header/Footer
// واحد per portfolio — one-to-one
// ─────────────────────────────────────────────
export const portfolioSettings = sqliteTable("portfolio_settings", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id")
    .notNull()
    .references(() => portfolios.id, { onDelete: "cascade" }),

  // ── SEO ──────────────────────────────────
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImageUrl: text("og_image_url"),
  ogType: text("og_type").default("website"),
  twitterCard: text("twitter_card").default("summary_large_image"),
  twitterHandle: text("twitter_handle"),
  canonicalUrl: text("canonical_url"),
  robotsDirective: text("robots_directive").default("index, follow"),
  structuredDataJson: text("structured_data_json"), // JSON-LD

  // ── Sitemap & Robots ──────────────────────
  sitemapEnabled: integer("sitemap_enabled", { mode: "boolean" }).notNull().default(true),
  robotsTxt: text("robots_txt"),

  // ── Code Injection (Pro+) ─────────────────
  headScripts: text("head_scripts"),   // raw HTML قبل </head>
  bodyStartScripts: text("body_start_scripts"), // بعد <body>
  bodyEndScripts: text("body_end_scripts"),     // قبل </body>
  customCss: text("custom_css"),
  customJs: text("custom_js"),

  // ── Analytics ────────────────────────────
  googleAnalyticsId: text("google_analytics_id"),    // 'G-XXXXXXX'
  googleTagManagerId: text("google_tag_manager_id"), // 'GTM-XXXXX'
  facebookPixelId: text("facebook_pixel_id"),
  hotjarId: text("hotjar_id"),

  // ── Navigation ────────────────────────────
  headerStyle: text("header_style").default("sticky"),
  // 'sticky' | 'fixed' | 'static' | 'hidden'
  headerLayout: text("header_layout").default("default"),
  // 'default' | 'centered' | 'minimal' | 'sidebar'
  footerEnabled: integer("footer_enabled", { mode: "boolean" }).notNull().default(true),
  footerContent: text("footer_content"), // JSON — links, copyright, social

  // ── Social Links ──────────────────────────
  socialLinks: text("social_links"),
  // JSON: { github, linkedin, twitter, instagram, ... }

  // ── Favicon ───────────────────────────────
  faviconUrl: text("favicon_url"),
  appleIconUrl: text("apple_icon_url"),

  // ── Misc ──────────────────────────────────
  maintenanceMode: integer("maintenance_mode", { mode: "boolean" }).notNull().default(false),
  maintenanceMessage: text("maintenance_message"),

  ...timestamps,
});

// ─────────────────────────────────────────────
// 10. MEDIA
// كل ملف/صورة اتاتلود
// ─────────────────────────────────────────────
export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => users.id),

    // File info
    fileName: text("file_name").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    url: text("url").notNull(),         // Cloudflare R2 URL
    thumbnailUrl: text("thumbnail_url"), // for images

    // Image metadata
    width: integer("width"),
    height: integer("height"),
    alt: text("alt"),
    caption: text("caption"),

    // Organization
    folder: text("folder").default("uploads"),

    ...timestamps,
  },
  (t) => ({
    portfolioIdx: index("media_portfolio_idx").on(t.portfolioId),
  })
);

// ─────────────────────────────────────────────
// 11. CONTACT MESSAGES
// اللي بيجي من contact form في الـ portfolio
// ─────────────────────────────────────────────
export const contactMessages = sqliteTable(
  "contact_messages",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    phone: text("phone"),

    status: text("status").notNull().default("unread"),
    // 'unread' | 'read' | 'replied' | 'archived' | 'spam'

    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    ...timestamps,
  },
  (t) => ({
    portfolioIdx: index("contact_messages_portfolio_idx").on(t.portfolioId),
    statusIdx: index("contact_messages_status_idx").on(t.status),
  })
);

// ─────────────────────────────────────────────
// 12. ANALYTICS EVENTS (lightweight)
// بديل مبسط لـ external analytics — optional
// ─────────────────────────────────────────────
export const analyticsEvents = sqliteTable(
  "analytics_events",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),

    event: text("event").notNull(),
    // 'page_view' | 'section_view' | 'contact_submit' | 'link_click'

    page: text("page"),
    referrer: text("referrer"),
    country: text("country"),
    device: text("device"), // 'mobile' | 'tablet' | 'desktop'
    browser: text("browser"),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => ({
    portfolioIdx: index("analytics_portfolio_idx").on(t.portfolioId),
    eventIdx: index("analytics_event_idx").on(t.event),
    dateIdx: index("analytics_date_idx").on(t.portfolioId, t.createdAt),
  })
);

// ─────────────────────────────────────────────
// 13. AUDIT LOG
// كل تغيير في الـ dashboard يتسجل — مفيد للـ debugging
// ─────────────────────────────────────────────
export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id),
    portfolioId: text("portfolio_id").references(() => portfolios.id),

    action: text("action").notNull(),
    // 'portfolio.publish' | 'section.create' | 'token.update' | ...

    entity: text("entity").notNull(), // 'portfolio' | 'section' | 'token' | ...
    entityId: text("entity_id"),

    before: text("before"), // JSON snapshot قبل التغيير
    after: text("after"),   // JSON snapshot بعد التغيير

    ipAddress: text("ip_address"),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => ({
    userIdx: index("audit_user_idx").on(t.userId),
    portfolioIdx: index("audit_portfolio_idx").on(t.portfolioId),
  })
);
// src/db/schema.ts — ضيف في الآخر
import { relations } from "drizzle-orm";

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  settings: one(portfolioSettings, {
    fields: [portfolios.id],
    references: [portfolioSettings.portfolioId],
  }),
  sections: many(sections),
  designTokens: many(designTokens),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [sections.portfolioId],
    references: [portfolios.id],
  }),
}));

export const portfolioSettingsRelations = relations(portfolioSettings, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioSettings.portfolioId],
    references: [portfolios.id],
  }),
}));

export const designTokensRelations = relations(designTokens, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [designTokens.portfolioId],
    references: [portfolios.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
}));
// ─────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────
export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Portfolio = typeof portfolios.$inferSelect;
export type NewPortfolio = typeof portfolios.$inferInsert;

export type Domain = typeof domains.$inferSelect;
export type NewDomain = typeof domains.$inferInsert;

export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;

export type DesignToken = typeof designTokens.$inferSelect;
export type NewDesignToken = typeof designTokens.$inferInsert;

export type ThemePreset = typeof themePresets.$inferSelect;
export type NewThemePreset = typeof themePresets.$inferInsert;

export type PortfolioSettings = typeof portfolioSettings.$inferSelect;
export type NewPortfolioSettings = typeof portfolioSettings.$inferInsert;

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;