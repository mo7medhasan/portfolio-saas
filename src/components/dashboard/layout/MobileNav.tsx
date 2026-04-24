"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Palette, Image as ImageIcon, Settings } from "lucide-react";

const TABS = [
  {
    href: "/dashboard",
    label: "Sections",
    icon: (active: boolean) => <LayoutGrid size={20} strokeWidth={active ? 1.6 : 1.3} />,
  },
  {
    href: "/dashboard/theme",
    label: "Theme",
    icon: (active: boolean) => <Palette size={20} strokeWidth={active ? 1.6 : 1.3} />,
  },
  {
    href: "/dashboard/media",
    label: "Media",
    icon: (active: boolean) => <ImageIcon size={20} strokeWidth={active ? 1.6 : 1.3} />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (active: boolean) => <Settings size={20} strokeWidth={active ? 1.6 : 1.3} />,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center border-t border-[var(--color-border,#e5e5e5)] md:hidden"
      style={{ background: "var(--color-background,#fff)" }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
            style={{ color: active ? "var(--color-primary,#6C63FF)" : "var(--color-text-secondary,#555)" }}
          >
            {tab.icon(active)}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
