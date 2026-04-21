
// src/db/seed.ts
import { config } from "dotenv"; // ← ضيف ده
config({ path: ".env" });    
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding plans...");

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      priceMonthly: 0,
      priceYearly: 0,
      isActive: true,
      sortOrder: 0,
      maxPortfolios: 1,
      allowCustomDomain: false,
      allowCustomScripts: false,
      allowAdvancedSeo: false,
      allowAnalytics: false,
      allowPasswordProtect: false,
      allowRemoveBranding: false,
      maxMediaMb: 100,
      maxSections: 8,
      supportLevel: "community",
    },
    {
      id: "pro",
      name: "Pro",
      description: "For professionals who want full control",
      priceMonthly: 9,
      priceYearly: 79,
      isActive: true,
      sortOrder: 1,
      maxPortfolios: 1,
      allowCustomDomain: true,
      allowCustomScripts: true,
      allowAdvancedSeo: true,
      allowAnalytics: true,
      allowPasswordProtect: true,
      allowRemoveBranding: false,
      maxMediaMb: 1024,
      maxSections: 30,
      supportLevel: "email",
    },
    {
      id: "business",
      name: "Business",
      description: "For agencies and power users",
      priceMonthly: 29,
      priceYearly: 249,
      isActive: true,
      sortOrder: 2,
      maxPortfolios: 1,
      allowCustomDomain: true,
      allowCustomScripts: true,
      allowAdvancedSeo: true,
      allowAnalytics: true,
      allowPasswordProtect: true,
      allowRemoveBranding: true,
      maxMediaMb: 10240,
      maxSections: 999,
      supportLevel: "priority",
    },
  ];

  for (const plan of plans) {
    await db
      .insert(schema.plans)
      .values(plan)
      .onConflictDoNothing(); // لو موجود — متعملش حاجة
    console.log(`  ✓ Plan: ${plan.name}`);
  }
// Seed global presets
const presets = [
  {
    id: "preset-minimal",
    name: "Minimal",
    isGlobal: true,
    tokens: JSON.stringify({
      "--color-primary": "#111111",
      "--color-accent": "#6C63FF",
      "--radius-lg": "4px",
      "--radius-md": "2px",
    }),
  },
  {
    id: "preset-ocean",
    name: "Ocean",
    isGlobal: true,
    tokens: JSON.stringify({
      "--color-primary": "#0EA5E9",
      "--color-accent": "#06B6D4",
      "--radius-lg": "16px",
    }),
  },
  {
    id: "preset-forest",
    name: "Forest",
    isGlobal: true,
    tokens: JSON.stringify({
      "--color-primary": "#16A34A",
      "--color-accent": "#84CC16",
    }),
  },
];

for (const preset of presets) {
  await db.insert(schema.themePresets)
    .values(preset)
    .onConflictDoNothing();
}
  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
