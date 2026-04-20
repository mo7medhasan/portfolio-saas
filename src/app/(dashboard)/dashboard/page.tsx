// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // الـ auth() بتجيب الـ session من الـ JWT cookie
  const session = await auth();

  // لو مفيش session أو user — redirect
  // المفروض الـ middleware يعمل ده قبل، بس double-check مش بيضر
  if (!session || !session.user) redirect("/login");

  return (
    <div>
      <h1>أهلاً، {session.user.name}</h1>
      <p>الإيميل: {session.user.email}</p>
      <p>الـ role: {session.user.role}</p>
    </div>
  );
}