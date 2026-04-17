"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import {
  Scale,
  AlertOctagon,
  Download,
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type DisputeType = "ownership" | "damage" | "chargeback" | "return" | "legal_hold" | "prohibited";
type DisputeStatus = "open" | "investigating" | "pending_resolution" | "resolved" | "escalated";

interface Dispute {
  id: string;
  type: DisputeType;
  itemId: string;
  itemTitle: string;
  clientName: string;
  status: DisputeStatus;
  created: string;
  stopSell: boolean;
  legalHold: boolean;
  evidenceFiles: string[];
  description: string;
}

const disputeTypeBadge: Record<DisputeType, { bg: string; text: string }> = {
  ownership: { bg: "bg-sapphire/15", text: "text-sapphire" },
  damage: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  chargeback: { bg: "bg-ruby/15", text: "text-ruby" },
  return: { bg: "bg-amethyst/15", text: "text-amethyst" },
  legal_hold: { bg: "bg-ruby/15", text: "text-ruby" },
  prohibited: { bg: "bg-ruby/15", text: "text-ruby" },
};

const disputeStatusBadge: Record<DisputeStatus, { bg: string; text: string }> = {
  open: { bg: "bg-sapphire/15", text: "text-sapphire" },
  investigating: { bg: "bg-gold-tone/15", text: "text-gold-tone" },
  pending_resolution: { bg: "bg-amethyst/15", text: "text-amethyst" },
  resolved: { bg: "bg-emerald/15", text: "text-emerald" },
  escalated: { bg: "bg-ruby/15", text: "text-ruby" },
};

const mockDisputes: Dispute[] = [
  {
    id: "DSP-001",
    type: "ownership",
    itemId: "ITM-3980",
    itemTitle: "Victorian Sapphire & Diamond Ring",
    clientName: "Harrington Estate",
    status: "investigating",
    created: "2026-04-12",
    stopSell: true,
    legalHold: false,
    evidenceFiles: ["ownership_claim.pdf", "appraisal_report.pdf", "correspondence.pdf"],
    description: "Third party claims rightful ownership. Claimant is a sibling not included in the estate distribution.",
  },
  {
    id: "DSP-002",
    type: "damage",
    itemId: "ITM-4050",
    itemTitle: "George III Mahogany Secretary Bookcase",
    clientName: "Pemberton Family Trust",
    status: "open",
    created: "2026-04-15",
    stopSell: false,
    legalHold: false,
    evidenceFiles: ["shipping_photos.jpg", "delivery_receipt.pdf"],
    description: "Buyer reports damage to crown molding during transit. Investigating carrier responsibility.",
  },
  {
    id: "DSP-003",
    type: "chargeback",
    itemId: "ITM-3875",
    itemTitle: "Cartier Santos Chronograph",
    clientName: "Online Buyer #4421",
    status: "escalated",
    created: "2026-04-08",
    stopSell: true,
    legalHold: true,
    evidenceFiles: ["transaction_record.pdf", "shipping_tracking.pdf", "authentication_cert.pdf", "buyer_communication.pdf"],
    description: "Buyer filed chargeback claiming item not as described. Authentication certificate and detailed photos provided as evidence.",
  },
  {
    id: "DSP-004",
    type: "return",
    itemId: "ITM-4100",
    itemTitle: "Meissen Blue Onion Pattern Dinner Service (48 pc)",
    clientName: "Henderson Downsizing",
    status: "pending_resolution",
    created: "2026-04-14",
    stopSell: false,
    legalHold: false,
    evidenceFiles: ["return_request.pdf", "condition_report.pdf"],
    description: "Buyer requests return due to incorrect piece count. 2 serving pieces missing from listed 48-piece set.",
  },
  {
    id: "DSP-005",
    type: "legal_hold",
    itemId: "ITM-3920",
    itemTitle: "Art Deco Emerald Brooch",
    clientName: "Whitfield Probate Case",
    status: "open",
    created: "2026-04-16",
    stopSell: true,
    legalHold: true,
    evidenceFiles: ["court_order.pdf"],
    description: "Court-ordered hold on all items from the Whitfield estate pending probate resolution.",
  },
  {
    id: "DSP-006",
    type: "prohibited",
    itemId: "ITM-4098",
    itemTitle: "Ivory-Handled Letter Opener Set",
    clientName: "Thornton Estate",
    status: "resolved",
    created: "2026-04-10",
    stopSell: true,
    legalHold: false,
    evidenceFiles: ["inspection_report.pdf", "ivory_assessment.pdf"],
    description: "Item confirmed to contain ivory. Removed from all listings per prohibited items policy.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DisputesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  function formatLabel(s: string): string {
    return s
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar userName="Catherine Reynolds" role="admin" />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Heading */}
          <h1
            className="text-2xl md:text-3xl text-onyx"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Disputes &amp; Legal
          </h1>

          {/* Open disputes table */}
          <div className="bg-white rounded-xl border border-border/60 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ivory">
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">ID</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Type</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Item</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Client</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Status</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide">Stop-Sell</th>
                    <th className="text-left p-3 font-medium text-pewter text-xs uppercase tracking-wide">Created</th>
                    <th className="text-center p-3 font-medium text-pewter text-xs uppercase tracking-wide" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mockDisputes.map((dispute) => {
                    const typeStyle = disputeTypeBadge[dispute.type];
                    const statusStyle = disputeStatusBadge[dispute.status];
                    const isExpanded = expandedId === dispute.id;

                    return (
                      <>
                        <tr key={dispute.id} className="hover:bg-ivory/50 transition-colors">
                          <td className="p-3 font-mono text-xs text-charcoal">{dispute.id}</td>
                          <td className="p-3 text-center">
                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", typeStyle.bg, typeStyle.text)}>
                              {formatLabel(dispute.type)}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-charcoal">{dispute.itemTitle}</div>
                            <div className="text-xs text-pewter">{dispute.itemId}</div>
                          </td>
                          <td className="p-3 text-pewter">{dispute.clientName}</td>
                          <td className="p-3 text-center">
                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusStyle.bg, statusStyle.text)}>
                              {formatLabel(dispute.status)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {dispute.stopSell ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-ruby">
                                <AlertOctagon className="h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className="text-xs text-silver">-</span>
                            )}
                          </td>
                          <td className="p-3 text-pewter">{dispute.created}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : dispute.id)}
                              className="p-1 rounded text-pewter hover:text-charcoal transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${dispute.id}-detail`}>
                            <td colSpan={8} className="bg-cream p-5">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Description */}
                                <div className="lg:col-span-2 space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-charcoal mb-1">Description</h4>
                                    <p className="text-sm text-pewter leading-relaxed">{dispute.description}</p>
                                  </div>

                                  {/* Evidence Pack */}
                                  <div>
                                    <h4 className="text-sm font-medium text-charcoal mb-2">Evidence Pack</h4>
                                    <div className="space-y-1">
                                      {dispute.evidenceFiles.map((file) => (
                                        <div key={file} className="flex items-center gap-2 text-xs">
                                          <FileText className="h-3.5 w-3.5 text-pewter" />
                                          <span className="text-charcoal">{file}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <button className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gold-tone hover:text-gold-tone-light transition-colors">
                                      <Download className="h-3 w-3" />
                                      Export Evidence Pack
                                    </button>
                                  </div>

                                  {/* Resolution Form */}
                                  {dispute.status !== "resolved" && (
                                    <div>
                                      <h4 className="text-sm font-medium text-charcoal mb-2">Resolution</h4>
                                      <textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        placeholder="Resolution notes..."
                                        className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire resize-y min-h-[60px]"
                                        rows={2}
                                      />
                                      <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-pewter">Resolved by:</span>
                                        <span className="text-xs font-medium text-charcoal">Catherine Reynolds</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Legal Hold Toggle */}
                                <div className="space-y-4">
                                  <div className="rounded-lg border border-ruby/20 bg-ruby-muted p-4">
                                    <h4 className="text-sm font-medium text-ruby mb-3">Legal Hold</h4>
                                    <button
                                      className="w-full flex items-center justify-between rounded-lg border border-ruby/30 bg-white px-3 py-2.5 transition-colors"
                                    >
                                      <span className="text-sm font-medium text-charcoal">
                                        {dispute.legalHold ? "Legal hold ACTIVE" : "No legal hold"}
                                      </span>
                                      {dispute.legalHold ? (
                                        <ToggleRight className="h-6 w-6 text-ruby" />
                                      ) : (
                                        <ToggleLeft className="h-6 w-6 text-silver" />
                                      )}
                                    </button>
                                    <p className="text-[10px] text-ruby/60 mt-2">
                                      Legal hold prevents all sales, transfers, and modifications to associated items.
                                    </p>
                                  </div>

                                  {dispute.stopSell && (
                                    <div className="rounded-lg border border-ruby/20 bg-ruby-muted p-4 flex items-center gap-3">
                                      <AlertOctagon className="h-5 w-5 text-ruby shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-ruby">Stop-Sell Active</p>
                                        <p className="text-[10px] text-ruby/60">This item is blocked from all sales channels.</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
