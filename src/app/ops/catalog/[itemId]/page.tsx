"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { use, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuthBadge } from "@/components/catalog/AuthBadge";
import { DispositionPicker } from "@/components/catalog/DispositionPicker";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  Lock,
} from "lucide-react";

type Disposition = "KEEP" | "SELL" | "DONATE" | "TRASH";
type Condition = "A" | "B" | "C" | "D";

const photoSlots = [
  { label: "Hero", color: "bg-sapphire/20 text-sapphire" },
  { label: "Detail", color: "bg-emerald/20 text-emerald" },
  { label: "Damage", color: "bg-ruby/20 text-ruby" },
  { label: "Provenance", color: "bg-amethyst/20 text-amethyst" },
  { label: "Maker Mark", color: "bg-gold-tone/20 text-gold-tone" },
];

const conditionOptions: { value: Condition; label: string; description: string }[] = [
  { value: "A", label: "Excellent", description: "Minimal wear, fully functional, museum quality" },
  { value: "B", label: "Good", description: "Light wear consistent with age, minor imperfections" },
  { value: "C", label: "Fair", description: "Noticeable wear, minor repairs needed, fully usable" },
  { value: "D", label: "Poor", description: "Significant damage or wear, requires restoration" },
];

const aiSuggestions = [
  { field: "Category", value: "Lighting — Table Lamp", confidence: 95 },
  { field: "Era", value: "Art Nouveau (1890-1910)", confidence: 88 },
  { field: "Manufacturer", value: "Tiffany Studios", confidence: 92 },
  { field: "Materials", value: "Leaded glass, patinated bronze", confidence: 90 },
  { field: "Origin", value: "New York, USA", confidence: 85 },
];

const mockItem = {
  id: "ITM-001",
  title: "Tiffany Studios Dragonfly Lamp",
  sku: "EL-2041-LR-001",
  status: "pending_review" as const,
  authStatus: "pending" as const,
  isHighValue: true,
  dimensions: { height: '18"', width: '14"', depth: '14"' },
  material: "Leaded glass, patinated bronze",
  age: "circa 1905",
  manufacturer: "Tiffany Studios",
  origin: "New York, USA",
};

export default function ItemEditorPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);
  const [disposition, setDisposition] = useState<Disposition | null>("SELL");
  const [condition, setCondition] = useState<Condition>("B");

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Operations">
<div className="flex flex-1">
<main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              href="/ops/queue"
              className="inline-flex items-center gap-1 text-sm text-pewter hover:text-sapphire transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Queue
            </Link>
          </div>

          {/* Item Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
                  {mockItem.title}
                </h1>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-xs text-pewter">{mockItem.sku}</span>
                <StatusBadge status={mockItem.status} type="item" />
                <AuthBadge status={mockItem.authStatus} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo Grid */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Photos
                  </h2>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {photoSlots.map((slot) => (
                    <div
                      key={slot.label}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-platinum/50 p-6 aspect-square",
                        slot.color
                      )}
                    >
                      <span className="text-sm font-semibold">{slot.label}</span>
                      <span className="text-xs mt-1 opacity-60">Photo</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Category Template Fields */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Item Details
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Height</label>
                      <input
                        type="text"
                        defaultValue={mockItem.dimensions.height}
                        className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Width</label>
                      <input
                        type="text"
                        defaultValue={mockItem.dimensions.width}
                        className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Depth</label>
                      <input
                        type="text"
                        defaultValue={mockItem.dimensions.depth}
                        className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Material</label>
                      <input
                        type="text"
                        defaultValue={mockItem.material}
                        className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Age</label>
                      <input
                        type="text"
                        defaultValue={mockItem.age}
                        className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Manufacturer</label>
                      <input
                        type="text"
                        defaultValue={mockItem.manufacturer}
                        className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-silver mb-1">Origin</label>
                      <input
                        type="text"
                        defaultValue={mockItem.origin}
                        className="w-full rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Condition Selector */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Condition
                  </h2>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {conditionOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCondition(opt.value)}
                        className={cn(
                          "flex flex-col items-center rounded-lg border-2 p-4 text-center transition-all",
                          condition === opt.value
                            ? "border-sapphire bg-sapphire/10 text-sapphire"
                            : "border-platinum/50 bg-white text-pewter hover:border-sapphire/30"
                        )}
                      >
                        <span className="text-lg font-bold">{opt.value}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span className="text-xs mt-1 opacity-70">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Disposition Picker */}
              <section className="rounded-lg border border-platinum/50 bg-white shadow-sm">
                <div className="border-b border-platinum/30 px-5 py-4">
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    Disposition
                  </h2>
                </div>
                <div className="p-5">
                  <DispositionPicker value={disposition} onChange={setDisposition} />
                </div>
              </section>
            </div>

            {/* Right Column — AI Suggestions + Actions */}
            <div className="space-y-6">
              {/* AI Suggestions */}
              <section className="rounded-lg border border-amethyst/30 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-amethyst/20 px-5 py-4">
                  <Sparkles className="h-5 w-5 text-amethyst" />
                  <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                    AI Suggestions
                  </h2>
                </div>
                <ul className="divide-y divide-platinum/30">
                  {aiSuggestions.map((suggestion) => (
                    <li key={suggestion.field} className="px-5 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium uppercase tracking-wider text-silver">
                          {suggestion.field}
                        </span>
                        <span className="text-xs tabular-nums text-amethyst font-semibold">
                          {suggestion.confidence}%
                        </span>
                      </div>
                      <p className="text-sm text-charcoal">{suggestion.value}</p>
                      <div className="h-1 w-full rounded-full bg-platinum/30 mt-2">
                        <div
                          className="h-full rounded-full bg-amethyst transition-all"
                          style={{ width: `${suggestion.confidence}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Request Authentication */}
              {mockItem.isHighValue && (
                <Link
                  href={`/ops/catalog/${itemId}/auth`}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-gold-tone px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gold-tone-light transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  Request Authentication
                </Link>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-sapphire px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sapphire-light transition-colors">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-light transition-colors">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </button>
                <button className="flex items-center justify-center gap-2 w-full rounded-lg border border-gold-tone text-gold-tone px-4 py-3 text-sm font-semibold hover:bg-gold-tone/10 transition-colors">
                  <ShieldCheck className="h-4 w-4" />
                  Route to QA
                </button>
              </div>

              {/* Pricing Link */}
              <Link
                href={`/ops/catalog/${itemId}/pricing`}
                className="block text-center text-sm font-medium text-sapphire hover:text-sapphire-light transition-colors underline underline-offset-2"
              >
                View Pricing Review
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
