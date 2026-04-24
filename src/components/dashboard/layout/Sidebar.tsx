"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Palette, Search, Settings, Image as ImageIcon, MessageSquare, Globe, ArrowUpRight, ChevronRight } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: "Portfolio",
    items: [
      {
        href: "/dashboard",
        label: "Sections",
        icon: <LayoutGrid size={16} strokeWidth={1.5} />,
      },
      {
        href: "/dashboard/theme",
        label: "Theme",
        icon: <Palette size={16} strokeWidth={1.5} />,
      },
      {
        href: "/dashboard/seo",
        label: "SEO",
        icon: <Search size={16} strokeWidth={1.5} />,
      },
      {
        href: "/dashboard/settings",
        label: "Settings",
        icon: <Settings size={16} strokeWidth={1.5} />,
      },
    ],
  },
  {
    label: "Manage",
    items: [
      {
        href: "/dashboard/media",
        label: "Media",
        icon: <ImageIcon size={16} strokeWidth={1.5} />,
      },
      {
        href: "/dashboard/messages",
        label: "Messages",
        badge: true,
        icon: <MessageSquare size={16} strokeWidth={1.5} />,
      },
      {
        href: "/dashboard/domains",
        label: "Domains",
        icon: <Globe size={16} strokeWidth={1.5} />,
      },
    ],
  },
];

interface Props {
  portfolioSlug: string;
  portfolioTitle: string;
  userName: string;
  unreadCount?: number;
}

export function Sidebar({ portfolioSlug, portfolioTitle, userName, unreadCount = 0 }: Props) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[var(--color-border,#e5e5e5)]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "var(--color-primary,#6C63FF)" }}>
            P
          </div>
          <span className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-text-primary,#111)" }}>
            Portfolio SaaS
          </span>
        </Link>
      </div>

      {/* Portfolio preview */}
      <div className="px-4 py-3 border-b border-[var(--color-border,#e5e5e5)]">
        <a href={`/${portfolioSlug}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-surface,#f8f8f8)] group"
          style={{ color: "var(--color-text-secondary,#555)" }}>
          <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] flex-shrink-0"
            style={{ background: "color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)", color: "var(--color-primary,#6C63FF)" }}>
            ✦
          </div>
          <span className="truncate flex-1">{portfolioTitle}</span>
          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" strokeWidth={2} />
        </a>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-text-secondary,#555)", opacity: 0.55 }}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all relative"
                    style={{
                      background: active ? "color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)" : "transparent",
                      color: active ? "var(--color-primary,#6C63FF)" : "var(--color-text-secondary,#555)",
                    }}>
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white min-w-[18px] text-center"
                        style={{ background: "var(--color-primary,#6C63FF)" }}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                    {active && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                        style={{ background: "var(--color-primary,#6C63FF)" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-[var(--color-border,#e5e5e5)]">
        <Link href="/dashboard/account"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors hover:bg-[var(--color-surface,#f8f8f8)] group">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "color-mix(in srgb,var(--color-primary,#6C63FF) 15%,transparent)", color: "var(--color-primary,#6C63FF)" }}>
            {userName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <span className="text-xs font-medium flex-1 truncate" style={{ color: "var(--color-text-primary,#111)" }}>
            {userName}
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" strokeWidth={2} />
        </Link>
      </div>
    </aside>
  );
}
