import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPortfolioByUserId } from "@/db/queries/portfolio";
import { TopBar }          from "@/components/dashboard/layout/TopBar";
import { SettingsEditor }  from "@/components/dashboard/settings/SettingsEditor";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const portfolio = await getPortfolioByUserId(session.user.id);
  if (!portfolio) redirect("/login");

  return (
    <>
      <TopBar
        title="Settings"
        description="General settings, language, privacy, danger zone"
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <SettingsEditor
          portfolio={{
            id:                   portfolio.id,
            title:                portfolio.title,
            tagline:              portfolio.tagline,
            slug:                 portfolio.slug,
            locale:               portfolio.locale  ?? "ar",
            direction:            portfolio.direction ?? "rtl",
            isPasswordProtected:  portfolio.isPasswordProtected  ?? false,
            showPlatformBranding: portfolio.showPlatformBranding ?? true,
          }}
        />
      </div>
    </>
  );
}
