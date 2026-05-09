import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { Reveal } from '@/components/public/Reveal'

export const metadata: Metadata = {
  title: 'Estate Liquidation, Auction & Appraisal — Los Angeles',
  description:
    'Estate Liquidity is a modern estate liquidation and asset-disposition partner for families, executors, fiduciaries, and real estate professionals in Los Angeles. Inventory, appraisal, authentication, multi-channel sale, and itemized settlement.',
  alternates: { canonical: '/' },
}

const TRUST = [
  'Los Angeles-Based',
  'Transparent Settlements',
  'Itemized Reporting',
  'Appraisal-Led Pricing',
  'Multi-Channel Sale Strategy',
]

const PROBLEM_CARDS = [
  {
    pain: 'Too many items, no clear starting point.',
    solution: 'Structured inventory and photo documentation, item-by-item, with tracking IDs.',
  },
  {
    pain: 'Hard to know what is actually valuable.',
    solution: 'Appraisal-led pricing and authentication review for higher-value or sensitive categories.',
  },
  {
    pain: 'No transparency once items leave the home.',
    solution: 'A client portal showing inventory, approvals, listings, offers, and settlement.',
  },
]

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Free Estate Walkthrough',
    body: 'We assess the property, timeline, item categories, access needs, and the best disposition strategy.',
  },
  {
    n: '02',
    title: 'Inventory & Photo Documentation',
    body: 'Approved items receive photos, descriptions, condition notes, category tags, and tracking IDs.',
  },
  {
    n: '03',
    title: 'Appraisal-Led Pricing & Channel Strategy',
    body: 'We route each item to the best sale path: estate auction, marketplace, private buyer, specialty auction, buyout, donation, or clearout.',
  },
  {
    n: '04',
    title: 'Seller Approval & Reserve Settings',
    body: 'You review key items, suggested estimates, reserves, and sale strategy before publication.',
  },
  {
    n: '05',
    title: 'Sale Launch & Buyer Management',
    body: 'We handle listings, promotion, questions, payment, pickup, shipping coordination, and offer tracking.',
  },
  {
    n: '06',
    title: 'Settlement & Final Report',
    body: 'You receive an itemized settlement with sale prices, fees, net proceeds, payout status, and unsold disposition.',
  },
]

const SERVICES = [
  {
    slug: 'managed',
    name: 'Managed Estate Auction',
    bestFor: 'Full homes, probate, downsizing, move deadlines.',
    included: 'Inventory, photography, appraisal review, auction listing, buyer management, settlement.',
    color: '#826DEE',
  },
  {
    slug: 'placement',
    name: 'Selective High-Value Placement',
    bestFor: 'Jewelry, watches, art, antiques, designer goods, rare collectibles.',
    included: 'Specialist review, authentication coordination, channel selection, reserve strategy.',
    color: '#FFDB15',
  },
  {
    slug: 'buyout',
    name: 'Estate Buyout Option',
    bestFor: 'Speed, privacy, certainty, simplified disposition.',
    included: 'Walkthrough offer, contract, pickup, and final settlement after review.',
    color: '#F94500',
  },
  {
    slug: 'hybrid',
    name: 'Hybrid Liquidation Plan',
    bestFor: 'Mixed estates needing specialist placement plus local sale or clearout.',
    included: 'Combined channel strategy, segmented reporting, coordinated cleanout.',
    color: '#FF99DC',
  },
  {
    slug: 'cleanout',
    name: 'Cleanout & Disposition Coordination',
    bestFor: 'Donation, disposal, haul-away, property-ready turnover.',
    included: 'Crew coordination, donation receipts, disposal logs, broom-clean handoff.',
    color: '#0A0A0A',
  },
  {
    slug: 'partners',
    name: 'Partner Referral Program',
    bestFor: 'Realtors, attorneys, fiduciaries, senior move managers, organizers, property pros.',
    included: 'Fast intake, transparent process, referral tracking, estate-ready documentation.',
    color: '#826DEE',
  },
]

const SCENARIOS = [
  {
    item: 'Signed Fine Art Print',
    estimate: '$800 – $1,200',
    channel: 'Specialist auction',
    outcome: '$1,475',
    note: 'Signature and edition review recommended.',
    accent: '#826DEE',
  },
  {
    item: 'Vintage Gold Watch',
    estimate: '$1,200 – $1,800',
    channel: 'Private buyer network',
    outcome: '$2,050',
    note: 'Serial and reference verification required.',
    accent: '#FFDB15',
  },
  {
    item: 'Mid-Century Dining Set',
    estimate: '$600 – $900',
    channel: 'Local estate auction',
    outcome: '$825',
    note: 'Maker and condition review.',
    accent: '#F94500',
  },
  {
    item: 'Sterling Silver Service',
    estimate: '$900 – $1,400',
    channel: 'Multi-channel auction',
    outcome: '$1,320',
    note: 'Hallmark and weight documentation.',
    accent: '#FF99DC',
  },
]

const AUTH_CATEGORIES = [
  { name: 'Jewelry', notes: 'Metal testing, gemstone screening, hallmark review, lab referral.' },
  { name: 'Watches', notes: 'Serial/reference, movement photos, service history, condition.' },
  { name: 'Art', notes: 'Attribution, medium, edition, provenance, condition, framing.' },
  { name: 'Antiques', notes: 'Period, construction, maker marks, comps, restoration notes.' },
  { name: 'Designer Goods', notes: 'Serial codes, stitching/materials, authentication partner.' },
  { name: 'Furniture', notes: 'Maker, age, construction, restoration, market demand.' },
]

const PORTAL_PREVIEW = [
  { label: 'Inventoried items', value: '128' },
  { label: 'Pending approval', value: '14' },
  { label: 'Active listings', value: '47' },
  { label: 'Sold items', value: '63' },
  { label: 'Estimated gross', value: '$58.4k' },
  { label: 'Confirmed proceeds', value: '$36.2k' },
]

const FAQ_PREVIEW = [
  {
    q: 'Do you come to the property?',
    a: 'Yes. We begin with a free estate walkthrough to assess the property, timeline, item categories, and access needs before recommending a path.',
  },
  {
    q: 'Do all items receive a formal appraisal?',
    a: 'No. General household items often receive a market-based estimate. Higher-value or legally sensitive items may require specialist review or a formal appraisal report.',
  },
  {
    q: 'What happens if an item does not sell?',
    a: 'Unsold items are reviewed for re-list at a revised reserve, alternative channels, donation with receipt, or coordinated disposal — always with your approval.',
  },
  {
    q: 'When do I get paid?',
    a: 'You receive an itemized settlement statement after sale completion, buyer payment, and pickup or shipping confirmation. We document each step.',
  },
]

export default function HomePage() {
  return (
    <PublicShell>
      {/* ── HERO ── */}
      <section className="relative bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-16 md:pt-24 lg:pt-28 pb-20 md:pb-28">
          <div className="flex items-center gap-3 mb-10 md:mb-14">
            <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE]" aria-hidden />
            <span className="label text-[#6B6B6B]">Los Angeles, California — Estate Advisory & Asset Disposition</span>
          </div>

          <h1
            className="text-[#0A0A0A] max-w-[18ch]"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 7.5vw, 6.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            Estate Inventory,<br />
            Appraised, <span className="text-[#826DEE]">Authenticated</span>,<br />
            And Sold With Care.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mt-10 md:mt-14">
            <p className="md:col-span-6 lg:col-span-5 text-[17px] md:text-[19px] text-[#3a3a3a] leading-relaxed"
               style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
              We inventory, appraise, authenticate, photograph, list, sell, and settle estate assets through the right channels — helping families, executors, trustees, and real estate professionals maximize value while reducing stress.
            </p>
            <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-4 md:items-end md:justify-end">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/request-walkthrough" className="btn btn-ink">
                  Book a Free Estate Evaluation →
                </Link>
                <Link href="/how-it-works" className="btn btn-outline">
                  See How It Works
                </Link>
              </div>
              <span className="label text-[#6B6B6B]">No obligation. Itemized reporting from intake to payout.</span>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-[#E0E0E0]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            {TRUST.map((t, i) => (
              <span key={t} className="label text-[#6B6B6B] flex items-center gap-3">
                {t}
                {i < TRUST.length - 1 && <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#BDBDBD]" aria-hidden />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / EMOTIONAL CONTEXT ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <span className="label block mb-6">Why Estate Liquidity</span>
            <h2 className="display-lg max-w-[20ch]">Estate sales are rarely just about selling things.</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-8 max-w-3xl text-[17px] md:text-[19px] text-[#3a3a3a] leading-relaxed"
               style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
              They are about time, family pressure, legal responsibility, memories, uncertainty, and the fear of leaving money on the table. We bring structure to the process — documenting each item, identifying what deserves specialist attention, choosing the right sales channels, and giving you a clear record from intake to final payout.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-16 md:mt-24 border-t border-[#E0E0E0]">
            {PROBLEM_CARDS.map((c, i) => (
              <Reveal key={c.pain} delay={i * 80}>
                <div className="px-0 md:px-8 py-10 md:py-12 border-b md:border-b-0 md:border-r border-[#E0E0E0] last:border-r-0">
                  <p className="text-[20px] md:text-[22px] text-[#0A0A0A] leading-snug mb-4"
                     style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {c.pain}
                  </p>
                  <p className="body-light leading-relaxed">{c.solution}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS — six steps ── */}
      <section id="process" className="py-24 md:py-32 lg:py-40 bg-[#F5F5F5]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
              <div>
                <span className="label block mb-5">The Process</span>
                <h2 className="display-lg">From Walkthrough<br />to Settlement.</h2>
              </div>
              <p className="body-light max-w-sm md:pb-2">
                Six clear steps. You see every item, every approval, every sale price, and every payout — documented from intake to final report.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-[#E0E0E0]">
            {PROCESS_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={(i % 3) * 80}>
                <div className="px-0 md:px-8 py-10 md:py-14 border-b border-[#E0E0E0] md:border-r last:border-r-0">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#826DEE] block mb-5">
                    Step {s.n}
                  </span>
                  <h3 className="text-[24px] md:text-[28px] leading-tight mb-4"
                      style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {s.title}
                  </h3>
                  <p className="body-light leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
              <div>
                <span className="label block mb-5">Services</span>
                <h2 className="display-lg">Right Path<br />For Each Estate.</h2>
              </div>
              <p className="body-light max-w-sm md:pb-2">
                Different estates need different paths. We start with a walkthrough and recommend the strategy that fits the property, timeline, and item categories.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-[#E0E0E0]">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.slug} delay={(i % 3) * 60}>
                <div className="border-b border-[#E0E0E0] md:border-r last:border-r-0 px-0 md:px-8 py-10 md:py-12 h-full flex flex-col">
                  <span className="block w-7 h-1 mb-6" style={{ background: svc.color }} aria-hidden />
                  <h3 className="text-[22px] md:text-[24px] mb-4 leading-snug"
                      style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {svc.name}
                  </h3>
                  <p className="label text-[#6B6B6B] mb-2">Best for</p>
                  <p className="body-light mb-5">{svc.bestFor}</p>
                  <p className="label text-[#6B6B6B] mb-2">Included</p>
                  <p className="body-light mb-7">{svc.included}</p>
                  <div className="mt-auto pt-2">
                    <Link href={`/services#${svc.slug}`} className="label text-[#0A0A0A] hover:text-[#826DEE]">
                      Learn more →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLE SALE SCENARIOS ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-white border-t border-[#E0E0E0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
              <div>
                <span className="label block mb-5">Example Sale Scenarios</span>
                <h2 className="display-lg">What Different<br />Items Look Like.</h2>
              </div>
              <p className="body-light max-w-sm md:pb-2">
                Examples shown for illustrative purposes. Actual results depend on condition, provenance, market demand, and sale channel.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-[#E0E0E0]">
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.item} delay={(i % 2) * 80}>
                <div className="px-0 md:px-8 py-10 md:py-12 border-b border-[#E0E0E0] md:border-r md:[&:nth-child(even)]:border-r-0">
                  <span className="block w-6 h-0.5 mb-5" style={{ background: s.accent }} aria-hidden />
                  <h3 className="text-[24px] md:text-[28px] mb-4 leading-tight"
                      style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {s.item}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5">
                    <span className="label text-[#6B6B6B]">Estimate</span>
                    <span className="body-light text-[#0A0A0A]">{s.estimate}</span>
                    <span className="label text-[#6B6B6B]">Channel</span>
                    <span className="body-light text-[#0A0A0A]">{s.channel}</span>
                    <span className="label text-[#6B6B6B]">Outcome</span>
                    <span className="body-light text-[#0A0A0A] price font-medium">{s.outcome}</span>
                  </div>
                  <p className="body-light text-[#6B6B6B]">{s.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 label text-[#6B6B6B] max-w-2xl">
            We do not guarantee a specific outcome. Estimates are not appraisals. Authentication is performed when a category warrants it, and high-risk items may be held from sale until review is complete.
          </p>
        </div>
      </section>

      {/* ── AUTHENTICATION & APPRAISAL ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-[#0A0A0A] text-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <span className="label-dark block mb-5">Authentication & Appraisal</span>
            <h2 className="display-lg text-white max-w-[18ch]">
              We tell you what we <span className="text-[#FFDB15]">know</span>, what needs review, and what cannot be confirmed.
            </h2>
            <p className="body-light text-white/70 mt-8 max-w-3xl leading-relaxed">
              Not every item requires a formal appraisal. General household items may receive market-based estimates. Higher-value or legally sensitive items may require specialist review, third-party authentication, or a formal appraisal report depending on purpose, category, and risk.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-white/10 mt-16 md:mt-20">
            {AUTH_CATEGORIES.map((c, i) => (
              <Reveal key={c.name} delay={(i % 3) * 60}>
                <div className="border-b border-white/10 md:border-r md:[&:nth-child(3n)]:border-r-0 px-0 md:px-8 py-10">
                  <h3 className="text-[20px] md:text-[22px] mb-3 text-white"
                      style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {c.name}
                  </h3>
                  <p className="body-light text-white/70">{c.notes}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <p className="label-dark leading-relaxed text-white/60">
                We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed.
              </p>
              <p className="label-dark leading-relaxed text-white/60">
                High-risk or high-value items may be held from sale until review is complete.
              </p>
            </div>
            <div className="mt-10">
              <Link href="/authentication" className="btn btn-outline-white">
                Learn About Our Authentication Approach →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHY OUR MODEL ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <span className="label block mb-5">Why Our Model</span>
            <h2 className="display-lg max-w-[20ch]">Better outcomes come from better routing.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-[#E0E0E0] mt-12 md:mt-16">
            {[
              {
                t: 'One channel rarely fits an entire estate.',
                b: 'A single estate sale or one auction house often misses optimal pricing. We split the estate across the channels that fit each item.',
              },
              {
                t: 'Specialist categories deserve specialist review.',
                b: 'Jewelry, watches, art, and certain antiques benefit from category-specific authentication and placement, not generic listings.',
              },
              {
                t: 'Approval before publication.',
                b: 'You see suggested estimates, reserves, and channels before items go live. No surprises.',
              },
              {
                t: 'Transparent settlement.',
                b: 'Every item is tracked from intake to payout. You receive an itemized report, not a lump sum.',
              },
            ].map((x, i) => (
              <Reveal key={x.t} delay={(i % 2) * 80}>
                <div className="px-0 md:px-8 py-10 md:py-12 border-b border-[#E0E0E0] md:border-r md:[&:nth-child(even)]:border-r-0">
                  <p className="text-[22px] md:text-[24px] leading-snug mb-3"
                     style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {x.t}
                  </p>
                  <p className="body-light leading-relaxed">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT PORTAL PREVIEW ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-[#F5F5F5]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
              <div>
                <span className="label block mb-5">Client Portal</span>
                <h2 className="display-lg">You will never wonder<br />what happened to an item.</h2>
              </div>
              <p className="body-light max-w-sm md:pb-2">
                Inventory, approvals, listings, offers, sale prices, fees, and net proceeds — visible at every step. Sample preview shown below.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-white border border-[#E0E0E0] relative">
              <div className="absolute top-3 right-3 z-10">
                <span className="label bg-[#FFDB15] text-[#0A0A0A] px-3 py-1.5 font-bold">
                  Sample Preview
                </span>
              </div>

              <div className="p-6 md:p-10 border-b border-[#E0E0E0]">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
                  <span className="label text-[#6B6B6B]">Estate Overview · Sample data</span>
                  <span className="label text-[#6B6B6B]">Updated moments ago</span>
                </div>
                <h3 className="text-[28px] md:text-[36px] mt-1"
                    style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                  Anonymized Estate
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
                {PORTAL_PREVIEW.map((m, i) => (
                  <div key={m.label}
                       className={`px-6 md:px-8 py-8 md:py-10 ${i < 5 ? 'border-r border-[#E0E0E0]' : ''} ${i < 4 ? 'lg:border-r' : ''} ${i % 2 === 0 ? 'border-r-0 md:border-r' : ''} ${i < 2 ? 'border-b md:border-b' : ''} ${i < 4 ? 'border-b lg:border-b-0' : ''}`}>
                    <span className="label text-[#6B6B6B] block mb-3">{m.label}</span>
                    <span className="text-[24px] md:text-[28px] price"
                          style={{ fontFamily: 'var(--font-display-family)', fontWeight: 800 }}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 md:px-10 py-6 border-t border-[#E0E0E0] flex flex-wrap items-center justify-between gap-4">
                <span className="label text-[#6B6B6B]">
                  Sample data only — does not reflect any real client estate.
                </span>
                <Link href="/portal" className="label text-[#0A0A0A] hover:text-[#826DEE]">
                  Open client portal preview →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PARTNER REFERRAL ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <Reveal className="md:col-span-6">
              <span className="label block mb-5">Partner Program</span>
              <h2 className="display-lg max-w-[16ch]">Help clients clear estates faster.</h2>
              <p className="body-light mt-6 max-w-md leading-relaxed">
                Our partner program gives realtors, attorneys, fiduciaries, and estate professionals a reliable liquidation resource for clients who need inventory, valuation, sale coordination, and final settlement reporting.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/partners" className="btn btn-ink">Refer an Estate →</Link>
                <Link href="/partners#program" className="btn btn-outline">Become a Partner</Link>
              </div>
            </Reveal>
            <Reveal className="md:col-span-6" delay={120}>
              <div className="border-t border-[#E0E0E0]">
                {[
                  ['Realtors & property managers', 'Faster client closings, less staging stress.'],
                  ['Probate & trust attorneys', 'Court-ready inventory and itemized reports.'],
                  ['Fiduciaries & trustees', 'Transparent disposition with seller approvals.'],
                  ['Senior move managers & organizers', 'Coordinated cleanout and donation receipts.'],
                ].map(([t, b]) => (
                  <div key={t} className="border-b border-[#E0E0E0] py-6 flex items-start gap-6">
                    <span className="w-2 h-2 rounded-full bg-[#826DEE] mt-2 flex-shrink-0" aria-hidden />
                    <div>
                      <p className="text-[18px] mb-1" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{t}</p>
                      <p className="body-light">{b}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-[#F5F5F5]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <span className="label block mb-5">Pricing & Fees</span>
            <h2 className="display-lg max-w-[20ch]">Transparent fees. No mystery after the sale.</h2>
            <p className="body-light mt-8 max-w-3xl leading-relaxed">
              Every estate is different. Fees depend on scope, timeline, item categories, labor requirements, sale channels, and whether specialist authentication, transport, storage, or cleanout coordination is needed. Before work begins, we explain the recommended strategy, expected costs, commission structure, and settlement timeline.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mt-14 border-t border-[#E0E0E0]">
            {[
              { t: 'Seller Commission', b: 'Applied to sold items. Varies by service type and estate scope.' },
              { t: 'Buyer Premium', b: 'May apply to auction purchases and is disclosed to buyers before bidding.' },
              { t: 'Optional Formal Appraisal', b: 'Used when a formal report is needed for estate, insurance, tax, legal, or high-value purposes.' },
              { t: 'Optional Transport / Storage / Cleanout', b: 'Quoted separately when required.' },
              { t: 'Specialist Authentication', b: 'When a category warrants third-party authentication, fees are disclosed in advance.' },
              { t: 'Settlement Timing', b: 'Itemized settlement statements after sale completion, buyer payment, and pickup or shipping confirmation.' },
            ].map((x, i) => (
              <Reveal key={x.t} delay={(i % 3) * 60}>
                <div className="px-0 md:px-8 py-10 md:py-12 border-b border-[#E0E0E0] md:border-r md:[&:nth-child(3n)]:border-r-0">
                  <h3 className="text-[20px] md:text-[22px] mb-4 leading-snug"
                      style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {x.t}
                  </h3>
                  <p className="body-light leading-relaxed">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link href="/pricing" className="btn btn-ink">Request a Fee Review →</Link>
              <Link href="/legal/fee-disclosure" className="label text-[#6B6B6B] hover:text-[#0A0A0A]">
                Read the full fee disclosure →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ PREVIEW ── */}
      <section className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
              <div>
                <span className="label block mb-5">Common Questions</span>
                <h2 className="display-lg max-w-[16ch]">Clear answers, before you call.</h2>
              </div>
              <Link href="/faq" className="label text-[#0A0A0A] hover:text-[#826DEE]">
                See all 20 answers →
              </Link>
            </div>
          </Reveal>

          <div className="border-t border-[#E0E0E0]">
            {FAQ_PREVIEW.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div className="border-b border-[#E0E0E0] py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10">
                  <p className="md:col-span-5 text-[20px] md:text-[22px] leading-snug"
                     style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                    {f.q}
                  </p>
                  <p className="md:col-span-7 body-light leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#826DEE]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32 lg:py-40 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-end">
          <div className="md:col-span-7">
            <h2 className="display-lg text-white max-w-[18ch]">
              Ready for a calm, organized estate process?
            </h2>
          </div>
          <div className="md:col-span-5 flex flex-col gap-5">
            <p className="text-white/85 text-[17px] md:text-[19px] leading-relaxed"
               style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
              Tell us about the estate. We will review the situation, recommend the best disposition path, and follow up with clear next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/request-walkthrough" className="btn btn-yellow">
                Book a Free Estate Evaluation →
              </Link>
              <Link href="/contact" className="btn btn-outline-white">
                Request Private Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
