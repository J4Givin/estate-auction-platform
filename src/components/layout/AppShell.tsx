"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gavel, LayoutDashboard, Briefcase, ShieldCheck, Settings,
  Handshake, CalendarPlus, Home, ListChecks, Package,
  Globe, MessageSquare, Tag, Truck, RotateCcw, Ban,
  Users, FileText, Radio, Scale, BarChart3, ClipboardList,
  PanelLeftClose, PanelLeftOpen, Bell, Search, ChevronDown,
  CheckCircle, AlertTriangle, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════ */
export type Role = "customer" | "ops" | "qa" | "admin" | "partner";

interface NavItem  { href: string; label: string; icon: React.ElementType; badge?: string; exact?: boolean; }
interface NavGroup { title: string; roles: Role[]; items: NavItem[]; }

/* ═══════════════════════════════════════
   NAV STRUCTURE
   ═══════════════════════════════════════ */
const navGroups: NavGroup[] = [
  {
    title: "Portal",
    roles: ["customer", "ops", "qa", "admin", "partner"],
    items: [
      { href: "/portal",  label: "Overview",    icon: Home,         exact: true },
      { href: "/book",    label: "Book a Scan", icon: CalendarPlus, exact: true },
    ],
  },
  {
    title: "Operations",
    roles: ["ops", "admin"],
    items: [
      { href: "/ops",             label: "Dashboard",   icon: LayoutDashboard, exact: true },
      { href: "/ops/jobs",        label: "Jobs",         icon: Briefcase },
      { href: "/ops/queue",       label: "Queue",        icon: ListChecks },
      { href: "/ops/publish",     label: "Publish",      icon: Globe },
      { href: "/ops/messages",    label: "Messages",     icon: MessageSquare, badge: "3" },
      { href: "/ops/offers",      label: "Offers",       icon: Tag },
      { href: "/ops/fulfillment", label: "Fulfillment",  icon: Truck },
      { href: "/ops/returns",     label: "Returns",      icon: RotateCcw },
    ],
  },
  {
    title: "Quality & Auth",
    roles: ["qa", "admin"],
    items: [
      { href: "/qa",            label: "QA Dashboard", icon: ShieldCheck, exact: true },
      { href: "/qa/prohibited", label: "Prohibited",   icon: Ban },
    ],
  },
  {
    title: "Admin",
    roles: ["admin"],
    items: [
      { href: "/admin",           label: "Overview",   icon: Settings,     exact: true },
      { href: "/admin/users",     label: "Users",      icon: Users },
      { href: "/admin/policies",  label: "Policies",   icon: FileText },
      { href: "/admin/channels",  label: "Channels",   icon: Radio },
      { href: "/admin/disputes",  label: "Disputes",   icon: Scale,  badge: "2" },
      { href: "/admin/analytics", label: "Analytics",  icon: BarChart3 },
      { href: "/admin/partners",  label: "Partners",   icon: Handshake },
      { href: "/admin/audit",     label: "Audit Log",  icon: ClipboardList },
    ],
  },
  {
    title: "Partner",
    roles: ["partner"],
    items: [
      { href: "/partner",               label: "Dashboard",    icon: LayoutDashboard, exact: true },
      { href: "/partner/referrals/new", label: "Refer a Lead", icon: CalendarPlus },
      { href: "/partner/referrals",     label: "My Referrals", icon: ClipboardList },
    ],
  },
];

/* ═══════════════════════════════════════
   SIDEBAR — dark chrome
   ═══════════════════════════════════════ */
function Sidebar({
  role,
  collapsed,
  onCollapse,
}: {
  role: Role;
  collapsed: boolean;
  onCollapse: () => void;
}) {
  const pathname = usePathname();
  const visibleGroups = navGroups.filter(g => g.roles.includes(role));

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 overflow-hidden",
        "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
        "border-r",
        collapsed ? "w-[64px]" : "w-[232px]"
      )}
      style={{
        background: "var(--color-chrome)",
        borderColor: "var(--color-chrome-border)",
      }}
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          "flex h-[60px] items-center shrink-0 border-b px-4 gap-3",
          collapsed && "justify-center px-0"
        )}
        style={{ borderColor: "var(--color-chrome-border)" }}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sapphire shrink-0">
          <Gavel className="h-3.5 w-3.5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p
              className="text-[15px] font-medium text-white leading-none truncate"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
            >
              Estate Liquidity
            </p>
            <p className="text-[10px] mt-0.5 leading-none" style={{ color: "var(--color-chrome-text)" }}>
              Platform
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 overflow-x-hidden">
        {visibleGroups.map((group, gi) => (
          <div key={group.title} className={cn(gi > 0 && "mt-4")}>
            {!collapsed && (
              <p
                className="mb-1 px-4 text-[9.5px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "#4A5568" }}
              >
                {group.title}
              </p>
            )}
            {collapsed && gi > 0 && (
              <div className="mx-4 mb-3 h-px" style={{ background: "var(--color-chrome-border)" }} />
            )}
            <ul className="space-y-[2px] px-2">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-[7px] px-2.5 py-[7px]",
                        "text-[13px] font-medium leading-none",
                        "transition-all duration-150 ease-out",
                        collapsed && "justify-center px-0 py-[9px]",
                        active
                          ? "bg-white/10 text-white"
                          : "text-[#94A3B8] hover:bg-white/5 hover:text-[#CBD5E1]"
                      )}
                    >
                      {/* Active indicator — left glow bar */}
                      {active && (
                        <span
                          className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full"
                          style={{ background: "var(--color-gold-bright)" }}
                        />
                      )}

                      <Icon
                        className={cn(
                          "shrink-0 transition-colors duration-150",
                          collapsed ? "h-[18px] w-[18px]" : "h-4 w-4",
                          active ? "text-white" : "text-[#64748B] group-hover:text-[#94A3B8]"
                        )}
                      />

                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}

                      {!collapsed && item.badge && (
                        <span
                          className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
                          style={{ background: "var(--color-ruby)" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Collapse toggle ── */}
      <div className="shrink-0 p-3 border-t" style={{ borderColor: "var(--color-chrome-border)" }}>
        <button
          onClick={onCollapse}
          className={cn(
            "flex w-full items-center rounded-lg px-2 py-1.5 gap-2",
            "text-[#64748B] hover:text-[#94A3B8] hover:bg-white/5",
            "transition-all duration-150 text-[12px]",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed
            ? <PanelLeftOpen className="h-4 w-4 shrink-0" />
            : <><PanelLeftClose className="h-4 w-4 shrink-0" /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════
   TOPBAR — ivory with sapphire ring
   ═══════════════════════════════════════ */
function Topbar({
  userName = "User",
  orgName = "Estate Liquidity",
  role,
  pageTitle,
  onMenuOpen,
}: {
  userName?: string;
  orgName?: string;
  role?: Role;
  pageTitle?: string;
  onMenuOpen: () => void;
}) {
  const initials = userName
    .split(" ")
    .map(n => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel: Record<Role, string> = {
    customer: "Client",
    ops: "Operations",
    qa: "QA & Appraisal",
    admin: "Administration",
    partner: "Partner",
  };

  return (
    <header
      className="sticky top-0 z-40 flex h-[60px] shrink-0 items-center gap-4 px-5 border-b"
      style={{
        background: "var(--color-ivory)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Page title area */}
      <div className="flex-1 min-w-0">
        <p
          className="text-lg font-medium text-foreground leading-none truncate"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
        >
          {pageTitle ?? orgName}
        </p>
        {role && (
          <p className="text-[11px] mt-0.5 leading-none" style={{ color: "var(--color-foreground-faint)" }}>
            {roleLabel[role]}
          </p>
        )}
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Search pill */}
        <button
          className="hidden sm:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all duration-150 hover:border-sapphire/30"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-foreground-faint)",
          }}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden lg:inline text-[13px]">Search…</span>
          <kbd className="hidden lg:inline-flex items-center rounded px-1.5 text-[10px] font-medium" style={{ background: "var(--color-muted)", color: "var(--color-foreground-faint)" }}>⌘K</kbd>
        </button>

        {/* Notification bell */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 hover:bg-black/5"
          style={{ color: "var(--color-foreground-muted)" }}
        >
          <Bell className="h-4 w-4" />
          <span
            className="absolute top-1.5 right-1.5 h-[7px] w-[7px] rounded-full border-[1.5px]"
            style={{ background: "var(--color-ruby)", borderColor: "var(--color-ivory)" }}
          />
        </button>

        {/* Divider */}
        <div className="h-5 w-px mx-1" style={{ background: "var(--color-border)" }} />

        {/* User chip */}
        <button
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-black/5"
        >
          {/* Avatar */}
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-white text-[11px] font-semibold shrink-0"
            style={{ background: "var(--color-sapphire)" }}
          >
            {initials}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-[12.5px] font-medium" style={{ color: "var(--color-foreground)" }}>
              {userName}
            </p>
            <p className="text-[10.5px] mt-0.5" style={{ color: "var(--color-foreground-faint)" }}>
              {orgName}
            </p>
          </div>
          <ChevronDown className="hidden sm:block h-3 w-3 shrink-0" style={{ color: "var(--color-foreground-faint)" }} />
        </button>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════
   APP SHELL — main export
   ═══════════════════════════════════════ */
interface AppShellProps {
  children: React.ReactNode;
  role?: Role;
  userName?: string;
  orgName?: string;
  pageTitle?: string;
}

export function AppShell({
  children,
  role = "admin",
  userName = "Admin User",
  orgName = "Estate Liquidity",
  pageTitle,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-root">
      <Sidebar role={role} collapsed={collapsed} onCollapse={() => setCollapsed(p => !p)} />

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden" style={{ background: "var(--color-parchment)" }}>
        <Topbar
          userName={userName}
          orgName={orgName}
          role={role}
          pageTitle={pageTitle}
          onMenuOpen={() => {}}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-6 sm:p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PAGE HEADER
   ═══════════════════════════════════════ */
export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: "var(--color-gold-mid)" }}>
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1
            className="font-display leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--color-foreground)",
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--color-foreground-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2 mt-1 sm:mt-0">{actions}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   STAT CARD — elevated, premium feel
   ═══════════════════════════════════════ */
const STAT_COLORS = {
  sapphire: {
    iconBg:   "rgba(27,58,107,0.08)",
    iconText: "var(--color-sapphire)",
    value:    "var(--color-sapphire)",
    glow:     "rgba(27,58,107,0.06)",
  },
  emerald: {
    iconBg:   "rgba(11,80,50,0.08)",
    iconText: "var(--color-emerald-j)",
    value:    "var(--color-emerald-j)",
    glow:     "rgba(11,80,50,0.04)",
  },
  amethyst: {
    iconBg:   "rgba(66,24,106,0.08)",
    iconText: "var(--color-amethyst)",
    value:    "var(--color-amethyst)",
    glow:     "rgba(66,24,106,0.04)",
  },
  ruby: {
    iconBg:   "rgba(140,26,43,0.08)",
    iconText: "var(--color-ruby)",
    value:    "var(--color-ruby)",
    glow:     "rgba(140,26,43,0.04)",
  },
  gold: {
    iconBg:   "rgba(124,92,10,0.08)",
    iconText: "var(--color-gold-mid)",
    value:    "var(--color-gold-j)",
    glow:     "rgba(124,92,10,0.04)",
  },
} as const;

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color = "sapphire",
  trend,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  color?: keyof typeof STAT_COLORS;
  trend?: { value: string; up: boolean };
}) {
  const c = STAT_COLORS[color];

  return (
    <div
      className="rounded-xl p-5 border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: `var(--shadow-md), 0 0 0 0 ${c.glow}`,
      }}
    >
      {/* Subtle gradient tint in top-right */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${c.glow} 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2"
            style={{ color: "var(--color-foreground-faint)" }}
          >
            {label}
          </p>
          <p
            className="text-[1.625rem] font-semibold leading-none tabular price"
            style={{ color: c.value, fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-[11.5px]" style={{ color: "var(--color-foreground-faint)" }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className="mt-1.5 text-[11.5px] font-medium flex items-center gap-1"
              style={{ color: trend.up ? "var(--color-emerald-j)" : "var(--color-ruby)" }}
            >
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="rounded-lg p-2.5 shrink-0"
            style={{ background: c.iconBg }}
          >
            <Icon className="h-5 w-5" style={{ color: c.iconText }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION CARD — content block container
   ═══════════════════════════════════════ */
export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className,
  premium,
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  premium?: boolean;
}) {
  return (
    <div
      className={cn("rounded-xl border overflow-hidden", premium && "border-l-[3px]", className)}
      style={{
        background: "var(--color-surface)",
        borderColor: premium ? undefined : "var(--color-border)",
        borderLeftColor: premium ? "var(--color-gold-bright)" : undefined,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {(title || actions) && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 border-b"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <div>
            {title && (
              <h4 className="text-[13.5px] font-semibold" style={{ color: "var(--color-foreground)" }}>
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-[11.5px] mt-0.5" style={{ color: "var(--color-foreground-faint)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
