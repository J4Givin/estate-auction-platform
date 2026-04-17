"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { use, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Camera,
  Printer,
  Truck,
  Shield,
  Package,
  AlertTriangle,
} from "lucide-react";

interface PackingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

const packingSteps: PackingStep[] = [
  { id: "step-1", label: "Inspect item", description: "Verify item matches listing photos and description. Note any discrepancies.", completed: true },
  { id: "step-2", label: "Wrap/cushion", description: "Use appropriate protective wrapping — bubble wrap for fragile, tissue for delicate surfaces.", completed: true },
  { id: "step-3", label: "Box", description: "Place in appropriately sized box with minimum 2\" cushioning on all sides.", completed: true },
  { id: "step-4", label: "Add packing slip", description: "Include printed packing slip with order details and return instructions.", completed: false },
  { id: "step-5", label: "Photo evidence", description: "Take clear photos of packed item before sealing. This is mandatory.", completed: false },
  { id: "step-6", label: "Seal", description: "Seal box with packing tape. Apply 'FRAGILE' stickers if applicable.", completed: false },
  { id: "step-7", label: "Label", description: "Apply printed shipping label. Ensure barcode is not wrinkled.", completed: false },
];

const carriers = ["FedEx", "UPS", "USPS", "DHL", "White Glove Delivery"];

const insuranceOptions = [
  { value: "basic", label: "Basic ($100)", description: "Standard carrier insurance up to $100", price: "$0.00" },
  { value: "standard", label: "Standard ($500)", description: "Enhanced coverage up to $500", price: "$4.99" },
  { value: "premium", label: "Premium ($2,000)", description: "Full coverage up to $2,000 with expedited claims", price: "$14.99" },
];

export default function OrderPackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(["step-4", "step-5"]));
  const [selectedCarrier, setSelectedCarrier] = useState("FedEx");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [insurance, setInsurance] = useState("standard");
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const completedCount = packingSteps.filter((s) => s.completed).length;
  const allComplete = completedCount === packingSteps.length;

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Operations">
<div className="flex flex-1">
<main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              href="/ops/fulfillment"
              className="inline-flex items-center gap-1 text-sm text-pewter hover:text-sapphire transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Fulfillment
            </Link>
          </div>

          <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)] mb-2">
            Order Packing SOP
          </h1>
          <p className="text-sm text-pewter mb-6">
            {orderId} — Pair of Meissen Porcelain Figurines
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column — Packing Checklist */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Bar */}
              <div className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-charcoal">Packing Progress</span>
                  <span className="text-xs font-semibold text-pewter tabular-nums">
                    {completedCount}/{packingSteps.length} steps
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-platinum/30">
                  <div
                    className="h-full rounded-full bg-sapphire transition-all duration-500"
                    style={{ width: `${(completedCount / packingSteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Packing Checklist Accordion */}
              <div className="space-y-2">
                {packingSteps.map((step) => {
                  const isExpanded = expandedSteps.has(step.id);
                  const isPhotoStep = step.id === "step-5";

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "rounded-lg border bg-white shadow-sm overflow-hidden",
                        step.completed ? "border-emerald/30" : isPhotoStep && !photoUploaded ? "border-ruby/30" : "border-platinum/50"
                      )}
                    >
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="flex w-full items-center gap-3 px-5 py-4 hover:bg-ivory/50 transition-colors"
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                            step.completed
                              ? "border-emerald bg-emerald text-white"
                              : "border-platinum bg-white text-pewter"
                          )}
                        >
                          {step.completed ? <Check className="h-4 w-4" /> : null}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-pewter shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-pewter shrink-0" />
                        )}
                        <span className={cn("text-sm font-medium flex-1 text-left", step.completed ? "text-emerald" : "text-charcoal")}>
                          {step.label}
                        </span>
                        {isPhotoStep && !photoUploaded && !step.completed && (
                          <span className="text-xs font-semibold text-ruby">Mandatory</span>
                        )}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-platinum/30 px-5 py-4">
                          <p className="text-sm text-pewter">{step.description}</p>
                          {isPhotoStep && !photoUploaded && (
                            <div className={cn(
                              "mt-3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6",
                              "border-ruby/30 bg-ruby/5"
                            )}>
                              <AlertTriangle className="h-6 w-6 text-ruby mb-2" />
                              <Camera className="h-8 w-8 text-ruby mb-2" />
                              <span className="text-sm font-medium text-ruby">Photo Required Before Shipping</span>
                              <span className="text-xs text-pewter mt-1">Upload photo evidence of packed item</span>
                              <button
                                onClick={() => setPhotoUploaded(true)}
                                className="mt-3 rounded-md bg-ruby px-3 py-1.5 text-xs font-semibold text-white hover:bg-ruby-light transition-colors"
                              >
                                Upload Photo
                              </button>
                            </div>
                          )}
                          {isPhotoStep && photoUploaded && (
                            <div className="mt-3 flex items-center gap-2 text-emerald text-sm">
                              <Check className="h-4 w-4" />
                              Photo evidence uploaded
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column — Shipping Details */}
            <div className="space-y-6">
              {/* Carrier Selection */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4">
                  Carrier
                </h2>
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                >
                  {carriers.map((carrier) => (
                    <option key={carrier} value={carrier}>{carrier}</option>
                  ))}
                </select>
              </section>

              {/* Tracking Number */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4">
                  Tracking Number
                </h2>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2.5 text-sm text-charcoal font-mono focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                />
              </section>

              {/* Insurance */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm p-5">
                <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)] mb-4">
                  <Shield className="inline h-4 w-4 mr-1.5 text-pewter" />
                  Insurance
                </h2>
                <div className="space-y-2">
                  {insuranceOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                        insurance === opt.value
                          ? "border-sapphire bg-sapphire/5"
                          : "border-platinum/50 hover:border-sapphire/30"
                      )}
                    >
                      <input
                        type="radio"
                        name="insurance"
                        value={opt.value}
                        checked={insurance === opt.value}
                        onChange={() => setInsurance(opt.value)}
                        className="mt-0.5 accent-sapphire"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-charcoal">{opt.label}</span>
                          <span className="text-xs font-semibold text-sapphire">{opt.price}</span>
                        </div>
                        <p className="text-xs text-pewter mt-0.5">{opt.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-sapphire px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sapphire-light transition-colors">
                  <Printer className="h-4 w-4" />
                  Print Label
                </button>
                <button
                  className={cn(
                    "flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition-colors",
                    allComplete && trackingNumber
                      ? "bg-emerald text-white hover:bg-emerald-light"
                      : "bg-platinum/50 text-silver cursor-not-allowed"
                  )}
                  disabled={!allComplete || !trackingNumber}
                >
                  <Truck className="h-4 w-4" />
                  Mark Shipped
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
