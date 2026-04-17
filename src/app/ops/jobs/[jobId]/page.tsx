"use client";

import { use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JobTimeline } from "@/components/workflow/JobTimeline";
import { cn, formatCents } from "@/lib/utils";
import {
  Camera,
  ShieldCheck,
  Globe,
  MapPin,
  Calendar,
  User,
  FileText,
  DollarSign,
  Package,
  Clock,
  ArrowLeft,
} from "lucide-react";

const mockJob = {
  id: "JOB-2041",
  client: "Harrington Estate",
  status: "processing",
  address: "1247 Wilshire Blvd, Beverly Hills, CA 90210",
  contactName: "Margaret Harrington",
  contactPhone: "(310) 555-0142",
  contactEmail: "m.harrington@email.com",
  scheduledDate: "2026-04-10",
  captureDate: "2026-04-11",
  estimatedValue: 12500000,
  totalItems: 47,
  approvedItems: 28,
  pendingItems: 15,
  holdItems: 4,
  totalRevenue: 4250000,
  commissionRate: 35,
  estimatedCommission: 1487500,
  documents: [
    { name: "Trust Authorization Letter", date: "2026-04-08", type: "legal" },
    { name: "Property Access Agreement", date: "2026-04-09", type: "legal" },
    { name: "Insurance Certificate", date: "2026-04-10", type: "insurance" },
    { name: "Inventory Manifest v2", date: "2026-04-12", type: "inventory" },
  ],
  activityLog: [
    { action: "Job moved to Processing", user: "System", time: "2026-04-16T14:30:00Z" },
    { action: "QA completed for 12 items", user: "James K.", time: "2026-04-16T11:15:00Z" },
    { action: "Capture session completed", user: "Sarah M.", time: "2026-04-11T17:45:00Z" },
    { action: "Job scheduled", user: "Sarah M.", time: "2026-04-08T09:00:00Z" },
    { action: "Job created from lead", user: "System", time: "2026-04-07T16:20:00Z" },
  ],
};

export default function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link href="/ops/jobs" className="inline-flex items-center gap-1 text-sm text-pewter hover:text-sapphire transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </div>

          {/* Job Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    {jobId}
                  </h1>
                  <StatusBadge status={mockJob.status} type="job" />
                </div>
                <p className="text-lg text-pewter">{mockJob.client}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/ops/jobs/${jobId}/capture`}
                  className="inline-flex items-center gap-2 rounded-lg bg-sapphire px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sapphire-light transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  Start Capture
                </Link>
                <button className="inline-flex items-center gap-2 rounded-lg bg-gold-tone px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gold-tone-light transition-colors">
                  <ShieldCheck className="h-4 w-4" />
                  Assign QA
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-light transition-colors">
                  <Globe className="h-4 w-4" />
                  Publish Batch
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-lg border border-platinum/50 bg-white p-4 shadow-sm">
              <JobTimeline currentStatus={mockJob.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Info */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Property Info
                  </h2>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-pewter mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-silver">Address</p>
                      <p className="text-sm text-charcoal">{mockJob.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-pewter mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-silver">Contact</p>
                      <p className="text-sm text-charcoal">{mockJob.contactName}</p>
                      <p className="text-xs text-pewter">{mockJob.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-pewter mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-silver">Scheduled</p>
                      <p className="text-sm text-charcoal">{mockJob.scheduledDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-pewter mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-silver">Captured</p>
                      <p className="text-sm text-charcoal">{mockJob.captureDate}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Items Summary */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Items Summary
                  </h2>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center rounded-lg border border-platinum/30 p-4">
                    <Package className="h-5 w-5 mx-auto mb-2 text-sapphire" />
                    <p className="text-2xl font-bold tabular-nums text-sapphire">{mockJob.totalItems}</p>
                    <p className="text-xs text-pewter">Total Items</p>
                  </div>
                  <div className="text-center rounded-lg border border-emerald/30 p-4">
                    <ShieldCheck className="h-5 w-5 mx-auto mb-2 text-emerald" />
                    <p className="text-2xl font-bold tabular-nums text-emerald">{mockJob.approvedItems}</p>
                    <p className="text-xs text-pewter">Approved</p>
                  </div>
                  <div className="text-center rounded-lg border border-gold-tone/30 p-4">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-gold-tone" />
                    <p className="text-2xl font-bold tabular-nums text-gold-tone">{mockJob.pendingItems}</p>
                    <p className="text-xs text-pewter">Pending</p>
                  </div>
                  <div className="text-center rounded-lg border border-ruby/30 p-4">
                    <Package className="h-5 w-5 mx-auto mb-2 text-ruby" />
                    <p className="text-2xl font-bold tabular-nums text-ruby">{mockJob.holdItems}</p>
                    <p className="text-xs text-pewter">On Hold</p>
                  </div>
                </div>
              </section>

              {/* Financial Summary */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Financial Summary
                  </h2>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-silver mb-1">Estimated Value</p>
                    <p className="text-xl font-bold tabular-nums text-charcoal">{formatCents(mockJob.estimatedValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-silver mb-1">Total Revenue</p>
                    <p className="text-xl font-bold tabular-nums text-emerald">{formatCents(mockJob.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-silver mb-1">
                      Commission ({mockJob.commissionRate}%)
                    </p>
                    <p className="text-xl font-bold tabular-nums text-sapphire">{formatCents(mockJob.estimatedCommission)}</p>
                  </div>
                </div>
              </section>

              {/* Documents */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Documents
                  </h2>
                </div>
                <ul className="divide-y divide-platinum/30">
                  {mockJob.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-3 px-5 py-3 hover:bg-ivory/50 transition-colors">
                      <FileText className="h-4 w-4 text-pewter shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-charcoal">{doc.name}</p>
                        <p className="text-xs text-pewter">{doc.date}</p>
                      </div>
                      <span className="rounded-full bg-sapphire/10 px-2.5 py-0.5 text-xs font-medium text-sapphire capitalize">
                        {doc.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column — Activity Log */}
            <div>
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm sticky top-24">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Activity Log
                  </h2>
                </div>
                <ul className="divide-y divide-platinum/30">
                  {mockJob.activityLog.map((entry, idx) => (
                    <li key={idx} className="px-5 py-3">
                      <p className="text-sm text-charcoal">{entry.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-pewter">{entry.user}</span>
                        <span className="text-xs text-platinum">|</span>
                        <span className="text-xs text-silver">
                          {new Date(entry.time).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
