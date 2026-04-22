// src/proxy.ts  (Next.js 16+ uses proxy.ts instead of middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default auth(async function proxy(req) {
  const { pathname, hostname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // ── 1. Dashboard protection ────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── 2. Auth routes — redirect logged-in users ──────────
  if (pathname === "/login" || pathname === "/signup") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  // ── 3. API routes protection ───────────────────────────
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/og") &&
    !pathname.startsWith("/api/contact")
  ) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // ── 4. Custom Domain Routing ───────────────────────────
  // لو الـ hostname مش الـ main domain → ابحث عن portfolio بالـ custom domain
  const MAIN_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "portfolioapp.com";
  const isCustomDomain =
    hostname !== MAIN_DOMAIN &&
    hostname !== `www.${MAIN_DOMAIN}` &&
    !hostname.includes("localhost") &&
    !hostname.includes("vercel.app");

  if (isCustomDomain) {
    // rewrite الـ request لـ /[slug] بس حافظ على الـ hostname
    // الـ slug هنجيبه من الـ DB عن طريق API call في الـ page نفسها
    const url = req.nextUrl.clone();
    url.pathname = `/__custom/${hostname}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── 5. Subdomain Routing ────────────────────────────────
  // john.portfolioapp.com → /john
  const isSubdomain =
    hostname.endsWith(`.${MAIN_DOMAIN}`) &&
    hostname !== `www.${MAIN_DOMAIN}`;

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${MAIN_DOMAIN}`, "");
    // skip system subdomains
    if (!["www", "api", "admin", "app", "dashboard"].includes(subdomain)) {
      const url = req.nextUrl.clone();
      url.pathname = `/${subdomain}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};