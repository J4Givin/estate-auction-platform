"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthBadge } from "@/components/catalog/AuthBadge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Star,
  AlertTriangle,
  HelpCircle,
  Camera,
  Upload,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockItem = {
  id: "ITM-4182",
  title: "Patek Philippe Calatrava Ref.5196",
  category: "Watches & Jewelry",
  description:
    "Patek Philippe Calatrava reference 5196J in 18K yellow gold. Manual-wind caliber 215 PS movement. Silver opaline dial with Breguet numerals. Case diameter 37mm. Presented with Patek Philippe certificate of origin and leather box.",
  authStatus: "in_progress" as const,
  clientName: "Worthington Family Trust",
  jobId: "JOB-1042",
  previousNotes: [
    {
      date: "2026-04-14",
      author: "Sarah M.",
      note: "Initial review suggests genuine. Serial number visible on case back. Requesting full authentication workup due to high value.",
    },
  ],
};

const photoUploadSlots = [
  { key: "makers_mark", label: "Maker's Mark Close-up", uploaded: true },
  { key: "serial_number", label: "Serial Number", uploaded: true },
  { key: "signature", label: "Signature / Hallmark", uploaded: false },
  { key: "label_tags", label: "Label / Tags", uploaded: true },
  { key: "provenance_doc", label: "Provenance Document", uploaded: false },
  { key: "additional", label: "Additional", uploaded: false },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AuthenticationDeepDivePage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const item = { ...mockItem, id: itemId || mockItem.id };

  const [origin, setOrigin] = useState("Geneva, Switzerland");
  const [acquisitionDate, setAcquisitionDate] = useState("1998-06-15");
  const [acquisitionMethod, setAcquisitionMethod] = useState("Purchased at authorized dealer");
  const [priorOwners, setPriorOwners] = useState("2");
  const [documentationAvailable, setDocumentationAvailable] = useState("certificate");
  const [evidenceSummary, setEvidenceSummary] = useState("");

  return (
    <AppShell role="qa" userName="Maria Chen" orgName="QA & Appraisal">
<div className="flex flex-1">
<main className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
          {/* Back link */}
          <div>
            <Link
              href="/qa"
              className="inline-flex items-center gap-1 text-sm text-pewter hover:text-charcoal transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to QA Dashboard
            </Link>
          </div>

          {/* Item summary */}
          <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
            <div className="flex items-start justify-between">
              <div>
                <h1
                  className="text-2xl md:text-3xl text-onyx"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  Authentication: {item.title}
                </h1>
                <p className="text-sm text-pewter mt-1">
                  {item.id} &middot; {item.category} &middot; {item.clientName} &middot; Job {item.jobId}
                </p>
                <p className="text-sm text-pewter mt-3 leading-relaxed max-w-3xl">{item.description}</p>
              </div>
              <AuthBadge status={item.authStatus} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left: Provenance & Photos */}
            <div className="xl:col-span-2 space-y-6">
              {/* Provenance Questionnaire */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h2 className="text-lg text-onyx mb-5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Provenance Questionnaire
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                      Origin / Place of Manufacture
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                      Acquisition Date
                    </label>
                    <input
                      type="date"
                      value={acquisitionDate}
                      onChange={(e) => setAcquisitionDate(e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                      Acquisition Method
                    </label>
                    <select
                      value={acquisitionMethod}
                      onChange={(e) => setAcquisitionMethod(e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
                    >
                      <option value="Purchased at authorized dealer">Purchased at authorized dealer</option>
                      <option value="Purchased at auction">Purchased at auction</option>
                      <option value="Private sale">Private sale</option>
                      <option value="Gift">Gift</option>
                      <option value="Inherited">Inherited</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                      Number of Prior Owners
                    </label>
                    <input
                      type="text"
                      value={priorOwners}
                      onChange={(e) => setPriorOwners(e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                      Documentation Available
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "certificate", label: "Certificate of Origin" },
                        { value: "receipt", label: "Original Receipt" },
                        { value: "appraisal", label: "Prior Appraisal" },
                        { value: "photos", label: "Historical Photos" },
                        { value: "none", label: "None" },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors",
                            documentationAvailable === opt.value
                              ? "border-sapphire bg-sapphire/10 text-sapphire font-medium"
                              : "border-border/60 bg-white text-pewter hover:border-sapphire/50"
                          )}
                        >
                          <input
                            type="radio"
                            name="documentation"
                            value={opt.value}
                            checked={documentationAvailable === opt.value}
                            onChange={(e) => setDocumentationAvailable(e.target.value)}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Photo Upload Grid */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Authentication Photos
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photoUploadSlots.map((slot) => (
                    <div
                      key={slot.key}
                      className={cn(
                        "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                        slot.uploaded
                          ? "border-emerald/30 bg-emerald-muted"
                          : "border-platinum bg-cream hover:border-sapphire/30 hover:bg-sapphire-muted/30"
                      )}
                    >
                      {slot.uploaded ? (
                        <>
                          <ImageIcon className="h-8 w-8 text-emerald/50" />
                          <span className="text-xs font-medium text-emerald text-center px-2">{slot.label}</span>
                          <span className="text-[10px] text-emerald/60">Uploaded</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-silver" />
                          <span className="text-xs font-medium text-pewter text-center px-2">{slot.label}</span>
                          <span className="text-[10px] text-silver">Click to upload</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Summary */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h2 className="text-lg text-onyx mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Evidence Summary
                </h2>
                <p className="text-xs text-pewter mb-3">
                  This summary will be visible to the customer on their item report.
                </p>
                <textarea
                  value={evidenceSummary}
                  onChange={(e) => setEvidenceSummary(e.target.value)}
                  placeholder="Describe the authentication findings, key evidence examined, and conclusion rationale..."
                  className="w-full rounded-lg border border-border/60 bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire resize-y min-h-[120px]"
                  rows={5}
                />
              </div>
            </div>

            {/* Right column: Actions & Previous Notes */}
            <div className="space-y-6">
              {/* Authentication Result Buttons */}
              <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                <h3 className="text-base text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Authentication Decision
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold-tone px-4 py-3 text-sm font-semibold text-white hover:bg-gold-tone-light transition-colors">
                    <Star className="h-4 w-4" />
                    Authenticated
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-ruby px-4 py-3 text-sm font-semibold text-white hover:bg-ruby-light transition-colors">
                    <AlertTriangle className="h-4 w-4" />
                    Inconclusive
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-ruby bg-white px-4 py-3 text-sm font-semibold text-ruby hover:bg-ruby-muted transition-colors">
                    <HelpCircle className="h-4 w-4" />
                    Cannot Verify
                  </button>
                </div>
              </div>

              {/* Previous Authentication Notes */}
              {item.previousNotes.length > 0 && (
                <div className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
                  <h3 className="text-base text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Previous Notes
                  </h3>
                  <div className="space-y-4">
                    {item.previousNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-gold-tone pl-4"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-charcoal">{note.author}</span>
                          <span className="text-xs text-silver">{note.date}</span>
                        </div>
                        <p className="text-sm text-pewter leading-relaxed">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="bg-gold-tone-muted rounded-xl border border-gold-tone/20 p-5">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gold-tone shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gold-tone mb-1">Authentication Guidelines</p>
                    <p className="text-xs text-gold-tone/70 leading-relaxed">
                      All high-value items ($5,000+) require full provenance documentation.
                      Luxury watches must have serial number verification against manufacturer records.
                      When in doubt, mark as &ldquo;Inconclusive&rdquo; and escalate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
