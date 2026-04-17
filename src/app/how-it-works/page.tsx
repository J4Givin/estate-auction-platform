import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Search,
  Megaphone,
  Camera,
  FileCheck,
  TrendingUp,
  Zap,
  Timer,
  DollarSign,
  ShieldCheck,
  BarChart3,
  Store,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const steps = [
  {
    number: 1,
    title: "Schedule a Walkthrough",
    description:
      "We visit your property, photograph every room, and catalog all items of value. Our trained specialists identify pieces that may hold significant worth — from fine art and antiques to designer furniture, jewelry, and collectibles.",
    details: [
      { icon: Camera, text: "Professional photography of every item" },
      { icon: ClipboardList, text: "Detailed inventory with condition notes" },
      { icon: Timer, text: "Typically completed in one visit" },
    ],
  },
  {
    number: 2,
    title: "Expert Authentication & Appraisal",
    description:
      "Our team combines AI-assisted pricing with human expert verification. High-value items receive full provenance research and authentication from certified appraisers. Every item gets a fair market value assessment.",
    details: [
      { icon: Search, text: "AI-assisted comparable sales analysis" },
      { icon: ShieldCheck, text: "Certified authentication for valuables" },
      { icon: FileCheck, text: "Detailed appraisal documentation" },
    ],
  },
  {
    number: 3,
    title: "Multi-Channel Liquidation",
    description:
      "Items are listed across 6+ selling channels simultaneously for maximum recovery. Our proprietary matching algorithm places each item on the channel where it will fetch the highest price — live auctions, online marketplaces, dealer networks, consignment, and more.",
    details: [
      { icon: Store, text: "6+ selling channels per item" },
      { icon: BarChart3, text: "Data-driven channel selection" },
      { icon: Megaphone, text: "Professional listing optimization" },
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-ivory to-cream py-20 md:py-28">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl text-onyx mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              How Estate Liquidation Works
            </h1>
            <p className="text-lg text-pewter leading-relaxed max-w-2xl mx-auto">
              From initial walkthrough to final sale, our streamlined process is
              designed to maximize recovery while keeping your involvement to a
              minimum.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="space-y-16 md:space-y-24">
            {steps.map((step) => (
              <div
                key={step.number}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start"
              >
                {/* Step Number */}
                <div className="md:col-span-2 flex md:justify-end">
                  <div
                    className="w-20 h-20 rounded-full bg-sapphire text-white flex items-center justify-center text-3xl font-semibold shadow-lg"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-10">
                  <h2
                    className="text-2xl md:text-3xl text-onyx mb-4"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    {step.title}
                  </h2>
                  <p className="text-pewter text-lg leading-relaxed mb-8 max-w-2xl">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {step.details.map((detail) => {
                      const Icon = detail.icon;
                      return (
                        <div
                          key={detail.text}
                          className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border/60"
                        >
                          <div className="w-10 h-10 rounded-lg bg-sapphire-muted flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-sapphire" />
                          </div>
                          <span className="text-sm text-charcoal leading-snug">
                            {detail.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selling Strategies */}
      <section className="py-20 md:py-24 bg-ivory">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Choose Your Selling Strategy
            </h2>
            <p className="text-pewter text-lg max-w-2xl mx-auto">
              We offer two approaches depending on your timeline and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sell-Fast */}
            <div className="bg-white rounded-xl border-2 border-sapphire/20 overflow-hidden">
              <div className="bg-sapphire p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-6 w-6 text-white" />
                  <h3
                    className="text-xl text-white"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    Sell-Fast
                  </h3>
                </div>
                <p className="text-ivory/80 text-sm">
                  Best for time-sensitive situations
                </p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-charcoal">
                    <Timer className="h-4 w-4 text-sapphire shrink-0 mt-0.5" />
                    <span>Complete liquidation in 2-4 weeks</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-charcoal">
                    <DollarSign className="h-4 w-4 text-sapphire shrink-0 mt-0.5" />
                    <span>Immediate cash offers on bulk items</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-charcoal">
                    <TrendingUp className="h-4 w-4 text-sapphire shrink-0 mt-0.5" />
                    <span>Typically recovers 60-75% of fair market value</span>
                  </li>
                </ul>
                <p className="text-xs text-pewter">
                  Ideal for property sales, estate closings, and relocations with firm deadlines.
                </p>
              </div>
            </div>

            {/* Max-Value */}
            <div className="bg-white rounded-xl border-2 border-gold-tone/20 overflow-hidden">
              <div className="bg-gold-tone p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                  <h3
                    className="text-xl text-white"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    Max-Value
                  </h3>
                </div>
                <p className="text-white/80 text-sm">
                  Best for maximizing total recovery
                </p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-charcoal">
                    <Timer className="h-4 w-4 text-gold-tone shrink-0 mt-0.5" />
                    <span>Extended 6-12 week selling window</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-charcoal">
                    <DollarSign className="h-4 w-4 text-gold-tone shrink-0 mt-0.5" />
                    <span>Premium placement on all channels</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-charcoal">
                    <TrendingUp className="h-4 w-4 text-gold-tone shrink-0 mt-0.5" />
                    <span>Typically recovers 85-95% of fair market value</span>
                  </li>
                </ul>
                <p className="text-xs text-pewter">
                  Ideal for valuable collections, high-end estates, and clients who prioritize maximum return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container max-w-screen-md mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl text-onyx mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Ready to Begin?
          </h2>
          <p className="text-pewter text-lg mb-8">
            Schedule your free, no-obligation consultation. We will visit your
            property and provide a recovery estimate within 48 hours.
          </p>
          <Link href="/book">
            <button className="inline-flex items-center gap-2 bg-sapphire text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-sapphire-light transition-colors shadow-md">
              Book Your Free Consultation
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
