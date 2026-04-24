"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Palette, Image, Settings } from "lucide-react";

const TABS = [
  { href: "/dashboard",          label: "Sections", Icon: LayoutGrid },
  { href: "/dashboard/theme",    label: "Theme",    Icon: Palette    },
  { href: "/dashboard/media",    label: "Media",    Icon: Image      },
  { href: "/dashboard/settings", label: "Settings", Icon: Settings   },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t border-[var(--color-border,#e5e5e5)] md:hidden"
      style={{ background: "var(--color-background,#fff)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
            style={{ color: active ? "var(--color-primary,#6C63FF)" : "var(--color-text-secondary,#555)" }}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
