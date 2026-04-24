import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/dashboard/layout/TopBar";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <TopBar title="Settings" description="Portfolio settings and preferences" />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed gap-4"
          style={{ borderColor: "var(--color-border,#e5e5e5)" }}
        >
          <Settings size={32} style={{ color: "var(--color-text-secondary,#555)", opacity: 0.3 }} />
          <p className="text-sm" style={{ color: "var(--color-text-secondary,#555)" }}>
            Settings — coming soon
          </p>
        </div>
      </div>
    </>
  );
}
