"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CoverageScore } from "@/components/catalog/CoverageScore";
import { cn } from "@/lib/utils";
import {
  User,
  CalendarDays,
  MapPin,
  ShoppingCart,
  Package,
  Heart,
  Trash2,
  DollarSign,
  ClipboardList,
  TrendingUp,
  ThumbsUp,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface DispositionCount {
  label: string;
  count: number;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

interface QuickLink {
  label: string;
  description: string;
  href: string;
  color: string;
  icon: React.ElementType;
}

const dispositionCounts: DispositionCount[] = [
  { label: "Sell", count: 28, color: "text-sapphire", bgColor: "bg-sapphire/10", icon: ShoppingCart },
  { label: "Keep", count: 12, color: "text-amethyst", bgColor: "bg-amethyst/10", icon: Package },
  { label: "Donate", count: 8, color: "text-emerald", bgColor: "bg-emerald/10", icon: Heart },
  { label: "Trash", count: 4, color: "text-ruby", bgColor: "bg-ruby/10", icon: Trash2 },
];

export default function JobOverview() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [job] = useState({
    id: jobId,
    status: "review" as const,
    teamMember: "Sarah Chen",
    scheduledDate: "March 15, 2026",
    address: "742 Evergreen Terrace, Pasadena, CA 91101",
    propertyName: "Mitchell Estate",
    totalItems: 52,
    coverageScore: 78,
    gross: 1842000,
    fees: 276300,
    net: 1565700,
  });

  const quickLinks: QuickLink[] = [
    {
      label: "Inventory Review",
      description: "Review and assign dispositions to all cataloged items",
      href: `/portal/jobs/${jobId}/inventory`,
      color: "text-sapphire",
      icon: ClipboardList,
    },
    {
      label: "Pricing Strategy",
      description: "Select your preferred pricing and markdown strategy",
      href: `/portal/jobs/${jobId}/strategy`,
      color: "text-gold-tone",
      icon: TrendingUp,
    },
    {
      label: "Approve Items",
      description: "Approve cataloged items for listing and publication",
      href: `/portal/jobs/${jobId}/approve`,
      color: "text-emerald",
      icon: ThumbsUp,
    },
    {
      label: "Financial Ledger",
      description: "View sales, fees, and net proceeds in real time",
      href: `/portal/jobs/${jobId}/ledger`,
      color: "text-sapphire",
      icon: BookOpen,
    },
  ];

  return (
    <AppShell role="customer" userName="Client" orgName="My Portal">
<div className="flex flex-1">
<main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
                  {job.propertyName}
                </h1>
                <p className="mt-1 text-sm text-pewter">
                  Job {job.id}
                </p>
              </div>
              <StatusBadge status={job.status} type="job" />
            </div>

            {/* Job Details + Coverage */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Job Details Card */}
              <div className="col-span-2 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                  Job Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg bg-ivory/50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sapphire/10">
                      <User className="h-4 w-4 text-sapphire" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                        Team Lead
                      </p>
                      <p className="text-sm font-semibold text-charcoal">
                        {job.teamMember}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-ivory/50 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amethyst/10">
                      <CalendarDays className="h-4 w-4 text-amethyst" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                        Scheduled Date
                      </p>
                      <p className="text-sm font-semibold text-charcoal">
                        {job.scheduledDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-ivory/50 p-3 sm:col-span-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/10">
                      <MapPin className="h-4 w-4 text-emerald" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                        Property Address
                      </p>
                      <p className="text-sm font-semibold text-charcoal">
                        {job.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Score */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
                <CoverageScore score={job.coverageScore} />
                <p className="mt-3 text-center text-xs text-pewter">
                  {job.totalItems} items cataloged across all rooms
                </p>
              </div>
            </div>

            {/* Items Summary by Disposition */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Items by Disposition
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {dispositionCounts.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div
                      key={d.label}
                      className="flex flex-col items-center gap-2 rounded-lg border border-platinum/30 p-4"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          d.bgColor
                        )}
                      >
                        <Icon className={cn("h-5 w-5", d.color)} />
                      </div>
                      <span
                        className={cn(
                          "text-2xl font-semibold tabular-nums font-[family-name:var(--font-display)]",
                          d.color
                        )}
                      >
                        {d.count}
                      </span>
                      <span className="text-xs font-medium text-pewter">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Financial Summary
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-sapphire/5 p-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                    Gross Proceeds
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-sapphire font-[family-name:var(--font-display)]">
                    $18,420
                  </p>
                </div>
                <div className="rounded-lg bg-ruby/5 p-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                    Fees & Commission
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-ruby font-[family-name:var(--font-display)]">
                    $2,763
                  </p>
                </div>
                <div className="rounded-lg bg-emerald/5 p-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-pewter">
                    Net to You
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald font-[family-name:var(--font-display)]">
                    $15,657
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Continue Working
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex items-center gap-4 rounded-xl border border-platinum/50 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-sapphire/30"
                    >
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ivory",
                          link.color
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal">
                          {link.label}
                        </p>
                        <p className="mt-0.5 text-xs text-pewter">
                          {link.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-platinum transition-colors group-hover:text-sapphire" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
