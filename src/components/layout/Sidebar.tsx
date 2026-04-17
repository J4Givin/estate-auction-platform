"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Briefcase,
  Camera,
  ListChecks,
  Package,
  Globe,
  MessageSquare,
  Tag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Lock,
  Ban,
  Users,
  FileText,
  Radio,
  Scale,
  BarChart3,
  Handshake,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role?: "customer" | "ops" | "qa" | "admin";
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  roles: string[];
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Customer",
    roles: ["customer", "ops", "qa", "admin"],
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/portal", label: "Portal", icon: Home },
    ],
  },
  {
    title: "Operations",
    roles: ["ops", "admin"],
    items: [
      { href: "/jobs", label: "Jobs", icon: Briefcase },
      { href: "/capture", label: "Capture", icon: Camera },
      { href: "/queue", label: "Queue", icon: ListChecks },
      { href: "/catalog", label: "Catalog", icon: Package },
      { href: "/publish", label: "Publish", icon: Globe },
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/offers", label: "Offers", icon: Tag },
      { href: "/fulfillment", label: "Fulfillment", icon: Truck },
      { href: "/returns", label: "Returns", icon: RotateCcw },
    ],
  },
  {
    title: "QA",
    roles: ["qa", "admin"],
    items: [
      { href: "/qa/review", label: "QA Review", icon: ShieldCheck },
      { href: "/qa/auth-queue", label: "Auth Queue", icon: Lock },
      { href: "/qa/prohibited", label: "Prohibited", icon: Ban },
    ],
  },
  {
    title: "Administration",
    roles: ["admin"],
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/policies", label: "Policies", icon: FileText },
      { href: "/admin/channels", label: "Channels", icon: Radio },
      { href: "/admin/disputes", label: "Disputes", icon: Scale },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/partners", label: "Partners", icon: Handshake },
      { href: "/admin/audit-log", label: "Audit Log", icon: ClipboardList },
    ],
  },
];

export function Sidebar({ role = "admin" }: SidebarProps) {
  const pathname = usePathname();

  const visibleSections = sections.filter((section) =>
    section.roles.includes(role)
  );

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-platinum/50 bg-ivory">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {visibleSections.map((section, sectionIdx) => (
          <div key={section.title}>
            {/* Section divider (not for first section) */}
            {sectionIdx > 0 && (
              <hr className="my-3 border-t border-platinum/40" />
            )}

            {/* Section title */}
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-silver">
              {section.title}
            </p>

            {/* Nav items */}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-sapphire/10 text-sapphire"
                          : "text-pewter hover:bg-platinum/15 hover:text-charcoal"
                      )}
                    >
                      {/* Gold left accent */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gold-tone" />
                      )}
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-sapphire" : "text-silver group-hover:text-pewter"
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
