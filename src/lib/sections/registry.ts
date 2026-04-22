// src/lib/sections/registry.ts
// Registry: every section type → label, icon, variants, defaultContent.
// Add a new section type here + a component — nothing else needed.
import type { RegistryEntry, SectionType } from "@/types/sections";

const registry: Record<SectionType, RegistryEntry> = {

  hero: {
    type: "hero", label: "Hero", icon: "✦",
    description: "أول section — عنوان رئيسي وـ CTA",
    variants: [
      { id: "centered",   label: "Centered",   description: "عنوان في المنتصف مع صورة دائرية" },
      { id: "split",      label: "Split",      description: "نص على اليمين وصورة على اليسار" },
      { id: "fullscreen", label: "Fullscreen", description: "خلفية كاملة مع overlay" },
    ],
    defaultVariant: "centered",
    defaultContent: {
      badgeText: "متاح للعمل ✓", headline: "أنا هنا — Frontend Engineer",
      subheadline: "بأبني تجارب ويب احترافية وسريعة",
      ctaText: "شوف أعمالي", ctaUrl: "#portfolio",
      secondaryCtaText: "تواصل معي", secondaryCtaUrl: "#contact", imageUrl: "",
    },
  },

  about: {
    type: "about", label: "About", icon: "◉",
    description: "نبذة شخصية وخلفيتك المهنية",
    variants: [
      { id: "split-photo", label: "Photo Split", description: "صورة على اليسار ونص على اليمين" },
      { id: "centered",    label: "Centered",    description: "نص في المنتصف بدون صورة" },
      { id: "card",        label: "Card",        description: "كارت مضغوط مع stats" },
    ],
    defaultVariant: "split-photo",
    defaultContent: {
      heading: "عني", subheading: "من أنا وما الذي أقدمه",
      bio: "اكتب هنا نبذة عنك، خلفيتك، شغفك، وإيه اللي بيميزك.",
      photoUrl: "", yearsExp: "5+", projectsCount: "50+", clientsCount: "30+",
      skills: ["React", "Next.js", "TypeScript", "Node.js"], cvUrl: "",
    },
  },

  services: {
    type: "services", label: "Services", icon: "◈",
    description: "الخدمات أو المنتجات اللي بتقدمها",
    variants: [
      { id: "grid-3", label: "Grid 3",  description: "3 cards في صف" },
      { id: "grid-2", label: "Grid 2",  description: "2 cards كبيرة مع features" },
      { id: "list",   label: "List",    description: "قائمة مع icon وdescription" },
    ],
    defaultVariant: "grid-3",
    defaultContent: {
      heading: "خدماتي", subheading: "إيه اللي أقدر أساعدك بيه",
      items: [
        { id: "1", title: "تصميم UI/UX", description: "تصميم واجهات جميلة وسهلة الاستخدام", icon: "🎨", price: "" },
        { id: "2", title: "تطوير Frontend", description: "بناء مواقع سريعة وـ responsive", icon: "💻", price: "" },
        { id: "3", title: "استشارات تقنية", description: "مساعدتك في اختيار الـ stack المناسب", icon: "🚀", price: "" },
      ],
    },
  },

  portfolio: {
    type: "portfolio", label: "Portfolio", icon: "◫",
    description: "عرض مشاريعك وأعمالك",
    variants: [
      { id: "grid",     label: "Grid",     description: "مشاريع في grid منتظم" },
      { id: "masonry",  label: "Masonry",  description: "grid بأحجام متنوعة" },
      { id: "featured", label: "Featured", description: "مشروع بارز + باقي أصغر" },
    ],
    defaultVariant: "grid",
    defaultContent: {
      heading: "أعمالي", subheading: "مشاريع اشتغلت عليها", showFilter: true,
      items: [
        { id: "1", title: "مشروع 1", description: "وصف المشروع", imageUrl: "", url: "", repoUrl: "", tags: ["React"], featured: true },
        { id: "2", title: "مشروع 2", description: "وصف المشروع", imageUrl: "", url: "", repoUrl: "", tags: ["Next.js"], featured: false },
      ],
    },
  },

  skills: {
    type: "skills", label: "Skills", icon: "◎",
    description: "مهاراتك التقنية",
    variants: [
      { id: "tags",    label: "Tags",   description: "pills ملونة للمهارات" },
      { id: "bars",    label: "Bars",   description: "progress bar لكل skill" },
      { id: "grouped", label: "Grouped",description: "مجمّعة بـ category" },
    ],
    defaultVariant: "tags",
    defaultContent: {
      heading: "مهاراتي", subheading: "",
      items: [
        { id: "1", name: "React",       level: 90, category: "Frontend" },
        { id: "2", name: "Next.js",     level: 85, category: "Frontend" },
        { id: "3", name: "TypeScript",  level: 80, category: "Language" },
        { id: "4", name: "Node.js",     level: 75, category: "Backend"  },
        { id: "5", name: "Tailwind",    level: 90, category: "Frontend" },
        { id: "6", name: "PostgreSQL",  level: 70, category: "Backend"  },
      ],
    },
  },

  experience: {
    type: "experience", label: "Experience", icon: "◷",
    description: "خبراتك الوظيفية",
    variants: [
      { id: "timeline", label: "Timeline", description: "خط زمني من الأحدث للأقدم" },
      { id: "cards",    label: "Cards",    description: "كل وظيفة في card" },
      { id: "compact",  label: "Compact",  description: "قائمة مضغوطة" },
    ],
    defaultVariant: "timeline",
    defaultContent: {
      heading: "خبراتي", subheading: "",
      items: [
        { id: "1", role: "Senior Frontend Engineer", company: "شركة X", period: "2022 - الآن", description: "وصف المسؤوليات", logoUrl: "", current: true },
        { id: "2", role: "Frontend Developer",       company: "شركة Y", period: "2020 - 2022", description: "وصف المسؤوليات", logoUrl: "", current: false },
      ],
    },
  },

  testimonials: {
    type: "testimonials", label: "Testimonials", icon: "❝",
    description: "آراء العملاء والزملاء",
    variants: [
      { id: "grid",    label: "Grid",    description: "cards في grid" },
      { id: "slider",  label: "Slider",  description: "carousel تفاعلي" },
      { id: "masonry", label: "Masonry", description: "masonry layout متنوع" },
    ],
    defaultVariant: "grid",
    defaultContent: {
      heading: "ماذا يقولون عني", subheading: "",
      items: [
        { id: "1", name: "أحمد محمد", role: "CTO", company: "شركة Z",  avatarUrl: "", quote: "عمل رائع واحترافي عالي جداً", rating: 5 },
        { id: "2", name: "سارة علي",  role: "PM",  company: "شركة W",  avatarUrl: "", quote: "التسليم في الوقت وجودة ممتازة", rating: 5 },
      ],
    },
  },

  contact: {
    type: "contact", label: "Contact", icon: "◌",
    description: "معلومات التواصل وـ form",
    variants: [
      { id: "split-form", label: "Split + Form",  description: "معلومات + form" },
      { id: "centered",   label: "Centered",      description: "معلومات في المنتصف" },
      { id: "minimal",    label: "Minimal",        description: "email + social فقط" },
    ],
    defaultVariant: "split-form",
    defaultContent: {
      heading: "تواصل معي", subheading: "أنا دايماً متاح للمشاريع الجديدة",
      email: "hello@example.com", phone: "", location: "", showForm: true,
      socialLinks: { github: "", linkedin: "", twitter: "", instagram: "", behance: "", dribbble: "" },
    },
  },

  faq: {
    type: "faq", label: "FAQ", icon: "◿",
    description: "أسئلة شائعة وإجاباتها",
    variants: [
      { id: "accordion", label: "Accordion",    description: "سؤال واحد مفتوح في كل مرة" },
      { id: "two-col",   label: "Two Columns",  description: "عمودين من الأسئلة" },
      { id: "minimal",   label: "Minimal",      description: "قائمة بسيطة بدون animation" },
    ],
    defaultVariant: "accordion",
    defaultContent: {
      heading: "أسئلة شائعة", subheading: "",
      items: [
        { id: "1", question: "ما هي خدماتك؟", answer: "أقدم خدمات تطوير الواجهات الأمامية وتصميم تجربة المستخدم." },
        { id: "2", question: "ما هو وقت التسليم؟", answer: "يعتمد على حجم المشروع، لكن عادةً من أسبوعين إلى شهر." },
      ],
    },
  },

  stats: {
    type: "stats", label: "Stats", icon: "◻",
    description: "أرقام وإحصائيات",
    variants: [
      { id: "row",      label: "Row",             description: "أرقام في صف أفقي" },
      { id: "grid",     label: "Grid",            description: "أرقام في grid" },
      { id: "with-bg",  label: "With Background", description: "على خلفية ملونة" },
    ],
    defaultVariant: "row",
    defaultContent: {
      heading: "",
      items: [
        { id: "1", value: "50", label: "مشروع منجز",  prefix: "", suffix: "+" },
        { id: "2", value: "30", label: "عميل سعيد",   prefix: "", suffix: "+" },
        { id: "3", value: "5",  label: "سنوات خبرة",  prefix: "", suffix: "+" },
        { id: "4", value: "99", label: "نسبة الرضا",  prefix: "", suffix: "%" },
      ],
    },
  },

  cta: {
    type: "cta", label: "Call to Action", icon: "◈",
    description: "section تحفيزي للتواصل",
    variants: [
      { id: "banner",  label: "Banner",  description: "خلفية ملونة مع زر واضح" },
      { id: "card",    label: "Card",    description: "card في المنتصف" },
      { id: "minimal", label: "Minimal", description: "نص + زر بدون خلفية" },
    ],
    defaultVariant: "banner",
    defaultContent: {
      heading: "مستعد للتعاون؟", subheading: "تواصل معي وابدأ مشروعك اليوم",
      ctaText: "ابدأ الآن", ctaUrl: "#contact",
    },
  },

  custom_html: {
    type: "custom_html", label: "Custom HTML", icon: "⌥",
    description: "أضف HTML/CSS/JS مخصص",
    variants: [{ id: "default", label: "Default", description: "inject HTML مباشراً" }],
    defaultVariant: "default",
    defaultContent: { html: "<!-- أضف الـ HTML هنا -->", css: "", js: "" },
  },
};

export function getEntry(type: SectionType): RegistryEntry        { return registry[type]; }
export function getAllEntries(): RegistryEntry[]                   { return Object.values(registry); }
export function getDefaultContent(type: SectionType)              { return registry[type].defaultContent; }
export function getVariants(type: SectionType)                    { return registry[type].variants; }
export function getDefaultVariant(type: SectionType): string      { return registry[type].defaultVariant; }

export default registry;