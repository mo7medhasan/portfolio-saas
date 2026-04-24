import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { TopBar } from "@/components/dashboard/layout/TopBar";
import { Mail, MailOpen } from "lucide-react";

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

  const unread = messages.filter((m) => m.status === "unread").length;

  return (
    <>
      <TopBar
        title="Messages"
        description={`${messages.length} total · ${unread} unread`}
      />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {messages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed gap-4"
            style={{ borderColor: "var(--color-border,#e5e5e5)" }}
          >
            <Mail size={32} style={{ color: "var(--color-text-secondary,#555)", opacity: 0.3 }} />
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary,#111)" }}>
                No messages yet
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary,#555)" }}>
                Messages from your contact form will appear here
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUnread = msg.status === "unread";
            return (
              <div
                key={msg.id}
                className="p-4 rounded-xl border space-y-2 transition-all"
                style={{
                  background: "var(--color-background,#fff)",
                  borderColor: isUnread
                    ? "color-mix(in srgb,var(--color-primary,#6C63FF) 35%,var(--color-border,#e5e5e5))"
                    : "var(--color-border,#e5e5e5)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {isUnread
                      ? <Mail size={14} style={{ color: "var(--color-primary,#6C63FF)", flexShrink: 0 }} />
                      : <MailOpen size={14} style={{ color: "var(--color-text-secondary,#555)", flexShrink: 0 }} />
                    }
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary,#111)" }}>
                        {msg.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--color-text-secondary,#555)" }}>
                        {msg.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isUnread && (
                      <span
                        className="text-[10px] font-bold px-2 py-px rounded-full text-white"
                        style={{ background: "var(--color-primary,#6C63FF)" }}
                      >
                        New
                      </span>
                    )}
                    <span className="text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>
                      {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>
                </div>
                {msg.subject && (
                  <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary,#111)" }}>
                    {msg.subject}
                  </p>
                )}
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary,#555)" }}>
                  {msg.message}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
