import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/dashboard/layout/TopBar";

export default async function SeoPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      <TopBar title="SEO" description="Metadata, OG image, robots, sitemap" />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm" style={{ color: "var(--color-text-secondary,#555)" }}>
          SEO editor — coming soon.
        </p>
      </div>
    </>
  );
}
