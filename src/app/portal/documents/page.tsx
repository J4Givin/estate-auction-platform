"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DocumentUpload } from "@/components/workflow/DocumentUpload";
import type { Document } from "@/components/workflow/DocumentUpload";
import { cn } from "@/lib/utils";
import {
  FileText,
  Scale,
  Shield,
  Gavel,
  ScrollText,
  Info,
} from "lucide-react";

type DocumentStatus = "verified" | "needs_review" | "pending";

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  explanation: string;
  status: DocumentStatus;
  documents: Document[];
}

const statusChip: Record<DocumentStatus, { label: string; bg: string; text: string }> = {
  verified: { label: "Verified", bg: "bg-emerald/10", text: "text-emerald" },
  needs_review: { label: "Needs Review", bg: "bg-gold-tone/10", text: "text-gold-tone" },
  pending: { label: "Pending", bg: "bg-platinum/15", text: "text-pewter" },
};

const initialSections: DocSection[] = [
  {
    id: "executor-letter",
    title: "Executor Letter",
    icon: FileText,
    explanation:
      "A letter of testamentary issued by the probate court confirms the named executor's legal authority to manage and distribute the estate's assets. This document is required before any items can be listed for sale.",
    status: "verified",
    documents: [
      { id: "doc-01", name: "Letters_Testamentary_Mitchell.pdf", size: 245000, status: "verified" },
    ],
  },
  {
    id: "trust-document",
    title: "Trust Document",
    icon: Shield,
    explanation:
      "If the estate is held in a revocable or irrevocable trust, the trust instrument identifies the successor trustee and their authority to liquidate trust assets. Required when property is titled in the name of a trust.",
    status: "needs_review",
    documents: [
      { id: "doc-02", name: "Mitchell_Family_Trust_2018.pdf", size: 1850000, status: "needs_review" },
    ],
  },
  {
    id: "power-of-attorney",
    title: "Power of Attorney",
    icon: Scale,
    explanation:
      "A durable power of attorney grants a named agent the legal right to act on behalf of the principal regarding financial matters, including the sale of personal property. Required if the estate owner is incapacitated.",
    status: "pending",
    documents: [],
  },
  {
    id: "court-order",
    title: "Court Order",
    icon: Gavel,
    explanation:
      "In contested estates or conservatorship proceedings, a court order may be required to authorize the sale of specific assets. This applies when there are disputes among beneficiaries or when court supervision is mandated.",
    status: "pending",
    documents: [],
  },
  {
    id: "death-certificate",
    title: "Death Certificate",
    icon: ScrollText,
    explanation:
      "A certified copy of the death certificate establishes the passing of the estate owner. This is a foundational document required by financial institutions, title companies, and marketplace platforms before proceeds can be disbursed.",
    status: "verified",
    documents: [
      { id: "doc-03", name: "Death_Certificate_Mitchell_R.pdf", size: 125000, status: "verified" },
    ],
  },
];

export default function DocumentsPage() {
  const [sections, setSections] = useState(initialSections);

  const handleUpload = useCallback(
    (sectionId: string) => (files: FileList) => {
      const newDocs: Document[] = Array.from(files).map((file, i) => ({
        id: `new-${sectionId}-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        status: "pending" as const,
      }));

      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                documents: [...section.documents, ...newDocs],
                status:
                  section.status === "pending" && newDocs.length > 0
                    ? "needs_review"
                    : section.status,
              }
            : section
        )
      );
    },
    []
  );

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar userName="Margaret Mitchell" role="customer" />

      <div className="flex flex-1">
        <Sidebar role="customer" />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-6 py-8">
            {/* Page Header */}
            <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
              Authority Documents
            </h1>
            <p className="mt-2 text-sm text-pewter leading-relaxed">
              Before we can list and sell estate items on your behalf, we are required to
              verify your legal authority over the property. Please upload the relevant
              documents below. Our compliance team reviews submissions within one business day.
            </p>

            {/* Info Banner */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-sapphire/20 bg-sapphire/5 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-sapphire" />
              <div className="text-sm text-charcoal leading-relaxed">
                <span className="font-semibold">Not sure which documents apply?</span>{" "}
                Most estates require at minimum the Executor Letter and Death Certificate.
                If the property is held in trust, the Trust Document is also required.
                Contact your Estate Liquidity coordinator if you need guidance.
              </div>
            </div>

            {/* Document Sections */}
            <div className="mt-8 space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                const chip = statusChip[section.status];

                return (
                  <div
                    key={section.id}
                    className="rounded-xl border border-platinum/50 bg-white p-6 shadow-sm"
                  >
                    {/* Section Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sapphire/10">
                          <Icon className="h-5 w-5 text-sapphire" />
                        </div>
                        <h2 className="text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                          {section.title}
                        </h2>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                          chip.bg,
                          chip.text
                        )}
                      >
                        {chip.label}
                      </span>
                    </div>

                    {/* Explanation */}
                    <p className="mt-3 text-sm text-pewter leading-relaxed">
                      {section.explanation}
                    </p>

                    {/* Upload Area */}
                    <div className="mt-4">
                      <DocumentUpload
                        documents={section.documents}
                        onUpload={handleUpload(section.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission Instructions */}
            <div className="mt-8 rounded-xl border border-platinum/50 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-charcoal font-[family-name:var(--font-display)]">
                Submission Instructions
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-pewter">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire" />
                  Upload clear, legible scans or photos of each document. PDFs are preferred.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire" />
                  All pages of multi-page documents should be included in a single file when possible.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire" />
                  Documents must be current and issued by the appropriate court or legal authority.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire" />
                  Our compliance team will verify each document within one business day of submission.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire" />
                  If a document is rejected, you will receive a notification with specific instructions for resubmission.
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
