import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ThemeEditor } from "@/components/dashboard/ThemeEditor";
import { TopBar }      from "@/components/dashboard/layout/TopBar";

export default async function ThemePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <TopBar
        title="Theme"
        description="CSS variables — changes appear live on your portfolio"
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ThemeEditor />
      </div>
    </>
  );
}