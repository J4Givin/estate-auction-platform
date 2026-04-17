"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CompsTable, type Comp } from "@/components/catalog/CompsTable";
import { PriceBand } from "@/components/catalog/PriceBand";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Camera,
  Eye,
  AlertTriangle,
  FileText,
  Shield,
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Ban,
  Image as ImageIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockItem = {
  id: "ITM-4201",
  title: "Chippendale Tall-Boy Chest c.1780",
  category: "Furniture",
  description:
    "A fine Philadelphia Chippendale tall-boy chest of drawers in mahogany with carved quarter-columns, original brass hardware, and ogee bracket feet. Attributed to the workshop of Thomas Affleck. Shows expected age wear with minor veneer repairs to the cornice.",
  jobId: "JOB-1038",
  clientName: "Margaret Thornton Estate",
  capturedBy: "David R.",
  capturedDate: "2026-04-12",
  photoTypes: [
    { type: "hero", label: "Hero Shot", available: true },
    { type: "detail", label: "Detail", available: true },
    { type: "damage", label: "Damage", available: true },
    { type: "provenance", label: "Provenance", available: false },
    { type: "maker_mark", label: "Maker's Mark", available: true },
  ],
  riskLevel: "medium" as const,
  riskConfidence: 0.78,
};

const mockComps: Comp[] = [
  { id: "C-001", source: "christies", title: "Philadelphia Chippendale Highboy c.1770", price: 680000, date: "2025-11-14", condition: "Excellent", url: "https://christies.com" },
  { id: "C-002", source: "sothebys", title: "Chippendale Mahogany Tall Chest c.1785", price: 520000, date: "2025-09-22", condition: "Good", url: "https://sothebys.com" },
  { id: "C-003", source: "liveauctioneers", title: "American Chippendale Chest-on-Chest", price: 445000, date: "2026-01-08", condition: "Fair" },
  { id: "C-004", source: "ebay_sold", title: "Chippendale Style Tall-Boy Chest Reproduction", price: 180000, date: "2026-03-15", condition: "Good", url: "https://ebay.com" },
];

/* ------------------------------------------------------------------ */
/*  Photo Placeholder                                                  */
/* ------------------------------------------------------------------ */

function PhotoSlot({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) {
  return (
    <div
      className={cn(
        "aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2",
        available
          ? "border-platinum bg-white"
          : "border-ruby/30 bg-ruby-muted"
      )}
    >
      {available ? (
        <>
          <ImageIcon className="h-8 w-8 text-platinum" />
          <span className="text-xs font-medium text-pewter">{label}</span>
          <span className="text-[10px] text-silver">Photo uploaded</span>
        </>
      ) : (
        <>
          <Camera className="h-8 w-8 text-ruby/40" />
          <span className="text-xs font-medium text-ruby">{label}</span>
          <span className="text-[10px] text-ruby/60">Missing</span>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Risk Badge                                                         */
/* ------------------------------------------------------------------ */

function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const styles = {
    low: { bg: "bg-emerald/15", text: "text-emerald", label: "Low Risk" },
    medium: { bg: "bg-gold-tone/15", text: "text-gold-tone", label: "Medium Risk" },
    high: { bg: "bg-ruby/15", text: "text-ruby", label: "High Risk" },
  };
  const s = styles[level];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", s.bg, s.text)}>
      <Shield className="h-3 w-3" />
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function QAItemReviewPage() {
  const params = useParams();
  const itemId = params.itemId as string;

  const [rationale, setRationale] = useState("");
  const [prohibitedReason, setProhibitedReason] = useState("");
  const [showProhibitedInput, setShowProhibitedInput] = useState(false);

  const item = { ...mockItem, id: itemId || mockItem.id };

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar userName="QA Reviewer" role="qa" />
      <div className="flex flex-1">
        <Sidebar role="qa" />
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Back link & header */}
          <div>
            <Link
              href="/qa"
              className="inline-flex items-center gap-1 text-sm text-pewter hover:text-charcoal transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to QA Dashboard
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1
                  className="text-2xl md:text-3xl text-onyx"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  QA Review: {item.title}
                </h1>
                <p className="text-sm text-pewter mt-1">
                  {item.id} &middot; {item.category} &middot; {item.clientName} &middot; Job {item.jobId}
                </p>
              </div>
              <RiskBadge level={item.riskLevel} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left column: Photos & Details */}
            <div className="xl:col-span-2 space-y-6">
              {/* Item Detail Section */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h2 className="text-lg text-onyx mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Item Details
                </h2>
                <p className="text-sm text-pewter leading-relaxed mb-4">{item.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-silver">Captured By</span>
                    <p className="font-medium text-charcoal">{item.capturedBy}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-silver">Capture Date</span>
                    <p className="font-medium text-charcoal">{item.capturedDate}</p>
                  </div>
                </div>
              </div>

              {/* Photo placeholders */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Photos ({item.photoTypes.filter((p) => p.available).length}/{item.photoTypes.length} uploaded)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {item.photoTypes.map((photo) => (
                    <PhotoSlot
                      key={photo.type}
                      label={photo.label}
                      available={photo.available}
                    />
                  ))}
                </div>
              </div>

              {/* Comps Service Panel */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Comparable Sales
                </h2>
                <CompsTable comps={mockComps} />
              </div>

              {/* Price Band with Approval */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Price Band
                </h2>
                <PriceBand
                  low={450000}
                  med={600000}
                  high={720000}
                  confidence={0.88}
                  className="mb-6"
                />

                <div className="border-t border-border/60 pt-4">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Price Band Rationale <span className="text-ruby">*</span>
                  </label>
                  <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Provide rationale for the price band approval (required)..."
                    className="w-full rounded-lg border border-border/60 bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire resize-y min-h-[80px]"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Right column: Risk, Auth, Actions */}
            <div className="space-y-6">
              {/* Risk Classifier Output */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h3 className="text-base text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Risk Classifier
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-silver">Confidence Score</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-platinum/30 rounded-full">
                        <div
                          className="h-full bg-gold-tone rounded-full transition-all"
                          style={{ width: `${item.riskConfidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-charcoal">
                        {Math.round(item.riskConfidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-silver">Risk Level</span>
                    <div className="mt-1">
                      <RiskBadge level={item.riskLevel} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flag as Prohibited */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h3 className="text-base text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Prohibited Item Check
                </h3>
                {!showProhibitedInput ? (
                  <button
                    onClick={() => setShowProhibitedInput(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-ruby px-4 py-3 text-sm font-semibold text-white hover:bg-ruby-light transition-colors"
                  >
                    <Ban className="h-4 w-4" />
                    Flag as Prohibited
                  </button>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={prohibitedReason}
                      onChange={(e) => setProhibitedReason(e.target.value)}
                      placeholder="Reason for flagging as prohibited..."
                      className="w-full rounded-lg border border-ruby/30 bg-ruby-muted px-4 py-3 text-sm text-charcoal placeholder:text-ruby/40 focus:border-ruby focus:outline-none focus:ring-1 focus:ring-ruby resize-y min-h-[80px]"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button className="flex-1 rounded-lg bg-ruby px-3 py-2 text-sm font-semibold text-white hover:bg-ruby-light transition-colors">
                        Confirm Flag
                      </button>
                      <button
                        onClick={() => {
                          setShowProhibitedInput(false);
                          setProhibitedReason("");
                        }}
                        className="rounded-lg border border-border/60 px-3 py-2 text-sm font-medium text-pewter hover:bg-ivory transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Authentication Routing */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h3 className="text-base text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Authentication
                </h3>
                <Link
                  href={`/qa/auth/${item.id}`}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-gold-tone bg-gold-tone-muted px-4 py-3 text-sm font-semibold text-gold-tone hover:bg-gold-tone/15 transition-colors"
                >
                  <Star className="h-4 w-4" />
                  Route to Authentication
                </Link>
              </div>

              {/* Review Actions */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h3 className="text-base text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Review Decision
                </h3>
                <div className="space-y-3">
                  <button
                    disabled={!rationale.trim()}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                      rationale.trim()
                        ? "bg-emerald text-white hover:bg-emerald-light"
                        : "bg-platinum/50 text-silver cursor-not-allowed"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-gold-tone bg-gold-tone-muted px-4 py-3 text-sm font-semibold text-gold-tone hover:bg-gold-tone/15 transition-colors">
                    <RotateCcw className="h-4 w-4" />
                    Request Changes
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-ruby bg-ruby-muted px-4 py-3 text-sm font-semibold text-ruby hover:bg-ruby/15 transition-colors">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
