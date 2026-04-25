import { auth } from "@/auth";
import { db } from "@/db";
import { media, subscriptions, plans } from "@/db/schema";
import { eq, and, desc, sum } from "drizzle-orm";
import { put } from "@vercel/blob";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { nanoid } from "nanoid";

// ── Plan limits ────────────────────────────────────────────────────────────────
const PLAN_LIMITS: Record<string, number> = {
  free:     5 * 1024 * 1024,   // 5 MB
  pro:     20 * 1024 * 1024,   // 20 MB
  business: 50 * 1024 * 1024,  // 50 MB
};

// ── Allowed MIME types ─────────────────────────────────────────────────────────
const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  pdf:   ["application/pdf"],
};

const ALL_ALLOWED = Object.values(ALLOWED_TYPES).flat();

function getMimeCategory(mime: string): string {
  for (const [cat, types] of Object.entries(ALLOWED_TYPES)) {
    if (types.includes(mime)) return cat;
  }
  return "other";
}

// ── GET /api/media ─────────────────────────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  const files = await db
    .select()
    .from(media)
    .where(eq(media.portfolioId, portfolio.id))
    .orderBy(desc(media.createdAt))
    .limit(100);

  return Response.json({ media: files });
}

// ── POST /api/media ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) return Response.json({ error: "Not found" }, { status: 404 });

  // Get active plan to know size limit
  const activeSub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, session.user.id),
      eq(subscriptions.status, "active")
    ),
    with: { plan: true },
  });

  const planId   = activeSub?.planId ?? "free";
  const maxBytes = PLAN_LIMITS[planId] ?? PLAN_LIMITS.free;

  // Parse multipart form
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate MIME type
  if (!ALL_ALLOWED.includes(file.type)) {
    return Response.json(
      { error: `File type "${file.type}" is not allowed. Allowed: images, video, PDF.` },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > maxBytes) {
    const limitMB = Math.round(maxBytes / 1024 / 1024);
    return Response.json(
      { error: `File too large. Your plan allows up to ${limitMB} MB per file.` },
      { status: 400 }
    );
  }

  // Check total storage used (plan.maxMediaMb)
  const totalUsedResult = await db
    .select({ total: sum(media.sizeBytes) })
    .from(media)
    .where(eq(media.portfolioId, portfolio.id));

  const usedBytes    = Number(totalUsedResult[0]?.total ?? 0);
  const maxTotalMb   = (activeSub?.plan as { maxMediaMb?: number })?.maxMediaMb ?? 100;
  const maxTotalBytes = maxTotalMb * 1024 * 1024;

  if (usedBytes + file.size > maxTotalBytes) {
    const usedMB  = Math.round(usedBytes / 1024 / 1024);
    return Response.json(
      { error: `Storage full. You've used ${usedMB} MB of ${maxTotalMb} MB.` },
      { status: 400 }
    );
  }

  // ── Upload to Vercel Blob ──────────────────────────────────────────────────
  const ext       = file.name.split(".").pop() ?? "bin";
  const blobName  = `${portfolio.id}/${nanoid()}.${ext}`;

  const blob = await put(blobName, file, {
    access: "private",
    contentType: file.type,
  });

  // ── Get image dimensions (images only) ────────────────────────────────────
  let width: number | null  = null;
  let height: number | null = null;

  // Dimensions are determined client-side and optionally passed as form fields
  const wField = form.get("width");
  const hField = form.get("height");
  if (wField) width  = parseInt(wField as string, 10);
  if (hField) height = parseInt(hField as string, 10);

  // ── Save metadata in DB ───────────────────────────────────────────────────
  const category = getMimeCategory(file.type);
  const now      = new Date().toISOString();

  const [newFile] = await db
    .insert(media)
    .values({
      id:           nanoid(),
      portfolioId:  portfolio.id,
      uploadedBy:   session.user.id,
      fileName:     blobName,
      originalName: file.name,
      mimeType:     file.type,
      sizeBytes:    file.size,
      url:          blob.url,
      thumbnailUrl: category === "image" ? blob.url : null,
      width,
      height,
      alt:          "",
      caption:      "",
      folder:       category,
      createdAt:    now,
      updatedAt:    now,
    })
    .returning();

  return Response.json({ file: newFile }, { status: 201 });
}
