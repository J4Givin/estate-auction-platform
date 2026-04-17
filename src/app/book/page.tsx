"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Target,
  CheckCircle2,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

const propertyTypes = [
  "Single Family Home",
  "Condo / Apartment",
  "Townhouse",
  "Estate / Mansion",
  "Storage Unit",
  "Commercial Property",
  "Other",
];

const timelines = [
  "Urgent (within 2 weeks)",
  "Soon (2-4 weeks)",
  "Flexible (1-3 months)",
  "No rush (3+ months)",
];

const goals = [
  "Sell everything for maximum value",
  "Quick clearance for property sale",
  "Downsizing — sell what we do not keep",
  "Probate estate liquidation",
  "Pre-move declutter",
  "Abandoned storage liquidation",
];

function estimateFee(rooms: number, timeline: string): string {
  const base = rooms * 350;
  const urgencyMultiplier = timeline.includes("Urgent")
    ? 1.25
    : timeline.includes("Soon")
      ? 1.1
      : 1;
  const estimate = Math.round(base * urgencyMultiplier);
  const low = Math.round(estimate * 0.8);
  const high = Math.round(estimate * 1.2);
  return `$${low.toLocaleString()} – $${high.toLocaleString()}`;
}

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Property
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [roomCount, setRoomCount] = useState(5);

  // Step 3: Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [referralCode, setReferralCode] = useState("");

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim() && email.trim() && phone.trim();
      case 2:
        return address.trim() && propertyType && timeline;
      case 3:
        return selectedGoals.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/book/confirmation");
  };

  const stepLabels = ["Contact", "Property", "Goals", "Confirm"];

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="container max-w-screen-sm mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl text-onyx mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Book Your Free Consultation
            </h1>
            <p className="text-pewter">
              Tell us about your situation and we will be in touch within 24 hours.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              {stepLabels.map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium",
                    i + 1 <= step ? "text-sapphire" : "text-silver"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                      i + 1 < step
                        ? "bg-sapphire text-white"
                        : i + 1 === step
                          ? "bg-sapphire text-white"
                          : "bg-platinum text-pewter"
                    )}
                  >
                    {i + 1 < step ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="hidden sm:inline">{label}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1.5 bg-platinum rounded-full overflow-hidden">
              <div
                className="h-full bg-sapphire rounded-full transition-all duration-300"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div
            className="bg-white rounded-xl p-6 md:p-8"
            style={{
              boxShadow:
                "0 4px 24px rgba(15,14,13,0.08), 0 1px 4px rgba(15,14,13,0.04)",
              borderRadius: "12px",
            }}
          >
            {/* Step 1: Contact Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-sapphire" />
                  <h2
                    className="text-xl text-onyx"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-silver text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-silver text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-silver text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Property & Timeline */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-sapphire" />
                  <h2
                    className="text-xl text-onyx"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    Property & Timeline
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Property Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main St, Los Angeles, CA 90001"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-silver text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
                  >
                    <option value="">Select your timeline</option>
                    {timelines.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Approximate Room Count: {roomCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={roomCount}
                    onChange={(e) => setRoomCount(Number(e.target.value))}
                    className="w-full accent-sapphire"
                  />
                  <div className="flex justify-between text-xs text-silver">
                    <span>1 room</span>
                    <span>20 rooms</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-sapphire" />
                  <h2
                    className="text-xl text-onyx"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    Your Goals
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    What do you want to accomplish? (select all that apply)
                  </label>
                  <div className="space-y-2">
                    {goals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors",
                          selectedGoals.includes(goal)
                            ? "border-sapphire bg-sapphire-muted text-sapphire font-medium"
                            : "border-border text-charcoal hover:border-sapphire/40"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2
                            className={cn(
                              "h-4 w-4",
                              selectedGoals.includes(goal)
                                ? "text-sapphire"
                                : "text-platinum"
                            )}
                          />
                          {goal}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal">
                    Referral Code (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-silver text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
                  />
                </div>

                {/* Fee Estimator */}
                {timeline && (
                  <div className="bg-gold-tone-muted rounded-xl p-4 border border-gold-tone/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-gold-tone" />
                      <span className="text-sm font-medium text-gold-tone">
                        Estimated Service Fee
                      </span>
                    </div>
                    <p
                      className="text-xl text-onyx font-semibold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {estimateFee(roomCount, timeline)}
                    </p>
                    <p className="text-xs text-pewter mt-1">
                      This is a rough estimate. Final pricing will be provided after the walkthrough.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-sapphire" />
                  <h2
                    className="text-xl text-onyx"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    Confirm Your Details
                  </h2>
                </div>

                <p className="text-sm text-pewter">
                  Please review the information below before submitting.
                </p>

                <div className="space-y-4">
                  <div className="bg-ivory rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-pewter uppercase tracking-wide mb-2">
                      Contact
                    </h4>
                    <p className="text-sm text-charcoal">{name}</p>
                    <p className="text-sm text-charcoal">{email}</p>
                    <p className="text-sm text-charcoal">{phone}</p>
                  </div>

                  <div className="bg-ivory rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-pewter uppercase tracking-wide mb-2">
                      Property
                    </h4>
                    <p className="text-sm text-charcoal">{address}</p>
                    <p className="text-sm text-charcoal">
                      {propertyType} &middot; {roomCount} rooms
                    </p>
                    <p className="text-sm text-charcoal">{timeline}</p>
                  </div>

                  <div className="bg-ivory rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-pewter uppercase tracking-wide mb-2">
                      Goals
                    </h4>
                    <ul className="space-y-1">
                      {selectedGoals.map((goal) => (
                        <li
                          key={goal}
                          className="text-sm text-charcoal flex items-start gap-2"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald shrink-0 mt-0.5" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                    {referralCode && (
                      <p className="text-sm text-charcoal mt-2">
                        Referral: {referralCode}
                      </p>
                    )}
                  </div>

                  {timeline && (
                    <div className="bg-gold-tone-muted rounded-lg p-4 border border-gold-tone/20">
                      <span className="text-sm font-medium text-gold-tone">
                        Estimated Fee:{" "}
                      </span>
                      <span className="text-sm text-onyx font-semibold">
                        {estimateFee(roomCount, timeline)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-sm font-medium text-pewter hover:text-charcoal transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 bg-sapphire text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-sapphire-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-sapphire text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-sapphire-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Booking
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
