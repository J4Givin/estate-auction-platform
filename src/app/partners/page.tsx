import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Scale,
  Heart,
  Truck,
  Warehouse,
  DollarSign,
  Headphones,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const partnerTypes = [
  {
    slug: "realtor",
    title: "Realtors",
    description:
      "Accelerate property sales with professional estate clearing. We handle the contents so you can focus on the real estate transaction.",
    icon: Building2,
    accentBorder: "border-l-sapphire",
    accentBg: "bg-sapphire-muted",
    accentText: "text-sapphire",
  },
  {
    slug: "probate",
    title: "Probate Attorneys",
    description:
      "Streamlined estate liquidation for your clients. Full documentation, transparent accounting, and court-ready reporting.",
    icon: Scale,
    accentBorder: "border-l-amethyst",
    accentBg: "bg-amethyst-muted",
    accentText: "text-amethyst",
  },
  {
    slug: "senior",
    title: "Senior Transition Specialists",
    description:
      "Compassionate downsizing with maximum recovery. We treat every item with care and help families through difficult transitions.",
    icon: Heart,
    accentBorder: "border-l-emerald",
    accentBg: "bg-emerald-muted",
    accentText: "text-emerald",
  },
  {
    slug: "mover",
    title: "Moving Companies",
    description:
      "Reduce load, increase revenue with liquidation referrals. Turn pre-move decluttering into a new revenue stream for your business.",
    icon: Truck,
    accentBorder: "border-l-gold-tone",
    accentBg: "bg-gold-tone-muted",
    accentText: "text-gold-tone",
  },
  {
    slug: "storage",
    title: "Storage Facilities",
    description:
      "Convert abandoned storage into revenue. We liquidate delinquent unit contents legally and efficiently, recovering value for all parties.",
    icon: Warehouse,
    accentBorder: "border-l-ruby",
    accentBg: "bg-ruby-muted",
    accentText: "text-ruby",
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Referral Fees",
    description:
      "Earn competitive referral fees on every estate we service through your introduction. Transparent tracking and timely payments.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Your own partner success manager handles onboarding, client coordination, and ensures a seamless experience every time.",
  },
  {
    icon: FileText,
    title: "Co-Branded Materials",
    description:
      "Professional marketing collateral with your branding. Flyers, digital assets, and presentation decks — all customized for you.",
  },
];

export default function PartnersPage() {
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
              Partner With Estate Liquidity
            </h1>
            <p className="text-lg text-pewter leading-relaxed max-w-2xl mx-auto">
              Join our network of trusted professionals. Earn referral fees,
              access dedicated support, and provide your clients with
              best-in-class estate liquidation services.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Partner Programs
            </h2>
            <p className="text-pewter text-lg max-w-2xl mx-auto">
              Tailored programs for every type of estate services professional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((partner) => {
              const Icon = partner.icon;
              return (
                <Link
                  key={partner.slug}
                  href={`/partners/${partner.slug}`}
                >
                  <div
                    className={`bg-white rounded-xl p-6 border border-border/60 border-l-4 ${partner.accentBorder} hover:shadow-lg transition-all duration-200 cursor-pointer h-full`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${partner.accentBg} flex items-center justify-center mb-4`}
                    >
                      <Icon
                        className={`h-6 w-6 ${partner.accentText}`}
                      />
                    </div>
                    <h3
                      className="text-lg text-onyx mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      {partner.title}
                    </h3>
                    <p className="text-sm text-pewter leading-relaxed mb-4">
                      {partner.description}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${partner.accentText}`}
                    >
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-24 bg-ivory">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Partnership Benefits
            </h2>
            <p className="text-pewter text-lg max-w-2xl mx-auto">
              Every partner in our network receives these core benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-sapphire-muted flex items-center justify-center mx-auto mb-5">
                    <Icon className="h-7 w-7 text-sapphire" />
                  </div>
                  <h3
                    className="text-lg text-onyx mb-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-pewter leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Partners Choose Us */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-8 text-center"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Why Partners Choose Us
            </h2>
            <div className="space-y-4">
              {[
                "Transparent pricing with no hidden fees",
                "Real-time reporting dashboard for every referral",
                "Average recovery rate 30% higher than traditional estate sales",
                "Professional handling of sensitive family situations",
                "Full insurance and bonding for peace of mind",
                "Fast turnaround — most estates cleared within 4 weeks",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border/60"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                  <span className="text-charcoal">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-ivory">
        <div className="container max-w-screen-md mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl text-onyx mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Become a Partner
          </h2>
          <p className="text-pewter text-lg mb-8">
            Join our growing network of professionals who trust Estate Liquidity
            for their clients&apos; estate liquidation needs.
          </p>
          <Link href="/book">
            <button className="inline-flex items-center gap-2 bg-sapphire text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-sapphire-light transition-colors shadow-md">
              Become a Partner
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
