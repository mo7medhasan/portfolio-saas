"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Palette, Search, Settings,
  Image, Mail, Globe, ChevronRight, ExternalLink,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: boolean;
}
interface NavGroup { label: string; items: NavItem[] }

// ── Nav definition ────────────────────────────────────────────────────────────
const NAV: NavGroup[] = [
  {
    label: "Portfolio",
    items: [
      { href: "/dashboard",        label: "Sections", icon: <LayoutGrid size={15} /> },
      { href: "/dashboard/theme",  label: "Theme",    icon: <Palette    size={15} /> },
      { href: "/dashboard/seo",    label: "SEO",      icon: <Search     size={15} /> },
      { href: "/dashboard/settings",label:"Settings", icon: <Settings   size={15} /> },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/dashboard/media",    label: "Media",    icon: <Image  size={15} /> },
      { href: "/dashboard/messages", label: "Messages", icon: <Mail   size={15} />, badge: true },
      { href: "/dashboard/domains",  label: "Domains",  icon: <Globe  size={15} /> },
    ],
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  portfolioSlug:  string;
  portfolioTitle: string;
  userName:       string;
  unreadCount?:   number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function Sidebar({ portfolioSlug, portfolioTitle, userName, unreadCount = 0 }: Props) {
  const pathname  = usePathname();
  const isActive  = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="flex flex-col h-full select-none">

      {/* Brand */}
      <div className="px-4 h-14 flex items-center border-b border-[var(--color-border,#e5e5e5)] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <span
            className="size-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "var(--color-primary,#6C63FF)" }}
          >
            P
          </span>
          <span
            className="text-sm font-semibold truncate"
            style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-text-primary,#111)" }}
          >
            Portfolio SaaS
          </span>
        </Link>
      </div>

      {/* Portfolio preview */}
      <div className="px-3 py-2.5 border-b border-[var(--color-border,#e5e5e5)] shrink-0">
        <a
          href={`/${portfolioSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors hover:bg-[var(--color-surface,#f8f8f8)] group min-w-0"
          style={{ color: "var(--color-text-secondary,#555)" }}
        >
          <span
            className="size-5 rounded flex items-center justify-center shrink-0 text-[10px]"
            style={{
              background: "color-mix(in srgb,var(--color-primary,#6C63FF) 10%,transparent)",
              color: "var(--color-primary,#6C63FF)",
            }}
          >
            ✦
          </span>
          <span className="truncate flex-1 font-medium">{portfolioTitle}</span>
          <ExternalLink
            size={11}
            className="shrink-0 opacity-0 group-hover:opacity-70 transition-opacity"
          />
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV.map((group) => (
          <div key={group.label}>
            {/* Group label */}
            <p
              className="px-2 mb-1 text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-text-secondary,#555)", opacity: 0.5 }}
            >
              {group.label}
            </p>

            {/* Items */}
            <div className="space-y-px">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: active
                        ? "color-mix(in srgb,var(--color-primary,#6C63FF) 8%,transparent)"
                        : "transparent",
                      color: active
                        ? "var(--color-primary,#6C63FF)"
                        : "var(--color-text-secondary,#555)",
                    }}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>

                    {/* Unread badge */}
                    {item.badge && unreadCount > 0 && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-px rounded-full text-white min-w-[18px] text-center"
                        style={{ background: "var(--color-primary,#6C63FF)" }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}

                    {/* Active indicator */}
                    {active && (
                      <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                        style={{ background: "var(--color-primary,#6C63FF)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-[var(--color-border,#e5e5e5)] shrink-0">
        <Link
          href="/dashboard/account"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors hover:bg-[var(--color-surface,#f8f8f8)] group"
        >
          {/* Avatar initial */}
          <span
            className="size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: "color-mix(in srgb,var(--color-primary,#6C63FF) 12%,transparent)",
              color: "var(--color-primary,#6C63FF)",
            }}
          >
            {userName?.[0]?.toUpperCase() ?? "U"}
          </span>
          <span
            className="text-xs font-medium flex-1 truncate"
            style={{ color: "var(--color-text-primary,#111)" }}
          >
            {userName}
          </span>
          <ChevronRight
            size={13}
            className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
          />
        </Link>
      </div>
    </aside>
  );
}
