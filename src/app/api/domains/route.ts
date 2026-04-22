// src/app/api/domains/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { domains, portfolios, subscriptions, plans } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { nanoid } from "nanoid";
import { z } from "zod";

// GET /api/domains — جيب domains الـ portfolio
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const allDomains = await db
    .select()
    .from(domains)
    .where(eq(domains.portfolioId, portfolio.id));

  return Response.json({ domains: allDomains });
}

// POST /api/domains — إضافة custom domain
const addDomainSchema = z.object({
  domain: z
    .string()
    .min(3)
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "domain غير صحيح"
    ),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // تحقق إن الـ user على Pro plan
  const activeSub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, session.user.id),
      eq(subscriptions.status, "active")
    ),
    with: { plan: true },
  });

  if (!activeSub?.plan.allowCustomDomain) {
    return Response.json(
      { error: "Custom domains متاحة للـ Pro plan بس" },
      { status: 403 }
    );
  }

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = addDomainSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // تحقق إن الـ domain مش موجود عند حد تاني
  const existing = await db.query.domains.findFirst({
    where: eq(domains.domain, parsed.data.domain),
  });
  if (existing) {
    return Response.json({ error: "الـ domain ده مستخدم قبل كده" }, { status: 409 });
  }

  // إنشاء الـ domain مع verification token
  const verificationToken = `portfolio-verify=${nanoid(32)}`;
  const now = new Date().toISOString();

  const newDomain = {
    id: nanoid(),
    portfolioId: portfolio.id,
    type: "custom" as const,
    domain: parsed.data.domain,
    isVerified: false,
    verificationToken,
    isPrimary: false,
    sslStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(domains).values(newDomain);

  return Response.json({
    domain: newDomain,
    instructions: {
      step1: `روح DNS provider بتاعك`,
      step2: `أضف TXT record`,
      name: `@`,
      value: verificationToken,
      step3: `بعد ما تضيفه، اضغط Verify`,
    },
  }, { status: 201 });
}