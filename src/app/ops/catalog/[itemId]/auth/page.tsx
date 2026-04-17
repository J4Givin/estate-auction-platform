"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthBadge } from "@/components/catalog/AuthBadge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  Upload,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

type AuthStep = "not_required" | "pending" | "in_progress" | "authenticated" | "inconclusive";

const steps: { key: AuthStep; label: string }[] = [
  { key: "not_required", label: "Not Required" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "authenticated", label: "Authenticated" },
];

const photoRequirements = [
  { id: "pr-1", label: "Maker marks / stamps", completed: true },
  { id: "pr-2", label: "Serial number close-up", completed: true },
  { id: "pr-3", label: "Provenance documentation", completed: false },
  { id: "pr-4", label: "Signature or label details", completed: false },
  { id: "pr-5", label: "Material composition close-up", completed: true },
];

export default function AuthenticationPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);
  const [currentStep] = useState<AuthStep>("in_progress");
  const [notes, setNotes] = useState(
    "Bronze base shows expected patina consistent with early 20th century Tiffany production. Glass shade color palette matches documented Dragonfly patterns from 1905-1910 era."
  );

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName="Sarah" orgName="Estate Liquidity" role="ops" />
      <div className="flex flex-1">
        <Sidebar role="ops" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              href={`/ops/catalog/${itemId}`}
              className="inline-flex items-center gap-1 text-sm text-pewter hover:text-sapphire transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Item
            </Link>
          </div>

          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-2">
            Authentication
          </h1>
          <p className="text-sm text-pewter mb-8">Tiffany Studios Dragonfly Lamp — {itemId}</p>

          {/* Auth Status Stepper */}
          <div className="rounded-lg border border-platinum/50 bg-white shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;
                const isFuture = index > currentStepIndex;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                          isCompleted && "border-emerald bg-emerald text-white",
                          isActive && "border-sapphire bg-sapphire text-white shadow-md",
                          isFuture && "border-platinum bg-white text-platinum"
                        )}
                      >
                        {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-2 whitespace-nowrap",
                          isActive && "font-bold text-sapphire",
                          isCompleted && "font-medium text-emerald",
                          isFuture && "text-platinum"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-3",
                          index < currentStepIndex ? "bg-emerald" : "bg-platinum/50"
                        )}
                      />
                    )}
                  </div>
                );
              })}
              {/* Inconclusive branch */}
              <div className="flex flex-col items-center ml-4 opacity-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ruby bg-white text-ruby">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 text-ruby whitespace-nowrap">Inconclusive</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo Requirements Checklist */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-platinum/30 px-5 py-4">
                  <Camera className="h-5 w-5 text-pewter" />
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Extra Photo Requirements
                  </h2>
                </div>
                <ul className="divide-y divide-platinum/30">
                  {photoRequirements.map((req) => (
                    <li
                      key={req.id}
                      className={cn(
                        "flex items-center gap-3 px-5 py-3",
                        !req.completed && "bg-gold-tone/5"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                          req.completed
                            ? "border-emerald bg-emerald text-white"
                            : "border-platinum bg-white"
                        )}
                      >
                        {req.completed && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          req.completed ? "text-charcoal" : "text-pewter"
                        )}
                      >
                        {req.label}
                      </span>
                      {!req.completed && (
                        <span className="ml-auto text-xs font-medium text-gold-tone">Required</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Upload Areas */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-platinum/30 px-5 py-4">
                  <Upload className="h-5 w-5 text-pewter" />
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Authentication Evidence
                  </h2>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-sapphire/30 bg-sapphire/5 p-8 cursor-pointer hover:border-sapphire/50 transition-colors">
                    <Camera className="h-8 w-8 text-sapphire mb-2" />
                    <span className="text-sm font-medium text-sapphire">Upload Photos</span>
                    <span className="text-xs text-pewter mt-1">Drag & drop or click to browse</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-amethyst/30 bg-amethyst/5 p-8 cursor-pointer hover:border-amethyst/50 transition-colors">
                    <FileText className="h-8 w-8 text-amethyst mb-2" />
                    <span className="text-sm font-medium text-amethyst">Upload Documents</span>
                    <span className="text-xs text-pewter mt-1">Certificates, letters, reports</span>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Authentication Findings
                  </h2>
                </div>
                <div className="p-5">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire resize-none"
                    placeholder="Enter authentication findings and observations..."
                  />
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* AuthBadge Preview */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4 text-center">
                  Buyer-Facing Preview
                </h2>
                <div className="flex flex-col items-center gap-4 rounded-lg border border-platinum/30 bg-cream p-6">
                  <p className="text-xs text-pewter uppercase tracking-wider">How buyers will see this</p>
                  <AuthBadge status={currentStep} />
                  <p className="text-xs text-pewter text-center">
                    {currentStep === "authenticated"
                      ? "This item has been verified by an expert authenticator."
                      : currentStep === "in_progress"
                      ? "Authentication is currently in progress."
                      : currentStep === "inconclusive"
                      ? "Authentication was inconclusive. Sold as-is."
                      : "Authentication status will appear here."}
                  </p>
                </div>
              </section>

              {/* Decision Buttons */}
              <div className="space-y-3">
                <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-light transition-colors">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve — Authenticated
                </button>
                <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-ruby px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-ruby-light transition-colors">
                  <HelpCircle className="h-4 w-4" />
                  Mark Inconclusive
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
