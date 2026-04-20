// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;           // هل في session؟
  const user = req.auth?.user;

  // ── Dashboard routes — محتاجة login ──────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      // redirect للـ login مع حفظ الـ URL الأصلي
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Auth routes — لو logged in متيجيش عليها ──────────
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  // ── API routes — تحقق من الـ session ─────────────────
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

// بيقول للـ middleware يشتغل على الـ routes دي بس
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/api/:path*",
  ],
};