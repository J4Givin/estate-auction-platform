"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { Eye, MoreHorizontal, Plus } from "lucide-react";

type TabKey = "all" | "scheduled" | "onsite_capture" | "processing" | "review" | "active_selling" | "closed";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Scheduled" },
  { key: "onsite_capture", label: "Active" },
  { key: "processing", label: "Processing" },
  { key: "review", label: "Review" },
  { key: "active_selling", label: "Selling" },
  { key: "closed", label: "Closed" },
];

const mockJobs = [
  { id: "JOB-2041", client: "Harrington Estate", status: "processing", items: 47, coverage: 72, created: "2026-04-16" },
  { id: "JOB-2040", client: "Chen Family Trust", status: "review", items: 32, coverage: 91, created: "2026-04-15" },
  { id: "JOB-2039", client: "Morrison Collection", status: "active_selling", items: 85, coverage: 98, created: "2026-04-14" },
  { id: "JOB-2038", client: "Delacroix Estate", status: "scheduled", items: 0, coverage: 0, created: "2026-04-13" },
  { id: "JOB-2037", client: "Park Avenue Downsizing", status: "closed", items: 61, coverage: 100, created: "2026-04-12" },
  { id: "JOB-2036", client: "Beverly Hills Consignment", status: "onsite_capture", items: 23, coverage: 45, created: "2026-04-11" },
  { id: "JOB-2035", client: "Westlake Village Trust", status: "processing", items: 38, coverage: 65, created: "2026-04-10" },
  { id: "JOB-2034", client: "Santa Monica Relocation", status: "review", items: 19, coverage: 88, created: "2026-04-09" },
  { id: "JOB-2033", client: "Pasadena Heritage Sale", status: "active_selling", items: 112, coverage: 95, created: "2026-04-08" },
  { id: "JOB-2032", client: "Malibu Beach Estate", status: "scheduled", items: 0, coverage: 0, created: "2026-04-07" },
];

export default function JobsListPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filteredJobs =
    activeTab === "all"
      ? mockJobs
      : mockJobs.filter((j) => j.status === activeTab);

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Operations">
<div className="flex flex-1">
<main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
              Jobs
            </h1>
            <button className="inline-flex items-center gap-2 rounded-lg bg-sapphire px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sapphire-light transition-colors">
              <Plus className="h-4 w-4" />
              New Job
            </button>
          </div>

          {/* Status Tabs */}
          <div className="border-b border-platinum/50 mb-6">
            <nav className="flex gap-1 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                    activeTab === tab.key
                      ? "border-sapphire text-sapphire"
                      : "border-transparent text-pewter hover:text-charcoal hover:border-platinum"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Jobs Table */}
          <div className="rounded-lg border border-platinum/50 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-platinum/50 bg-ivory">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Job ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Client Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">Items</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pewter">Coverage</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pewter">Created</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-pewter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className={cn(
                        "border-b border-platinum/30 transition-colors hover:bg-ivory/50",
                        idx % 2 === 0 ? "bg-white" : "bg-cream"
                      )}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-sapphire font-medium">
                        <Link href={`/ops/jobs/${job.id}`} className="hover:underline">
                          {job.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-charcoal">{job.client}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={job.status} type="job" />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-charcoal">{job.items}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-platinum/30">
                            <div
                              className="h-full rounded-full bg-sapphire transition-all"
                              style={{ width: `${job.coverage}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-pewter">{job.coverage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-pewter">{job.created}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/ops/jobs/${job.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-pewter hover:bg-sapphire/10 hover:text-sapphire transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-pewter hover:bg-platinum/20 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
