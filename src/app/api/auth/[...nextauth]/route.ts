// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

// NextAuth بيولد كل الـ routes التقيلة تلقائياً:
// GET  /api/auth/session
// POST /api/auth/signin
// POST /api/auth/signout
// GET  /api/auth/csrf
export const { GET, POST } = handlers;