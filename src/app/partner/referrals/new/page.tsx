"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Send,
  Home,
  Building2,
  Warehouse,
  Archive,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReferralType = "estate_sale" | "downsizing" | "storage_cleanout" | "probate";

const referralTypes: { value: ReferralType; label: string; icon: React.ElementType; description: string }[] = [
  { value: "estate_sale", label: "Estate Sale", icon: Home, description: "Full estate liquidation after death or relocation" },
  { value: "downsizing", label: "Downsizing", icon: Building2, description: "Senior transition or home size reduction" },
  { value: "storage_cleanout", label: "Storage Clean-out", icon: Warehouse, description: "Abandoned or delinquent storage unit clearance" },
  { value: "probate", label: "Probate", icon: Archive, description: "Court-ordered estate liquidation" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NewReferralPage() {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [notes, setNotes] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [referralType, setReferralType] = useState<ReferralType>("estate_sale");

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar userName="Robert Hargreaves" role="partner" />
      <main className="flex-1 p-6 md:p-8 max-w-screen-lg mx-auto w-full space-y-8">
        {/* Back link */}
        <Link
          href="/partner"
          className="inline-flex items-center gap-1 text-sm text-pewter hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Heading */}
        <h1
          className="text-2xl md:text-3xl text-onyx"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          Submit a Referral
        </h1>

        {/* Referral Type Selector */}
        <section className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
          <h2 className="text-lg text-onyx mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Referral Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {referralTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = referralType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setReferralType(type.value)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-all",
                    isSelected
                      ? "border-sapphire bg-sapphire/5 ring-1 ring-sapphire"
                      : "border-border/60 bg-white hover:border-sapphire/30"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                    isSelected ? "bg-sapphire-muted" : "bg-ivory"
                  )}>
                    <Icon className={cn("h-5 w-5", isSelected ? "text-sapphire" : "text-silver")} />
                  </div>
                  <h3 className={cn("text-sm font-medium mb-1", isSelected ? "text-sapphire" : "text-charcoal")}>
                    {type.label}
                  </h3>
                  <p className="text-xs text-pewter">{type.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Form */}
        <section className="bg-white rounded-xl border border-border/60 p-6" style={{ boxShadow: "0 1px 3px rgba(15,14,13,0.06)" }}>
          <h2 className="text-lg text-onyx mb-5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Client Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Client Name <span className="text-ruby">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Full name or estate name"
                className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Email <span className="text-ruby">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              >
                <option value="">Select type...</option>
                <option value="single_family">Single Family Home</option>
                <option value="condo">Condo / Apartment</option>
                <option value="townhouse">Townhouse</option>
                <option value="estate">Large Estate</option>
                <option value="storage_unit">Storage Unit</option>
                <option value="commercial">Commercial Property</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Property Address <span className="text-ruby">*</span>
              </label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Full street address, city, state, ZIP"
                className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Estimated Value Range
              </label>
              <select
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-cream px-3 py-2.5 text-sm text-charcoal focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire"
              >
                <option value="">Select range...</option>
                <option value="under_5k">Under $5,000</option>
                <option value="5k_15k">$5,000 - $15,000</option>
                <option value="15k_50k">$15,000 - $50,000</option>
                <option value="50k_100k">$50,000 - $100,000</option>
                <option value="100k_plus">$100,000+</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Urgency
              </label>
              <div className="flex gap-2">
                {["normal", "urgent", "critical"].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUrgency(u)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                      urgency === u
                        ? u === "critical"
                          ? "border-ruby bg-ruby/10 text-ruby"
                          : u === "urgent"
                          ? "border-gold-tone bg-gold-tone/10 text-gold-tone"
                          : "border-sapphire bg-sapphire/10 text-sapphire"
                        : "border-border/60 bg-white text-pewter hover:border-sapphire/30"
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-silver mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details about the estate, timeline, or special considerations..."
                className="w-full rounded-lg border border-border/60 bg-cream px-3 py-3 text-sm text-charcoal placeholder:text-silver focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire resize-y min-h-[100px]"
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* Disclaimer & Submit */}
        <div className="space-y-4">
          <div className="rounded-lg bg-cream border border-border/40 p-4">
            <p className="text-xs text-pewter leading-relaxed">
              By submitting this referral, you confirm that you have obtained consent from the client to share their contact information with Estate Liquidity for the purpose of estate liquidation services. Referral fees are subject to the terms outlined in your partner agreement. Commission is earned upon successful conversion and completion of the estate liquidation engagement.
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-sapphire px-6 py-3 text-sm font-semibold text-white hover:bg-sapphire-light transition-colors"
          >
            <Send className="h-4 w-4" />
            Submit Referral
          </button>
        </div>
      </main>
    </div>
  );
}
