import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { TopBar } from "@/components/dashboard/layout/TopBar";

export default async function MessagesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  const messages = await db
    .select()
    .from(contactMessages)
    .where(eq(contactMessages.portfolioId, portfolio.id))
    .orderBy(desc(contactMessages.createdAt))
    .limit(50);

  return (
    <>
      <TopBar title="Messages" description={`${messages.length} total messages`} />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {messages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed gap-3"
            style={{ borderColor: "var(--color-border,#e5e5e5)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary,#111)" }}>
              مفيش رسايل لسه
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>
              لما حد يبعت من الـ contact form هيظهر هنا
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-xl border border-[var(--color-border,#e5e5e5)] space-y-2"
              style={{
                background: "var(--color-background,#fff)",
                borderColor: msg.status === "unread"
                  ? "color-mix(in srgb,var(--color-primary,#6C63FF) 30%,var(--color-border,#e5e5e5))"
                  : undefined,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary,#111)" }}>
                    {msg.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>
                    {msg.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {msg.status === "unread" && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: "var(--color-primary,#6C63FF)" }}
                    >
                      جديد
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>
                    {new Date(msg.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
              {msg.subject && (
                <p className="text-xs font-medium" style={{ color: "var(--color-text-primary,#111)" }}>
                  {msg.subject}
                </p>
              )}
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary,#555)" }}>
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
