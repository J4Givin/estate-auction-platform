import Link from "next/link";
import {
  ArrowRight, ShieldCheck, BarChart3, Globe, Clock,
  Building2, Scale, Heart, Truck, Warehouse, Star,
  CheckCircle2, Award, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileNavToggle } from "@/components/layout/MobileNav";

const stats = [
  { value: "$4.2M+", label: "Client Proceeds" },
  { value: "2,500+", label: "Items Sold" },
  { value: "98%",    label: "Client Satisfaction" },
  { value: "48 hrs", label: "Avg. Time to Live" },
];

const steps = [
  {
    num: "01",
    title: "Schedule a Walkthrough",
    body: "We come to your property and photograph, catalog, and assess every item of value — typically in under two hours.",
    icon: Clock,
  },
  {
    num: "02",
    title: "Catalog, Authenticate & Price",
    body: "AI-assisted identification with human expert review. High-value pieces receive full provenance authentication and professional appraisal.",
    icon: ShieldCheck,
    highlight: true,
  },
  {
    num: "03",
    title: "Multi-Channel Liquidation",
    body: "Items list simultaneously across 6+ channels — online storefront, eBay, Facebook Marketplace, Etsy, and live auction.",
    icon: Globe,
  },
  {
    num: "04",
    title: "Direct Deposit to You",
    body: "Net proceeds deposited after each settlement period. Full itemized statements with every transaction visible.",
    icon: BarChart3,
  },
];

const partners = [
  {
    type: "realtor",
    title: "Realtors",
    tagline: "Sell the house faster, sell the contents too.",
    body: "We handle estate clearing so your listing is market-ready sooner. Co-branded materials available.",
    icon: Building2,
    color: "sapphire",
  },
  {
    type: "probate",
    title: "Estate Attorneys",
    tagline: "Court-ready documentation, start to finish.",
    body: "Full itemized appraisals, authenticated records, and final statements structured for probate proceedings.",
    icon: Scale,
    color: "amethyst",
  },
  {
    type: "senior",
    title: "Senior Transition Specialists",
    tagline: "Compassionate downsizing with maximum recovery.",
    body: "White-glove service for families navigating major life transitions. We handle logistics so you can focus on people.",
    icon: Heart,
    color: "emerald",
  },
  {
    type: "mover",
    title: "Moving Companies",
    tagline: "A natural complement to every move.",
    body: "Refer clients who need to liquidate before a move. Earn referral commissions on completed jobs.",
    icon: Truck,
    color: "gold",
  },
  {
    type: "storage",
    title: "Storage Facilities",
    tagline: "Turn abandoned units into referral revenue.",
    body: "Help tenants clear their units with professional liquidation — and earn a referral fee when they do.",
    icon: Warehouse,
    color: "ruby",
  },
];

const channels = ["Online Storefront", "eBay", "Facebook Marketplace", "Etsy", "OfferUp", "Live Auction"];

const colorMap: Record<string, { border: string; icon: string; bg: string }> = {
  sapphire: { border: "border-sapphire/20",  icon: "text-sapphire",  bg: "bg-sapphire-muted" },
  amethyst: { border: "border-amethyst/20",  icon: "text-amethyst",  bg: "bg-amethyst-muted" },
  emerald:  { border: "border-emerald-j/20", icon: "text-emerald-j", bg: "bg-emerald-j-muted" },
  gold:     { border: "border-gold-j/20",    icon: "text-gold-j",    bg: "bg-gold-j-muted" },
  ruby:     { border: "border-ruby/20",      icon: "text-ruby",      bg: "bg-ruby-muted" },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-sapphire" />
            <span
              className="text-xl font-semibold text-sapphire"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estate Liquidity
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-pewter">
            <Link href="/how-it-works" className="px-3 py-2 rounded-lg hover:bg-platinum/20 hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/partners" className="px-3 py-2 rounded-lg hover:bg-platinum/20 hover:text-foreground transition-colors">Partners</Link>
            <Link href="/auth/login" className="px-3 py-2 rounded-lg hover:bg-platinum/20 hover:text-foreground transition-colors">Sign In</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/book">
              <Button variant="primary" size="sm" className="hidden md:flex gap-1.5">
                Book Free Walkthrough <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            {/* Mobile hamburger */}
            <MobileNavToggle />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-sapphire pb-16 pt-20 md:pb-24 md:pt-28 min-h-[80svh] md:min-h-0 flex items-center">
        {/* Subtle texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px" }} />

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sapphire/80 to-transparent" />

        <div className="relative mx-auto max-w-3xl px-6 text-center w-full">
          <Badge variant="gold" className="mb-6 text-xs px-3">
            <Star className="h-3 w-3" /> Verified Authentication • Multi-Channel Liquidation
          </Badge>
          <h1
            className="text-hero font-light text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Estate Inventory,{" "}
            <span className="italic text-gold-j-mid">Authenticated</span>{" "}
            & Sold.
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/70 max-w-xl mx-auto">
            We catalog every item, authenticate what matters, price everything accurately, and sell across 6+ channels simultaneously — so your family receives the most.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto bg-gold-j-light text-white hover:bg-gold-j font-semibold gap-2 active:scale-[0.97]">
                Book a Free Walkthrough <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 active:scale-[0.97]">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10">
            {stats.map(s => (
              <div key={s.label} className="bg-sapphire-dim/60 backdrop-blur px-4 py-4 md:px-6 md:py-5 text-center">
                <p className="text-xl md:text-2xl font-semibold text-gold-j-mid tabular-nums">{s.value}</p>
                <p className="mt-1 text-[11px] md:text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-24 px-6 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-j mb-3">The Process</p>
            <h2 className="text-section-title font-light" style={{ fontFamily: "var(--font-display)" }}>
              From walkthrough to deposit — in days, not months.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(step => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`relative rounded-2xl p-6 border transition-shadow hover:shadow-md ${
                    step.highlight
                      ? "bg-sapphire text-white border-sapphire shadow-lg"
                      : "bg-white border-border"
                  }`}
                >
                  {step.highlight && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="gold" className="text-[10px]">Priority</Badge>
                    </div>
                  )}
                  <p className={`text-xs font-bold tracking-widest mb-4 ${step.highlight ? "text-white/50" : "text-muted-foreground"}`}>
                    {step.num}
                  </p>
                  <div className={`inline-flex rounded-xl p-2.5 mb-4 ${step.highlight ? "bg-white/10" : "bg-sapphire-muted"}`}>
                    <Icon className={`h-5 w-5 ${step.highlight ? "text-white" : "text-sapphire"}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 font-sans ${step.highlight ? "text-white" : ""}`}>{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${step.highlight ? "text-white/75" : "text-muted-foreground"}`}>{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Authentication highlight ── */}
      <section className="py-16 md:py-20 px-6 bg-amethyst-muted overflow-hidden">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <Badge variant="amethyst" className="mb-4">Authentication First</Badge>
              <h2 className="text-section-title font-light mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Every high-value piece verified before it sells.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our authentication workflow requires provenance documentation, maker-mark photography, and expert sign-off before any high-value item is published. Inconclusive pieces are flagged — never guessed.
              </p>
              <ul className="space-y-3">
                {[
                  "Provenance & ownership documentation",
                  "Maker marks, hallmarks & serial photography",
                  "Comparable sales from major auction houses",
                  "Expert human review on every high-value item",
                  "Immutable authentication record for buyers",
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-amethyst mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-amethyst/20 p-6 md:p-8 shadow-md w-full">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="rounded-xl bg-gold-j-muted p-3">
                  <Award className="h-6 w-6 text-gold-j" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">Authentication Certificate</p>
                  <p className="text-xs text-muted-foreground">Issued after expert review</p>
                </div>
                <Badge variant="gold" className="ml-auto shrink-0">Verified</Badge>
              </div>
              {["Provenance Documentation", "Maker Mark Photography", "Comparable Sales Research", "Expert Sign-Off"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <div className="h-5 w-5 rounded-full bg-emerald-j-muted flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-emerald-j" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                  <span className="ml-auto text-xs text-emerald-j font-medium shrink-0">Complete</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Channels ── */}
      <section className="py-16 md:py-20 px-6 overflow-hidden">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-j mb-3">Sales Channels</p>
          <h2 className="text-section-title font-light mb-8 md:mb-12" style={{ fontFamily: "var(--font-display)" }}>
            Maximum exposure across every marketplace.
          </h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {channels.map(c => (
              <span key={c} className="rounded-full border border-border bg-white px-4 py-2 md:px-5 md:py-2.5 text-sm font-medium text-foreground shadow-xs">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="py-16 md:py-24 px-6 bg-cream overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-j mb-3">Partner Program</p>
            <h2 className="text-section-title font-light" style={{ fontFamily: "var(--font-display)" }}>
              Built for the professionals who come first.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              We work alongside the people who are already in the room — realtors, attorneys, movers, senior advisors. Refer a client and earn.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map(p => {
              const Icon = p.icon;
              const c = colorMap[p.color];
              return (
                <Link
                  key={p.type}
                  href={`/partners/${p.type}`}
                  className={`group rounded-2xl bg-white border ${c.border} p-6 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5`}
                >
                  <div className={`inline-flex rounded-xl p-2.5 mb-4 ${c.bg}`}>
                    <Icon className={`h-5 w-5 ${c.icon}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{p.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-sapphire">
                    Learn more <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/partner/referrals/new">
              <Button variant="primary" size="lg" className="gap-2 active:scale-[0.97]">
                Become a Partner <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 px-6 bg-sapphire overflow-hidden">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-section-title sm:text-5xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to start?
          </h2>
          <p className="text-white/70 mb-8 text-base md:text-lg">
            Schedule a free on-site walkthrough. No commitment, no contract until you approve your job.
          </p>
          <Link href="/book">
            <Button size="xl" className="bg-gold-j-light text-white hover:bg-gold-j gap-2 font-semibold active:scale-[0.97]">
              Book a Free Walkthrough <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-onyx text-white/50 py-10 md:py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-j" />
              <span className="text-white/70 font-medium" style={{ fontFamily: "var(--font-display)" }}>
                Estate Liquidity
              </span>
            </div>
            <p className="text-center">Marina del Rey · Beverly Hills · West LA · Beach Cities</p>
            <div className="flex gap-4">
              <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link href="/book" className="hover:text-white transition-colors">Book</Link>
              <Link href="/partners" className="hover:text-white transition-colors">Partners</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
