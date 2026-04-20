// src/app/api/auth/signup/route.ts
import { db } from "@/db";
import { users, portfolios, portfolioSettings, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getDefaultTokens } from "@/db/seed-tokens";
import { designTokens } from "@/db/schema";

const signupSchema = z.object({
  name: z.string().min(2, "الاسم حرفين على الأقل"),
  email: z.string().email("إيميل غير صحيح"),
  password: z.string().min(8, "الباسورد 8 أحرف على الأقل"),
  slug: z.string()
    .min(3, "الـ slug 3 أحرف على الأقل")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "حروف إنجليزية صغيرة وأرقام وـ بس"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ── 1. Validate ──────────────────────────────────────
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, slug } = parsed.data;

    // ── 2. تحقق إن الـ email مش موجود ───────────────────
    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
    if (existingEmail) {
      return Response.json(
        { error: "الإيميل ده موجود قبل كده" },
        { status: 409 }
      );
    }

    // ── 3. تحقق إن الـ slug مش موجود ────────────────────
    const existingSlug = await db.query.portfolios.findFirst({
      where: eq(portfolios.slug, slug),
    });
    if (existingSlug) {
      return Response.json(
        { error: "الـ slug ده محجوز، جرب حاجة تانية" },
        { status: 409 }
      );
    }

    // ── 4. Hash الـ password ──────────────────────────────
    // الـ 12 = cost factor — كلما زاد، كلما أبطأ وأأمن
    // 12 هو الـ sweet spot للـ production
    const hashedPassword = await hash(password, 12);

    const userId = nanoid();
    const portfolioId = nanoid();
    const now = new Date().toISOString();

    // ── 5. كل حاجة في transaction واحدة ─────────────────
    // لو أي خطوة فشلت، كل حاجة بتتـ rollback
    await db.transaction(async (tx) => {

      // A. إنشاء الـ user
      await tx.insert(users).values({
        id: userId,
        email: email.toLowerCase(),
        name,
        hashedPassword,
        role: "user",
        createdAt: now,
        updatedAt: now,
      });

      // B. إنشاء الـ Free subscription
      await tx.insert(subscriptions).values({
        id: nanoid(),
        userId,
        planId: "free",
        status: "active",
        billingCycle: "monthly",
        createdAt: now,
        updatedAt: now,
      });

      // C. إنشاء الـ portfolio
      await tx.insert(portfolios).values({
        id: portfolioId,
        userId,
        slug,
        title: `${name}'s Portfolio`,
        status: "draft",
        showPlatformBranding: true,
        createdAt: now,
        updatedAt: now,
      });

      // D. إنشاء الـ portfolio settings (فاضي في البداية)
      await tx.insert(portfolioSettings).values({
        id: nanoid(),
        portfolioId,
        createdAt: now,
        updatedAt: now,
      });

      // E. إنشاء الـ default design tokens
      const tokens = getDefaultTokens(portfolioId);
      if (tokens.length > 0) {
        await tx.insert(designTokens).values(tokens);
      }
    });

    return Response.json(
      { message: "تم إنشاء الحساب بنجاح" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "حصل خطأ، حاول تاني" },
      { status: 500 }
    );
  }
}