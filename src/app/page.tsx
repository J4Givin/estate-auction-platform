import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Search,
  Megaphone,
  Building2,
  Scale,
  Heart,
  Truck,
  Warehouse,
  Star,
  ShieldCheck,
  Award,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Items Sold", value: "2,500+" },
  { label: "Recovered", value: "$4.2M" },
  { label: "Client Satisfaction", value: "98%" },
  { label: "Authentication", value: "5-Star" },
];

const steps = [
  {
    number: 1,
    title: "Schedule a Walkthrough",
    description:
      "We visit your property, photograph and catalog every item of value. Our team handles all the heavy lifting so you don't have to.",
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "We Catalog & Authenticate",
    description:
      "AI-assisted pricing with human expert verification. High-value items receive full provenance authentication and professional appraisal.",
    icon: Search,
  },
  {
    number: 3,
    title: "Multi-Channel Liquidation",
    description:
      "Items are listed across 6+ selling channels simultaneously for maximum recovery. Live auctions, online marketplaces, dealer networks, and more.",
    icon: Megaphone,
  },
];

const partnerTypes = [
  {
    title: "Realtors",
    description:
      "Accelerate property sales with professional estate clearing and staging support.",
    icon: Building2,
    accent: "sapphire",
    borderColor: "border-l-sapphire",
    iconColor: "text-sapphire",
    bgColor: "bg-sapphire-muted",
  },
  {
    title: "Estate Attorneys",
    description:
      "Streamlined estate liquidation with full documentation for probate proceedings.",
    icon: Scale,
    accent: "amethyst",
    borderColor: "border-l-amethyst",
    iconColor: "text-amethyst",
    bgColor: "bg-amethyst-muted",
  },
  {
    title: "Senior Transition Specialists",
    description:
      "Compassionate downsizing services with maximum recovery for your clients.",
    icon: Heart,
    accent: "emerald",
    borderColor: "border-l-emerald",
    iconColor: "text-emerald",
    bgColor: "bg-emerald-muted",
  },
  {
    title: "Moving Companies",
    description:
      "Reduce load volume and increase revenue through liquidation referrals.",
    icon: Truck,
    accent: "gold-tone",
    borderColor: "border-l-gold-tone",
    iconColor: "text-gold-tone",
    bgColor: "bg-gold-tone-muted",
  },
  {
    title: "Storage Facilities",
    description:
      "Convert abandoned and delinquent storage units into revenue efficiently.",
    icon: Warehouse,
    accent: "ruby",
    borderColor: "border-l-ruby",
    iconColor: "text-ruby",
    bgColor: "bg-ruby-muted",
  },
];

const trustSignals = [
  { icon: ShieldCheck, label: "Licensed & Bonded" },
  { icon: Award, label: "Certified Appraisers" },
  { icon: Users, label: "Family-Owned" },
  { icon: Star, label: "A+ BBB Rating" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
        <div className="container flex h-16 max-w-screen-xl mx-auto items-center px-4">
          <Link href="/" className="flex items-center gap-2 mr-8">
            <span
              className="text-2xl font-semibold text-sapphire"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estate Liquidity
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/how-it-works"
              className="text-pewter hover:text-sapphire transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/partners"
              className="text-pewter hover:text-sapphire transition-colors"
            >
              Partners
            </Link>
            <Link
              href="/book"
              className="text-pewter hover:text-sapphire transition-colors"
            >
              Book a Consultation
            </Link>
          </nav>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <button className="text-sm font-medium text-sapphire hover:text-sapphire-light transition-colors px-4 py-2">
                Sign In
              </button>
            </Link>
            <Link href="/book">
              <button className="text-sm font-medium bg-sapphire text-white px-5 py-2 rounded-lg hover:bg-sapphire-light transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-cream">
        <div className="container max-w-screen-xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl text-onyx mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Estate Inventory, Authenticated & Sold
            </h1>
            <p className="text-lg md:text-xl text-pewter max-w-2xl mx-auto mb-10 leading-relaxed">
              Professional estate liquidation powered by expert appraisals and
              multi-channel selling. We help families, attorneys, and fiduciaries
              recover maximum value from personal property.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book">
                <button className="inline-flex items-center gap-2 bg-sapphire text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-sapphire-light transition-colors shadow-md">
                  Book Your Free Consultation
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="inline-flex items-center gap-2 border border-sapphire text-sapphire px-8 py-3.5 rounded-lg text-base font-medium hover:bg-sapphire-muted transition-colors">
                  How It Works
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-sapphire py-8">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl md:text-3xl font-semibold text-white mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-ivory/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              How It Works
            </h2>
            <p className="text-pewter text-lg max-w-2xl mx-auto">
              A simple three-step process designed to maximize recovery while
              minimizing your effort.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-sapphire text-white flex items-center justify-center text-2xl font-semibold shadow-md"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <Icon className="h-8 w-8 text-sapphire mx-auto mb-4" />
                  <h3
                    className="text-xl mb-3 text-onyx"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-pewter leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 md:py-24 bg-ivory">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Who We Work With
            </h2>
            <p className="text-pewter text-lg max-w-2xl mx-auto">
              Trusted partnerships across the estate services industry. Refer
              your clients with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((partner) => {
              const Icon = partner.icon;
              return (
                <Link key={partner.title} href="/partners">
                  <div
                    className={cn(
                      "bg-white rounded-xl p-6 border border-border/60 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4",
                      partner.borderColor
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                        partner.bgColor
                      )}
                    >
                      <Icon className={cn("h-6 w-6", partner.iconColor)} />
                    </div>
                    <h3
                      className="text-lg mb-2 text-onyx"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      {partner.title}
                    </h3>
                    <p className="text-sm text-pewter leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/partners">
              <button className="inline-flex items-center gap-2 text-sapphire font-medium hover:text-sapphire-light transition-colors">
                View All Partner Programs
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl text-onyx mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Trusted by Families & Fiduciaries
            </h2>
            <p className="text-pewter text-lg max-w-2xl mx-auto">
              Families, executors, and professional fiduciaries across Los
              Angeles rely on us for sensitive estate liquidation.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.label}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-border/60"
                >
                  <div className="w-14 h-14 rounded-full bg-sapphire-muted flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-sapphire" />
                  </div>
                  <span className="text-sm font-medium text-onyx">
                    {signal.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24 bg-ivory">
        <div className="container max-w-screen-md mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl text-onyx mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Ready to Get Started?
          </h2>
          <p className="text-pewter text-lg mb-8 max-w-xl mx-auto">
            Schedule your free consultation today. Our team will walk through
            your property and provide a no-obligation recovery estimate.
          </p>
          <Link href="/book">
            <button className="inline-flex items-center gap-2 bg-gold-tone text-white px-8 py-3.5 rounded-lg text-base font-medium hover:bg-gold-tone-light transition-colors shadow-md">
              Book Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ivory border-t border-border/40 py-12">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <span
                className="text-xl font-semibold text-sapphire block mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Estate Liquidity
              </span>
              <p className="text-sm text-pewter leading-relaxed">
                Professional estate inventory, authentication, appraisal, and
                multi-channel liquidation services.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-onyx mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-pewter">
                <li>
                  <Link href="/how-it-works" className="hover:text-sapphire transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="hover:text-sapphire transition-colors">
                    Book a Consultation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-onyx mb-3">Partners</h4>
              <ul className="space-y-2 text-sm text-pewter">
                <li>
                  <Link href="/partners" className="hover:text-sapphire transition-colors">
                    Partner Programs
                  </Link>
                </li>
                <li>
                  <Link href="/partners/realtor" className="hover:text-sapphire transition-colors">
                    For Realtors
                  </Link>
                </li>
                <li>
                  <Link href="/partners/probate" className="hover:text-sapphire transition-colors">
                    For Attorneys
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-onyx mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-pewter">
                <li>
                  <Link href="/auth/login" className="hover:text-sapphire transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-sapphire transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-sapphire transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-pewter">
            <p>&copy; {new Date().getFullYear()} Estate Liquidity. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Los Angeles, California</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
