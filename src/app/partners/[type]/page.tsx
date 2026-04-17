import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Scale,
  Heart,
  Truck,
  Warehouse,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

interface PartnerData {
  title: string;
  headline: string;
  description: string;
  icon: LucideIcon;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  accentButtonBg: string;
  accentButtonHover: string;
  howItWorks: { step: number; title: string; description: string }[];
  benefits: string[];
}

const partnerData: Record<string, PartnerData> = {
  realtor: {
    title: "Realtors",
    headline: "Accelerate Property Sales With Professional Estate Clearing",
    description:
      "Homes with contents sell slower and for less. Our estate liquidation service clears properties quickly and professionally, helping your listings show better and close faster. Turn a common roadblock into a competitive advantage.",
    icon: Building2,
    accentBg: "bg-sapphire-muted",
    accentText: "text-sapphire",
    accentBorder: "border-l-sapphire",
    accentButtonBg: "bg-sapphire",
    accentButtonHover: "hover:bg-sapphire-light",
    howItWorks: [
      {
        step: 1,
        title: "Refer Your Client",
        description:
          "Share our contact or submit a referral through your partner dashboard. We reach out within 24 hours.",
      },
      {
        step: 2,
        title: "We Clear the Property",
        description:
          "Our team catalogs, appraises, and liquidates all contents. The property is left clean and showing-ready.",
      },
      {
        step: 3,
        title: "You Close the Deal",
        description:
          "With a cleared, staged-ready property, your listing moves faster. You earn a referral fee on every completed job.",
      },
    ],
    benefits: [
      "Properties show better and sell faster once cleared",
      "Earn referral fees on every estate we service",
      "Free property staging consultation with every clearing",
      "24-hour response time on all referrals",
      "Co-branded marketing materials for your listings",
      "Dedicated realtor partner success manager",
    ],
  },
  probate: {
    title: "Probate Attorneys",
    headline: "Streamlined Estate Liquidation for Your Clients",
    description:
      "Navigate the complexities of estate liquidation with a trusted partner. We provide court-ready documentation, transparent accounting, and professional handling of sensitive situations that protect your client relationships.",
    icon: Scale,
    accentBg: "bg-amethyst-muted",
    accentText: "text-amethyst",
    accentBorder: "border-l-amethyst",
    accentButtonBg: "bg-amethyst",
    accentButtonHover: "hover:bg-amethyst-light",
    howItWorks: [
      {
        step: 1,
        title: "Submit Estate Details",
        description:
          "Provide estate information through our secure partner portal. We coordinate directly with executors and beneficiaries.",
      },
      {
        step: 2,
        title: "Full Inventory & Appraisal",
        description:
          "Certified appraisals, detailed inventory, and fair market valuations suitable for probate court proceedings.",
      },
      {
        step: 3,
        title: "Transparent Liquidation",
        description:
          "Complete accounting of all items sold, with detailed reports suitable for estate accounting and court filing.",
      },
    ],
    benefits: [
      "Court-ready inventory and appraisal documentation",
      "Full accounting reports for estate proceedings",
      "Certified appraisers for high-value items",
      "Sensitive handling of family dynamics",
      "Compliance with all probate requirements",
      "Dedicated attorney partner liaison",
    ],
  },
  senior: {
    title: "Senior Transition Specialists",
    headline: "Compassionate Downsizing With Maximum Recovery",
    description:
      "Help your clients transition with dignity. We handle the emotional and logistical complexity of liquidating a lifetime of possessions, ensuring families receive fair value while treating every item with respect.",
    icon: Heart,
    accentBg: "bg-emerald-muted",
    accentText: "text-emerald",
    accentBorder: "border-l-emerald",
    accentButtonBg: "bg-emerald",
    accentButtonHover: "hover:bg-emerald-light",
    howItWorks: [
      {
        step: 1,
        title: "Initial Consultation",
        description:
          "We meet with your client and their family to understand their needs, timeline, and any items of sentimental importance.",
      },
      {
        step: 2,
        title: "Gentle Cataloging",
        description:
          "Our team works respectfully through the home, carefully sorting keep, donate, and sell items per family wishes.",
      },
      {
        step: 3,
        title: "Maximum Recovery",
        description:
          "Items designated for sale are listed across multiple channels. Proceeds go directly to the family with full transparency.",
      },
    ],
    benefits: [
      "Trained in compassionate downsizing practices",
      "Coordination with family members across the country",
      "Careful handling of sentimental and heirloom items",
      "Donation coordination for items families want given away",
      "Flexible timelines that accommodate client needs",
      "Referral fees for every completed engagement",
    ],
  },
  mover: {
    title: "Moving Companies",
    headline: "Reduce Load, Increase Revenue With Liquidation Referrals",
    description:
      "Turn pre-move decluttering into a new revenue stream. When clients need to lighten their load before a move, refer them to us. We liquidate items they no longer need, and you earn a referral fee while reducing your move volume.",
    icon: Truck,
    accentBg: "bg-gold-tone-muted",
    accentText: "text-gold-tone",
    accentBorder: "border-l-gold-tone",
    accentButtonBg: "bg-gold-tone",
    accentButtonHover: "hover:bg-gold-tone-light",
    howItWorks: [
      {
        step: 1,
        title: "Identify the Opportunity",
        description:
          "During your pre-move consultation, identify items clients want to sell rather than move. Submit a quick referral.",
      },
      {
        step: 2,
        title: "We Handle Liquidation",
        description:
          "Our team picks up, catalogs, and sells the items. No disruption to your moving schedule or operations.",
      },
      {
        step: 3,
        title: "Everyone Wins",
        description:
          "Client saves on moving costs, gets cash for items. You earn a referral fee and reduce move complexity.",
      },
    ],
    benefits: [
      "New revenue stream from existing client relationships",
      "Reduced move volume and complexity",
      "Happier clients who save on moving costs",
      "We pick up items on our own schedule",
      "No disruption to your moving operations",
      "Competitive referral fees paid monthly",
    ],
  },
  storage: {
    title: "Storage Facilities",
    headline: "Convert Abandoned Storage Into Revenue",
    description:
      "Delinquent storage units are a drain on your business. We legally and efficiently liquidate abandoned unit contents, recovering value for all parties and freeing up space for paying customers.",
    icon: Warehouse,
    accentBg: "bg-ruby-muted",
    accentText: "text-ruby",
    accentBorder: "border-l-ruby",
    accentButtonBg: "bg-ruby",
    accentButtonHover: "hover:bg-ruby-light",
    howItWorks: [
      {
        step: 1,
        title: "Notify Us of Units",
        description:
          "After following your legal lien process, submit abandoned units through our partner dashboard for liquidation.",
      },
      {
        step: 2,
        title: "Professional Inventory",
        description:
          "We catalog all contents, identify valuable items, and prepare a liquidation plan that maximizes total recovery.",
      },
      {
        step: 3,
        title: "Clear & Sell",
        description:
          "Units are cleared and cleaned, contents are sold across channels. You receive your share plus a clean, rentable unit.",
      },
    ],
    benefits: [
      "Convert non-paying units to revenue",
      "Full legal compliance documentation",
      "Professional unit clearing and cleaning",
      "Transparent accounting of all proceeds",
      "Ongoing partnership for regular unit processing",
      "Bulk pricing for facilities with multiple units",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(partnerData).map((type) => ({ type }));
}

interface PartnerTypePageProps {
  params: Promise<{ type: string }>;
}

export default async function PartnerTypePage({ params }: PartnerTypePageProps) {
  const { type } = await params;
  const data = partnerData[type];

  if (!data) {
    notFound();
  }

  const Icon = data.icon;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-ivory to-cream py-20 md:py-28">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={`w-16 h-16 rounded-2xl ${data.accentBg} flex items-center justify-center mx-auto mb-6`}
            >
              <Icon className={`h-8 w-8 ${data.accentText}`} />
            </div>
            <p
              className={`text-sm font-medium ${data.accentText} uppercase tracking-wide mb-3`}
            >
              Partner Program — {data.title}
            </p>
            <h1
              className="text-3xl md:text-5xl text-onyx mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              {data.headline}
            </h1>
            <p className="text-lg text-pewter leading-relaxed max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl text-onyx mb-12 text-center"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            How It Works for {data.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {data.howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div
                  className={`w-14 h-14 rounded-full ${data.accentButtonBg} text-white flex items-center justify-center text-xl font-semibold mx-auto mb-5 shadow-md`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.step}
                </div>
                <h3
                  className="text-lg text-onyx mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-pewter leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-24 bg-ivory">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-8 text-center"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Benefits for {data.title}
            </h2>
            <div className="space-y-3">
              {data.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className={`flex items-start gap-3 bg-white rounded-xl p-4 border border-border/60 border-l-[3px] ${data.accentBorder}`}
                >
                  <CheckCircle2
                    className={`h-5 w-5 ${data.accentText} shrink-0 mt-0.5`}
                  />
                  <span className="text-charcoal">{benefit}</span>
                </div>
              ))}
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
            Apply as a {data.title.replace(/s$/, "")} Partner
          </h2>
          <p className="text-pewter text-lg mb-8">
            Join our network and start earning referral fees while providing your
            clients with premium estate liquidation services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book">
              <button
                className={`inline-flex items-center gap-2 ${data.accentButtonBg} text-white px-8 py-3.5 rounded-lg text-base font-medium ${data.accentButtonHover} transition-colors shadow-md`}
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/partners">
              <button className="inline-flex items-center gap-2 border border-border text-charcoal px-8 py-3.5 rounded-lg text-base font-medium hover:bg-white transition-colors">
                View All Programs
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
