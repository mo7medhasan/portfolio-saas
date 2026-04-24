import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { ThemeEditor } from "@/components/dashboard/ThemeEditor";
import { TopBar }      from "@/components/dashboard/layout/TopBar";

export default async function ThemePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  return (
    <>
      <TopBar
        title="Theme"
        description="CSS variables applied live to your portfolio"
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ThemeEditor />
      </div>
    </>
  );
}