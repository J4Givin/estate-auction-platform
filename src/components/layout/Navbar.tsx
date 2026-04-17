"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gavel,
  LayoutDashboard,
  Briefcase,
  ShieldCheck,
  Settings,
  Users,
  Handshake,
  LogOut,
  User,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "customer" | "ops" | "qa" | "admin" | "partner";

interface NavbarProps {
  userName?: string;
  orgName?: string;
  role?: Role;
}

const navLinks: { href: string; label: string; icon: React.ElementType; roles: Role[] }[] = [
  { href: "/portal", label: "Portal", icon: LayoutDashboard, roles: ["customer", "ops", "qa", "admin", "partner"] },
  { href: "/ops", label: "Ops", icon: Briefcase, roles: ["ops", "admin"] },
  { href: "/qa", label: "QA", icon: ShieldCheck, roles: ["qa", "admin"] },
  { href: "/admin", label: "Admin", icon: Settings, roles: ["admin"] },
  { href: "/partners", label: "Partners", icon: Handshake, roles: ["admin", "partner"] },
];

export function Navbar({ userName, orgName, role = "customer" }: NavbarProps) {
  const pathname = usePathname();

  const visibleLinks = navLinks.filter((link) =>
    link.roles.includes(role)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-platinum/50 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 mr-8">
          <Gavel className="h-5 w-5 text-sapphire" />
          <span className="text-xl font-semibold tracking-tight text-sapphire font-[family-name:var(--font-display)]">
            Estate Liquidity
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive
                    ? "text-sapphire"
                    : "text-pewter hover:text-charcoal hover:bg-platinum/15"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {/* Gold underline on active */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gold-tone" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {orgName && (
            <span className="hidden lg:inline text-xs font-medium text-pewter border border-platinum/50 rounded-full px-3 py-1">
              {orgName}
            </span>
          )}

          {userName ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-white border border-platinum/50 pl-1 pr-3 py-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sapphire text-white text-xs font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-charcoal">
                  {userName}
                </span>
              </div>
              <Link
                href="/api/auth/login"
                className="flex h-8 w-8 items-center justify-center rounded-full text-pewter hover:text-ruby hover:bg-ruby/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-pewter hover:text-charcoal hover:bg-platinum/15 transition-colors"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 rounded-md bg-sapphire px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sapphire-light transition-colors"
              >
                <CalendarPlus className="h-4 w-4" />
                Book Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
