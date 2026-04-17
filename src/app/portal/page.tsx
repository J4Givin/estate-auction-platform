"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobTimeline } from "@/components/workflow/JobTimeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  Package,
  CheckCircle,
  ShoppingCart,
  DollarSign,
  ClipboardList,
  ThumbsUp,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Tag,
  Gavel,
  TrendingUp,
  Clock,
} from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  icon: React.ElementType;
  iconColor: string;
}

interface QuickAction {
  label: string;
  href: string;
  color: string;
  hoverColor: string;
  icon: React.ElementType;
}

const stats: StatCard[] = [
  {
    label: "Estimated Items",
    value: "52",
    color: "text-sapphire",
    bgColor: "bg-sapphire/10",
    icon: Package,
  },
  {
    label: "Items Approved",
    value: "38",
    color: "text-emerald",
    bgColor: "bg-emerald/10",
    icon: CheckCircle,
  },
  {
    label: "Active Listings",
    value: "24",
    color: "text-amethyst",
    bgColor: "bg-amethyst/10",
    icon: ShoppingCart,
  },
  {
    label: "Total Earned",
    value: "$12,450",
    color: "text-gold-tone",
    bgColor: "bg-gold-tone/10",
    icon: DollarSign,
  },
];

const recentActivity: ActivityItem[] = [
  {
    id: "act-1",
    message: "Georgian Silver Tea Set authenticated by Worthington & Associates",
    timestamp: "2 hours ago",
    icon: ShieldCheck,
    iconColor: "text-gold-tone",
  },
  {
    id: "act-2",
    message: "New offer received on Eames Lounge Chair — $2,800",
    timestamp: "5 hours ago",
    icon: Tag,
    iconColor: "text-sapphire",
  },
  {
    id: "act-3",
    message: "Tiffany Table Lamp listed on three marketplace channels",
    timestamp: "1 day ago",
    icon: Gavel,
    iconColor: "text-amethyst",
  },
  {
    id: "act-4",
    message: "Appraisal complete for Herend Porcelain Collection — estimated $4,200",
    timestamp: "2 days ago",
    icon: TrendingUp,
    iconColor: "text-emerald",
  },
  {
    id: "act-5",
    message: "Authority documents received and verified for the Mitchell Estate",
    timestamp: "3 days ago",
    icon: Clock,
    iconColor: "text-pewter",
  },
];

const quickActions: QuickAction[] = [
  {
    label: "Review Inventory",
    href: "/portal/jobs/job-001/inventory",
    color: "bg-sapphire",
    hoverColor: "hover:bg-sapphire-light",
    icon: ClipboardList,
  },
  {
    label: "Approve Job",
    href: "/portal/jobs/job-001/approve",
    color: "bg-emerald",
    hoverColor: "hover:bg-emerald-light",
    icon: ThumbsUp,
  },
  {
    label: "View Ledger",
    href: "/portal/jobs/job-001/ledger",
    color: "bg-gold-tone",
    hoverColor: "hover:bg-gold-tone-light",
    icon: BookOpen,
  },
  {
    label: "Raise Issue",
    href: "/portal/jobs/job-001",
    color: "bg-ruby",
    hoverColor: "hover:bg-ruby-light",
    icon: AlertTriangle,
  },
];

export default function PortalDashboard() {
  const [currentJobStatus] = useState("review");

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar userName="Margaret Mitchell" role="customer" />

      <div className="flex flex-1">
        <Sidebar role="customer" />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Page Title */}
            <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
              Your Estate Dashboard
            </h1>
            <p className="mt-2 text-sm text-pewter">
              Mitchell Estate — 742 Evergreen Terrace, Pasadena, CA
            </p>

            {/* Job Status Timeline */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                  Job Progress
                </h2>
                <StatusBadge status={currentJobStatus} type="job" />
              </div>
              <JobTimeline currentStatus={currentJobStatus} />
            </div>

            {/* Key Stats Row */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-platinum/50 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          stat.bgColor
                        )}
                      >
                        <Icon className={cn("h-5 w-5", stat.color)} />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                          {stat.label}
                        </p>
                        <p
                          className={cn(
                            "text-2xl font-semibold tabular-nums font-[family-name:var(--font-display)]",
                            stat.color
                          )}
                        >
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity Feed */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Recent Activity
              </h2>
              <ul className="divide-y divide-platinum/30">
                {recentActivity.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id} className="flex items-start gap-3 py-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory">
                        <Icon className={cn("h-4 w-4", item.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal">{item.message}</p>
                        <p className="mt-0.5 text-xs text-pewter">
                          {item.timestamp}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 rounded-xl px-4 py-6 text-white shadow-sm transition-all",
                        action.color,
                        action.hoverColor,
                        "hover:shadow-md"
                      )}
                    >
                      <Icon className="h-7 w-7" />
                      <span className="text-sm font-semibold">
                        {action.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
