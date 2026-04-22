// src/app/api/domains/[id]/verify/route.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { domains } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import dns from "dns/promises";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  // جيب الـ domain
  const domain = await db.query.domains.findFirst({
    where: and(
      eq(domains.id, id),
      eq(domains.portfolioId, portfolio.id)
    ),
  });

  if (!domain) return Response.json({ error: "Not found" }, { status: 404 });
  if (domain.isVerified) return Response.json({ verified: true });
  if (!domain.verificationToken) {
    return Response.json({ error: "مفيش verification token" }, { status: 400 });
  }

  try {
    // DNS TXT lookup
    const records = await dns.resolveTxt(domain.domain);
    const flatRecords = records.flat();
    const isVerified = flatRecords.some((r) => r === domain.verificationToken);

    if (isVerified) {
      await db
        .update(domains)
        .set({
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          sslStatus: "active",
          updatedAt: new Date().toISOString(),
        })
        .where(eq(domains.id, id));

      return Response.json({ verified: true });
    }

    return Response.json({
      verified: false,
      message: "الـ TXT record لسه مش ظاهر — DNS propagation بياخد وقت (ساعة لـ 48 ساعة)",
    });
  } catch {
    return Response.json({
      verified: false,
      message: "مقدرناش نتحقق من الـ DNS — حاول تاني بعد شوية",
    });
  }
}