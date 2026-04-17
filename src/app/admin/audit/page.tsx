"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Download,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type AuditActionType = "create" | "update" | "delete" | "role_change" | "login" | "approve" | "reject" | "flag" | "override";
type EntityType = "user" | "item" | "job" | "policy" | "channel" | "dispute" | "partner";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditActionType;
  entityType: EntityType;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}

const actionBadgeStyles: Record<AuditActionType, { bg: string; text: string }> = {
  create: { bg: "bg-emerald/15", text: "text-emerald" },
  update: { bg: "bg-sapphire/15", text: "text-sapphire" },
  delete: { bg: "bg-ruby/15", text: "text-ruby" },
  role_change: { bg: "bg-amethyst/15", text: "text-amethyst" },
  login: { bg: "bg-silver/15", text: "text-pewter" },
  approve: { bg: "bg-emerald/15", text: "text-emerald" },
  reject: { bg: "bg-ruby/15", text: "text-ruby" },
  flag: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  override: { bg: "bg-ruby/15", text: "text-ruby" },
};

const entityTypeBadge: Record<EntityType, { bg: string; text: string }> = {
  user: { bg: "bg-sapphire/15", text: "text-sapphire" },
  item: { bg: "bg-amethyst/15", text: "text-amethyst" },
  job: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  policy: { bg: "bg-emerald/15", text: "text-emerald" },
  channel: { bg: "bg-sapphire/15", text: "text-sapphire" },
  dispute: { bg: "bg-ruby/15", text: "text-ruby" },
  partner: { bg: "bg-amethyst/15", text: "text-amethyst" },
};

const mockAuditEntries: AuditEntry[] = [
  { id: "AE-001", timestamp: "2026-04-17 10:42 AM", actor: "Catherine Reynolds", action: "approve", entityType: "item", entityId: "ITM-4201", description: "Approved price band for Chippendale Tall-Boy Chest" },
  { id: "AE-002", timestamp: "2026-04-17 10:30 AM", actor: "Sarah Mitchell", action: "flag", entityType: "item", entityId: "ITM-4098", description: "Flagged as prohibited: Ivory-Handled Letter Opener Set" },
  { id: "AE-003", timestamp: "2026-04-17 09:55 AM", actor: "David Chen", action: "update", entityType: "channel", entityId: "ch-ebay", description: "Updated eBay rate limits", oldValue: "150/day", newValue: "200/day" },
  { id: "AE-004", timestamp: "2026-04-17 09:42 AM", actor: "Catherine Reynolds", action: "login", entityType: "user", entityId: "USR-001", description: "Admin login from 192.168.1.42" },
  { id: "AE-005", timestamp: "2026-04-16 04:30 PM", actor: "Catherine Reynolds", action: "role_change", entityType: "user", entityId: "USR-007", oldValue: "ops", newValue: "inactive", description: "Changed role for Laura Prescott" },
  { id: "AE-006", timestamp: "2026-04-16 03:15 PM", actor: "James Kimball", action: "reject", entityType: "item", entityId: "ITM-4090", description: "Rejected pricing for Reproduction Tiffany Lamp" },
  { id: "AE-007", timestamp: "2026-04-16 02:00 PM", actor: "Sarah Mitchell", action: "approve", entityType: "item", entityId: "ITM-4185", description: "Authenticated Patek Philippe — marked as genuine" },
  { id: "AE-008", timestamp: "2026-04-16 11:20 AM", actor: "Catherine Reynolds", action: "update", entityType: "policy", entityId: "POL-003", description: "Updated prohibited items list", oldValue: "v3.6", newValue: "v3.7" },
  { id: "AE-009", timestamp: "2026-04-15 05:00 PM", actor: "David Chen", action: "create", entityType: "job", entityId: "JOB-1048", description: "Created new job: Harrington Estate clearance" },
  { id: "AE-010", timestamp: "2026-04-15 03:30 PM", actor: "Catherine Reynolds", action: "override", entityType: "item", entityId: "ITM-4055", description: "Overrode prohibited flag — item cleared for sale" },
  { id: "AE-011", timestamp: "2026-04-15 02:00 PM", actor: "Catherine Reynolds", action: "create", entityType: "partner", entityId: "PTR-007", description: "Added new partner: Thomas Whitfield" },
  { id: "AE-012", timestamp: "2026-04-15 11:45 AM", actor: "Sarah Mitchell", action: "update", entityType: "item", entityId: "ITM-4170", oldValue: "pending_review", newValue: "approved", description: "QA approved George III Mahogany Breakfront" },
  { id: "AE-013", timestamp: "2026-04-14 04:30 PM", actor: "David Chen", action: "delete", entityType: "item", entityId: "ITM-3990", description: "Removed duplicate listing for Wedgwood Jasperware Vase" },
  { id: "AE-014", timestamp: "2026-04-14 02:15 PM", actor: "Catherine Reynolds", action: "update", entityType: "dispute", entityId: "DSP-003", oldValue: "investigating", newValue: "escalated", description: "Escalated Cartier Santos chargeback dispute" },
  { id: "AE-015", timestamp: "2026-04-14 10:00 AM", actor: "James Kimball", action: "flag", entityType: "item", entityId: "ITM-4102", description: "Flagged as prohibited: Military Gas Mask Collection" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AuditLogPage() {
  const [entityFilter, setEntityFilter] = useState<EntityType | "all">("all");
  const [actionFilter, setActionFilter] = useState<AuditActionType | "all">("all");
  const [actorFilter, setActorFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const allActors = [...new Set(mockAuditEntries.map((e) => e.actor))];

  const filteredEntries = mockAuditEntries.filter((entry) => {
    if (entityFilter !== "all" && entry.entityType !== entityFilter) return false;
    if (actionFilter !== "all" && entry.action !== actionFilter) return false;
    if (actorFilter !== "all" && entry.actor !== actorFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredEntries.length / perPage);
  const pagedEntries = filteredEntries.slice((page - 1) * perPage, page * perPage);

  function formatLabel(s: string): string {
    return s
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return (
    <AppShell role="admin" userName="Catherine Reynolds" orgName="Administration">
<div className="flex flex-1">
<main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl md:text-3xl text-onyx"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Audit Trail
            </h1>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-gold-tone bg-gold-tone-muted px-4 py-2 text-sm font-medium text-gold-tone hover:bg-gold-tone/15 transition-colors">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gold-tone bg-gold-tone-muted px-4 py-2 text-sm font-medium text-gold-tone hover:bg-gold-tone/15 transition-colors">
                <FileText className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-border/60 p-4" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-pewter" />
              <span className="text-sm font-medium text-charcoal">Filters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-silver mb-1 block">Entity Type</label>
                <select
                  value={entityFilter}
                  onChange={(e) => { setEntityFilter(e.target.value as EntityType | "all"); setPage(1); }}
                  className="w-full rounded-md border border-border/60 bg-cream px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:outline-none"
                >
                  <option value="all">All Types</option>
                  {(["user", "item", "job", "policy", "channel", "dispute", "partner"] as EntityType[]).map((t) => (
                    <option key={t} value={t}>{formatLabel(t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-silver mb-1 block">Action</label>
                <select
                  value={actionFilter}
                  onChange={(e) => { setActionFilter(e.target.value as AuditActionType | "all"); setPage(1); }}
                  className="w-full rounded-md border border-border/60 bg-cream px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:outline-none"
                >
                  <option value="all">All Actions</option>
                  {(["create", "update", "delete", "role_change", "login", "approve", "reject", "flag", "override"] as AuditActionType[]).map((a) => (
                    <option key={a} value={a}>{formatLabel(a)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-silver mb-1 block">Actor</label>
                <select
                  value={actorFilter}
                  onChange={(e) => { setActorFilter(e.target.value); setPage(1); }}
                  className="w-full rounded-md border border-border/60 bg-cream px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:outline-none"
                >
                  <option value="all">All Actors</option>
                  {allActors.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-silver mb-1 block">Date Range</label>
                <input
                  type="date"
                  defaultValue="2026-04-01"
                  className="w-full rounded-md border border-border/60 bg-cream px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="space-y-0">
              {pagedEntries.map((entry, idx) => {
                const actionStyle = actionBadgeStyles[entry.action];
                const entityStyle = entityTypeBadge[entry.entityType];
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-start gap-4 py-4",
                      idx > 0 && "border-t border-border/40"
                    )}
                  >
                    {/* Timestamp */}
                    <div className="w-36 shrink-0 text-xs text-pewter tabular-nums">
                      {entry.timestamp}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium text-charcoal">{entry.actor}</span>
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", actionStyle.bg, actionStyle.text)}>
                          {formatLabel(entry.action)}
                        </span>
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", entityStyle.bg, entityStyle.text)}>
                          {formatLabel(entry.entityType)}
                        </span>
                        <span className="text-xs font-mono text-pewter">{entry.entityId}</span>
                      </div>
                      <p className="text-sm text-pewter">{entry.description}</p>
                      {entry.oldValue && entry.newValue && (
                        <div className="flex items-center gap-2 mt-1.5 text-xs">
                          <span className="rounded bg-ruby-muted px-1.5 py-0.5 text-ruby font-mono">{entry.oldValue}</span>
                          <ArrowRight className="h-3 w-3 text-silver" />
                          <span className="rounded bg-emerald-muted px-1.5 py-0.5 text-emerald font-mono">{entry.newValue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-pewter">
                Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredEntries.length)} of {filteredEntries.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={cn(
                    "p-2 rounded-lg border border-border/60 transition-colors",
                    page === 1 ? "text-silver cursor-not-allowed" : "text-charcoal hover:bg-ivory"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                      p === page
                        ? "bg-sapphire text-white"
                        : "text-pewter hover:bg-ivory border border-border/60"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={cn(
                    "p-2 rounded-lg border border-border/60 transition-colors",
                    page === totalPages ? "text-silver cursor-not-allowed" : "text-charcoal hover:bg-ivory"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  );
}
