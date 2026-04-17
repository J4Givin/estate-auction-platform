"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gavel, LayoutDashboard, Briefcase, ShieldCheck, Settings,
  Handshake, CalendarPlus, Home, Camera, ListChecks, Package,
  Globe, MessageSquare, Tag, Truck, RotateCcw, Lock, Ban,
  Users, FileText, Radio, Scale, BarChart3, ClipboardList,
  ChevronLeft, Menu, X, Bell, Search, LogOut, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

/* ─── Nav definition ─── */
type Role = "customer" | "ops" | "qa" | "admin" | "partner";

interface NavItem  { href: string; label: string; icon: React.ElementType; badge?: string; }
interface NavGroup { title: string; roles: Role[]; items: NavItem[]; }

const navGroups: NavGroup[] = [
  {
    title: "My Portal",
    roles: ["customer", "ops", "qa", "admin", "partner"],
    items: [
      { href: "/portal",    label: "Overview",     icon: Home },
      { href: "/book",      label: "Book a Scan",  icon: CalendarPlus },
    ],
  },
  {
    title: "Operations",
    roles: ["ops", "admin"],
    items: [
      { href: "/ops",                 label: "Dashboard",    icon: LayoutDashboard },
      { href: "/ops/jobs",            label: "Jobs",         icon: Briefcase },
      { href: "/ops/queue",           label: "Queue",        icon: ListChecks },
      { href: "/ops/publish",         label: "Publish",      icon: Globe },
      { href: "/ops/messages",        label: "Messages",     icon: MessageSquare, badge: "3" },
      { href: "/ops/offers",          label: "Offers",       icon: Tag },
      { href: "/ops/fulfillment",     label: "Fulfillment",  icon: Truck },
      { href: "/ops/returns",         label: "Returns",      icon: RotateCcw },
    ],
  },
  {
    title: "Quality & Auth",
    roles: ["qa", "admin"],
    items: [
      { href: "/qa",           label: "QA Dashboard", icon: ShieldCheck },
      { href: "/qa/prohibited",label: "Prohibited",   icon: Ban },
    ],
  },
  {
    title: "Administration",
    roles: ["admin"],
    items: [
      { href: "/admin",              label: "Admin Home",  icon: Settings },
      { href: "/admin/users",        label: "Users",       icon: Users },
      { href: "/admin/policies",     label: "Policies",    icon: FileText },
      { href: "/admin/channels",     label: "Channels",    icon: Radio },
      { href: "/admin/disputes",     label: "Disputes",    icon: Scale, badge: "2" },
      { href: "/admin/analytics",    label: "Analytics",   icon: BarChart3 },
      { href: "/admin/partners",     label: "Partners",    icon: Handshake },
      { href: "/admin/audit",        label: "Audit Log",   icon: ClipboardList },
    ],
  },
  {
    title: "Partner",
    roles: ["partner"],
    items: [
      { href: "/partner",              label: "Dashboard",  icon: LayoutDashboard },
      { href: "/partner/referrals/new",label: "Refer Lead", icon: CalendarPlus },
      { href: "/partner/referrals",    label: "My Referrals",icon: ClipboardList },
    ],
  },
];

/* ─── Sidebar ─── */
function Sidebar({ role, collapsed, onCollapse }: { role: Role; collapsed: boolean; onCollapse: () => void }) {
  const pathname = usePathname();
  const visibleGroups = navGroups.filter(g => g.roles.includes(role));

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-ivory transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b border-border px-4 gap-3", collapsed && "justify-center px-0")}>
        <Gavel className="h-5 w-5 text-sapphire shrink-0" />
        {!collapsed && (
          <span
            className="text-lg font-semibold text-sapphire truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Estate Liquidity
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {visibleGroups.map((group, gi) => (
          <div key={group.title} className={cn(gi > 0 && "mt-1")}>
            {!collapsed && gi > 0 && <Separator className="mx-3 my-2" />}
            {!collapsed && (
              <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-widest text-silver-j">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium transition-all",
                        collapsed && "justify-center px-0 py-2.5",
                        active
                          ? "bg-sapphire/10 text-sapphire"
                          : "text-pewter hover:bg-platinum/20 hover:text-charcoal"
                      )}
                    >
                      {/* Gold left accent on active */}
                      {active && !collapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gold-j-light" />
                      )}
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-sapphire" : "text-silver-j group-hover:text-pewter")} />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className="ml-auto rounded-full bg-ruby text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">
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

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={onCollapse}
          className="flex w-full items-center justify-center rounded-lg p-2 text-silver-j hover:bg-platinum/20 hover:text-pewter transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && <span className="ml-1.5 text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Top Navbar ─── */
function Topbar({
  userName = "User",
  orgName,
  role,
  onMenuOpen,
}: {
  userName?: string;
  orgName?: string;
  role?: Role;
  onMenuOpen: () => void;
}) {
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-ivory/95 backdrop-blur px-4 sm:px-6">
      {/* Mobile menu */}
      <button
        onClick={onMenuOpen}
        className="md:hidden p-2 rounded-lg text-pewter hover:bg-platinum/20"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title placeholder — individual pages override via portal */}
      <div className="flex-1 min-w-0" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground hover:border-sapphire/40 transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Search…</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-pewter hover:bg-platinum/20 transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ruby border-2 border-ivory" />
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-platinum/20 transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-foreground leading-none">{userName}</p>
            {orgName && <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">{orgName}</p>}
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

/* ─── AppShell — wrap every authenticated page with this ─── */
interface AppShellProps {
  children: React.ReactNode;
  role?: Role;
  userName?: string;
  orgName?: string;
}

export function AppShell({ children, role = "admin", userName = "Admin User", orgName = "Estate Liquidity" }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(p => !p)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userName={userName} orgName={orgName} role={role} onMenuOpen={() => {}} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-screen-2xl p-6 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Page header helper ─── */
export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1
            className="text-3xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

/* ─── Stat card ─── */
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
  color?: "sapphire" | "emerald" | "amethyst" | "ruby" | "gold";
  trend?: { value: string; up: boolean };
}) {
  const colorMap = {
    sapphire: { bg: "bg-sapphire-muted", text: "text-sapphire", icon: "text-sapphire" },
    emerald:  { bg: "bg-emerald-j-muted", text: "text-emerald-j", icon: "text-emerald-j" },
    amethyst: { bg: "bg-amethyst-muted", text: "text-amethyst", icon: "text-amethyst" },
    ruby:     { bg: "bg-ruby-muted", text: "text-ruby", icon: "text-ruby" },
    gold:     { bg: "bg-gold-j-muted", text: "text-gold-j", icon: "text-gold-j" },
  };
  const c = colorMap[color];

  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className={cn("mt-1 text-2xl font-semibold tabular-nums", c.text)}>{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trend.up ? "text-emerald-j" : "text-ruby")}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("rounded-lg p-2.5 shrink-0", c.bg)}>
            <Icon className={cn("h-5 w-5", c.icon)} />
          </div>
        )}
      </div>
    </div>
  );
}
