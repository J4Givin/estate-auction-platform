"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Ban,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  X,
  Image as ImageIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

interface FlaggedItem {
  id: string;
  title: string;
  category: string;
  reasonFlagged: string;
  flaggedBy: string;
  dateFlagged: string;
  description: string;
  photos: string[];
}

const flaggedItems: FlaggedItem[] = [
  {
    id: "ITM-4098",
    title: "Ivory-Handled Letter Opener Set (4 pc)",
    category: "Desk Accessories",
    reasonFlagged: "Contains ivory — prohibited under federal and state wildlife laws",
    flaggedBy: "Sarah M.",
    dateFlagged: "2026-04-15",
    description: "Set of four letter openers with carved ivory handles and sterling silver blades. London hallmarks date to c.1920. Ivory content confirmed via visual inspection — distinctive Schreger lines visible.",
    photos: ["hero", "detail", "maker_mark"],
  },
  {
    id: "ITM-4102",
    title: "Military Surplus Gas Mask Collection",
    category: "Militaria",
    reasonFlagged: "Potential hazardous materials (asbestos filter components)",
    flaggedBy: "James K.",
    dateFlagged: "2026-04-16",
    description: "Collection of 6 Cold War-era gas masks from various NATO countries. Several contain original filter canisters that may contain asbestos-based filtering agents. Cannot be safely listed for consumer sale without professional remediation.",
    photos: ["hero", "detail", "damage"],
  },
  {
    id: "ITM-4110",
    title: "Antique Pharmacy Bottle Set with Contents",
    category: "Medical Antiques",
    reasonFlagged: "Contains unknown pharmaceutical substances — possible controlled substance",
    flaggedBy: "Laura P.",
    dateFlagged: "2026-04-16",
    description: "Set of 12 antique pharmacy bottles, several still containing original contents. Labels indicate various compounds including laudanum and other controlled or potentially hazardous substances. Items cannot be sold with contents present.",
    photos: ["hero", "detail"],
  },
];

/* ------------------------------------------------------------------ */
/*  Override Modal                                                     */
/* ------------------------------------------------------------------ */

function OverrideModal({
  item,
  onClose,
}: {
  item: FlaggedItem;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-border/60 p-6 w-full max-w-lg mx-4" style={{ boxShadow: "0 16px 48px rgba(15,14,13,0.16)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Override Prohibition
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-pewter hover:text-charcoal hover:bg-ivory transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-pewter mb-2">
          You are overriding the prohibition flag on: <strong className="text-charcoal">{item.title}</strong>
        </p>
        <p className="text-xs text-ruby mb-4">
          Original reason: {item.reasonFlagged}
        </p>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Override Reason <span className="text-ruby">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide detailed justification for allowing this item..."
          className="w-full rounded-lg border border-border/60 bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-silver focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald resize-y min-h-[100px]"
          rows={4}
        />
        <div className="flex gap-3 mt-4">
          <button
            disabled={!reason.trim()}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
              reason.trim()
                ? "bg-emerald text-white hover:bg-emerald-light"
                : "bg-platinum/50 text-silver cursor-not-allowed"
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Confirm Override
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-pewter hover:bg-ivory transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProhibitedItemsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [overrideItem, setOverrideItem] = useState<FlaggedItem | null>(null);

  return (
    <AppShell role="qa" userName="Maria Chen" orgName="QA & Appraisal">
<div className="flex flex-1">
<main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Back link */}
          <Link
            href="/qa"
            className="inline-flex items-center gap-1 text-sm text-pewter hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to QA Dashboard
          </Link>

          {/* Heading */}
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl md:text-3xl text-onyx"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Prohibited Items Queue
            </h1>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm text-sapphire hover:text-sapphire-light transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Prohibited Items Policy
            </a>
          </div>

          {/* Flagged items table */}
          <div className="space-y-4">
            {flaggedItems.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-border/60 overflow-hidden"
                  style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}
                >
                  {/* Row */}
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-8 h-8 rounded-full bg-ruby-muted flex items-center justify-center shrink-0">
                      <Ban className="h-4 w-4 text-ruby" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-charcoal text-sm truncate">{item.title}</span>
                        <span className="text-xs text-pewter">{item.id}</span>
                      </div>
                      <p className="text-xs text-pewter truncate">{item.reasonFlagged}</p>
                    </div>
                    <div className="hidden sm:block text-sm text-pewter">{item.category}</div>
                    <div className="hidden md:block text-sm text-pewter">{item.flaggedBy}</div>
                    <div className="hidden lg:block text-sm text-pewter">{item.dateFlagged}</div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="rounded-lg bg-ruby px-3 py-1.5 text-xs font-semibold text-white hover:bg-ruby-light transition-colors"
                      >
                        Confirm Prohibited
                      </button>
                      <button
                        onClick={() => setOverrideItem(item)}
                        className="rounded-lg border border-emerald bg-white px-3 py-1.5 text-xs font-semibold text-emerald hover:bg-emerald-muted transition-colors"
                      >
                        Override
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-1 rounded-md text-pewter hover:text-charcoal hover:bg-ivory transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-border/60 bg-cream p-5 space-y-4">
                      <p className="text-sm text-pewter leading-relaxed">{item.description}</p>
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-silver mb-2 block">Photos</span>
                        <div className="flex gap-3">
                          {item.photos.map((p) => (
                            <div
                              key={p}
                              className="w-20 h-20 rounded-lg border border-platinum bg-white flex flex-col items-center justify-center gap-1"
                            >
                              <ImageIcon className="h-6 w-6 text-platinum" />
                              <span className="text-[10px] text-silver capitalize">{p.replace("_", " ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-pewter">
                        <span>Flagged by: <strong className="text-charcoal">{item.flaggedBy}</strong></span>
                        <span>Date: <strong className="text-charcoal">{item.dateFlagged}</strong></span>
                        <span>Category: <strong className="text-charcoal">{item.category}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Override Modal */}
      {overrideItem && (
        <OverrideModal
          item={overrideItem}
          onClose={() => setOverrideItem(null)}
        />
      )}
    </AppShell>
  );
}
