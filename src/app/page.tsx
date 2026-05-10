import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { Reveal } from '@/components/public/Reveal'

export const metadata: Metadata = {
  title: 'Estate Liquidation, Auction & Appraisal — Los Angeles',
  description:
    'Estate Liquidity is a private estate-advisory and asset-disposition partner for families, executors, fiduciaries, and real estate professionals in Los Angeles. Inventory, appraisal, authentication, multi-channel sale, and itemized settlement.',
  alternates: { canonical: '/' },
}

const TRUST = [
  'Los Angeles based',
  'Itemized settlements',
  'Appraisal-led pricing',
  'Discreet & private',
  'Documented at every step',
]

const REASSURANCE = [
  {
    eyebrow: 'We know this is stressful.',
    body: 'Estates often arrive under pressure — a deadline, a court process, a parent gone, a property to clear. We move at the pace the situation requires, not faster.',
  },
  {
    eyebrow: 'You stay in control.',
    body: 'You see every item, every estimate, every approval, and every settlement line. Nothing leaves the home or goes to market without your sign-off.',
  },
  {
    eyebrow: 'We document everything.',
    body: 'Photographs, condition notes, provenance signals, channel decisions, and payouts — recorded item by item so the file is defensible to court, family, and counsel.',
  },
]

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Private estate walkthrough',
    body: 'We visit the property, listen to the situation, and assess timeline, item categories, access, and the right disposition strategy.',
  },
  {
    n: '02',
    title: 'Inventory & photographic record',
    body: 'Approved items receive photographs, condition notes, category tags, provenance signals, and tracking IDs.',
  },
  {
    n: '03',
    title: 'Appraisal-led pricing & channel routing',
    body: 'Each item is routed item-by-item to the right path: estate auction, specialist auction, private buyer, marketplace, buyout, donation, or coordinated cleanout.',
  },
  {
    n: '04',
    title: 'Approval before publication',
    body: 'You review estimates, reserves, and channel choice before anything is listed. Reserves are yours to set.',
  },
  {
    n: '05',
    title: 'Sale, buyer management & pickup',
    body: 'We handle listings, questions, buyer payment, pickup, shipping coordination, and offer review on private placements.',
  },
  {
    n: '06',
    title: 'Itemized settlement',
    body: 'You receive an itemized statement: every sale price, every fee, net proceeds, payout status, and unsold disposition.',
  },
]

const SERVICES = [
  {
    slug: 'managed',
    name: 'Managed estate auction',
    bestFor: 'Full homes, probate, downsizing, move deadlines.',
    included: 'Inventory, photography, appraisal review, auction listing, buyer management, settlement.',
  },
  {
    slug: 'placement',
    name: 'High-value placement',
    bestFor: 'Jewelry, watches, art, antiques, designer goods, rare collectibles.',
    included: 'Specialist review, authentication coordination, channel selection, reserve strategy.',
  },
  {
    slug: 'buyout',
    name: 'Estate buyout option',
    bestFor: 'Speed, privacy, certainty, simplified disposition.',
    included: 'Walkthrough offer, contract, pickup, and final settlement after review.',
  },
  {
    slug: 'hybrid',
    name: 'Hybrid liquidation plan',
    bestFor: 'Mixed estates needing specialist placement plus local sale or clearout.',
    included: 'Combined channel strategy, segmented reporting, coordinated cleanout.',
  },
  {
    slug: 'cleanout',
    name: 'Cleanout & disposition coordination',
    bestFor: 'Donation, disposal, haul-away, property-ready turnover.',
    included: 'Crew coordination, donation receipts, disposal logs, broom-clean handoff.',
  },
  {
    slug: 'partners',
    name: 'Partner referral program',
    bestFor: 'Realtors, attorneys, fiduciaries, senior move managers, organizers, property pros.',
    included: 'Fast intake, transparent process, referral tracking, estate-ready documentation.',
  },
]

const SCENARIOS = [
  {
    item: 'Signed fine art print',
    estimate: '$800 – $1,200',
    channel: 'Specialist auction',
    outcome: '$1,475',
    note: 'Edition and signature confirmed before listing.',
  },
  {
    item: 'Vintage gold watch',
    estimate: '$1,200 – $1,800',
    channel: 'Private buyer network',
    outcome: '$2,050',
    note: 'Reference and serial verified; movement photographed.',
  },
  {
    item: 'Mid-century dining set',
    estimate: '$600 – $900',
    channel: 'Local estate auction',
    outcome: '$825',
    note: 'Maker and condition documented.',
  },
  {
    item: 'Sterling silver service',
    estimate: '$900 – $1,400',
    channel: 'Multi-channel auction',
    outcome: '$1,320',
    note: 'Hallmark and weight noted in catalog.',
  },
]

const AUTH_CATEGORIES = [
  { name: 'Jewelry', notes: 'Metal testing, gemstone screening, hallmark review, lab referral.' },
  { name: 'Watches', notes: 'Serial / reference, movement photography, service history, condition.' },
  { name: 'Art', notes: 'Attribution, medium, edition, provenance, condition, framing.' },
  { name: 'Antiques', notes: 'Period, construction, maker marks, comparables, restoration notes.' },
  { name: 'Designer goods', notes: 'Serial codes, stitching and materials, authentication partner.' },
  { name: 'Furniture', notes: 'Maker, age, construction, restoration, market demand.' },
]

const PORTAL_PREVIEW = [
  { label: 'Items inventoried', value: '128' },
  { label: 'Awaiting your review', value: '14' },
  { label: 'Active listings', value: '47' },
  { label: 'Sold items', value: '63' },
  { label: 'Estimated gross', value: '$58,400' },
  { label: 'Confirmed settlement', value: '$36,200' },
]

const FAQ_PREVIEW = [
  {
    q: 'Do you come to the property?',
    a: 'Yes. We begin with a private estate walkthrough at no cost. We assess the property, timeline, item categories, and access needs before recommending a path.',
  },
  {
    q: 'Do all items receive a formal appraisal?',
    a: 'No. General household items typically receive a market-based estimate. Higher-value or legally sensitive items may require specialist review or a formal appraisal report — we recommend item by item.',
  },
  {
    q: 'What happens if an item does not sell?',
    a: 'Unsold items are reviewed for relisting at a revised reserve, an alternative channel, donation with receipt, or coordinated disposal — always with your approval.',
  },
  {
    q: 'When do I get paid?',
    a: 'You receive an itemized settlement statement after sale completion, buyer payment, and pickup or shipping confirmation. Each step is documented in the portal.',
  },
]

export default function HomePage() {
  return (
    <PublicShell>
      {/* ─────────────────────────────────────────────────────────────────
          HERO — calm, editorial, advisory.
          Serif H1 in title case. Warm parchment. Brass keyline detail.
          Estate-document panel replaces tech card.
          ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#FBF8F1' }}>
        <div
          className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pb-16 md:pb-28"
          style={{ paddingTop: 'clamp(2.5rem, 6vw, 6rem)' }}
        >
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <span className="brass-rule" aria-hidden />
            <span className="label">Estate Advisory · Los Angeles</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <h1 className="display-xl hero-h1 max-w-[22ch]">
                A quiet, careful path for the things a family must let go of.
              </h1>

              <p className="mt-7 sm:mt-9 max-w-[58ch] lede">
                Estate Liquidity is a private estate-advisory and asset-disposition firm. We inventory, appraise, authenticate, photograph, list, sell, and settle estate assets — item by item, through the right channels — for families, executors, trustees, fiduciaries, and real estate professionals.
              </p>

              <div className="mt-8 sm:mt-10 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link href="/request-walkthrough" className="btn btn-primary btn-mobile-primary justify-center">
                    Request a private estate review
                  </Link>
                  <Link href="/how-it-works" className="btn btn-outline btn-mobile-secondary justify-center">
                    See how it works
                  </Link>
                </div>
                <span className="label">No obligation. Itemized reporting from intake to payout.</span>
              </div>
            </div>

            {/* Editorial documentation desk — premium CSS-rendered visual.
                Communicates inventory + appraisal as a catalog sheet.
                Marked discreetly as a sample preview. */}
            <aside className="hidden lg:block lg:col-span-5 mt-2" aria-label="Sample estate documentation">
              <div className="doc-desk">
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div className="flex flex-col">
                    <span className="label">Estate File · Anonymized</span>
                    <span style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 18, color: '#1E1B17',
                      letterSpacing: '-0.01em', marginTop: 2,
                    }}>
                      Catalog sheet, lot 042
                    </span>
                  </div>
                  <span className="sample-tag">Sample preview</span>
                </div>

                <div className="px-6 pb-3">
                  {[
                    { k: 'Lot', v: '042 · Vintage gold watch', e: 'Est. $1,200 – $1,800' },
                    { k: 'Lot', v: '041 · Signed fine-art print', e: 'Est. $800 – $1,200' },
                    { k: 'Lot', v: '038 · Mid-century dining set', e: 'Est. $600 – $900' },
                    { k: 'Lot', v: '034 · Sterling silver service · 47 pcs', e: 'Est. $900 – $1,400' },
                  ].map(row => (
                    <div key={row.v} className="spec-row">
                      <span className="k">{row.k}</span>
                      <span className="v">{row.v}</span>
                      <span className="e">{row.e}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3" style={{ borderTop: '1px solid #E5DECF', background: '#FBF8F1' }}>
                  {[
                    { l: 'Items', v: '128' },
                    { l: 'Approved', v: '94' },
                    { l: 'Est. gross', v: '$58.4k' },
                  ].map((m, i) => (
                    <div
                      key={m.l}
                      className="px-6 py-4"
                      style={{ borderRight: i < 2 ? '1px solid #EBE6D8' : 'none' }}
                    >
                      <span className="label" style={{ color: '#706A60' }}>{m.l}</span>
                      <div
                        style={{
                          fontFamily: 'var(--font-body-family)',
                          fontWeight: 500, fontSize: 19, color: '#1E1B17',
                          letterSpacing: '-0.005em',
                          fontVariantNumeric: 'tabular-nums lining-nums',
                          marginTop: 4,
                        }}
                      >{m.v}</div>
                    </div>
                  ))}
                </div>

                <div
                  className="px-6 py-3 flex items-center justify-between"
                  style={{ borderTop: '1px solid #E5DECF', background: '#FBF8F1' }}
                >
                  <span className="label" style={{ fontSize: 10 }}>Anonymized · sample data only</span>
                  <span style={{
                    fontFamily: 'var(--font-display-family)', fontStyle: 'italic',
                    fontSize: 13, color: '#9A7A3C',
                  }}>
                    Documented item by item.
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Trust strip — chips on mobile, inline on desktop. Calm, ivory. */}
        <div style={{ borderTop: '1px solid #E5DECF', background: '#F6F1E8' }}>
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-5 sm:py-6">
            <ul className="flex flex-wrap gap-2 sm:hidden" aria-label="Why families work with Estate Liquidity">
              {TRUST.map((t) => (
                <li key={t}>
                  <span className="trust-chip">
                    <span className="trust-chip-dot" aria-hidden />
                    {t}
                  </span>
                </li>
              ))}
            </ul>
            <div className="hidden sm:flex flex-wrap items-center gap-x-10 gap-y-3">
              {TRUST.map((t, i) => (
                <span key={t} className="label flex items-center gap-3">
                  {t}
                  {i < TRUST.length - 1 && <span className="hidden sm:inline w-1 h-1 rounded-full" style={{ background: '#C9C0AC' }} aria-hidden />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          REASSURANCE — emotional narrative.
          Three calm columns: stress, control, documentation.
          Replaces the prior "PROBLEM_CARDS" layout.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-5">Why families call us</span>
            <h2 className="heading-advisory max-w-[24ch]">
              Estate sales are rarely just about{' '}
              <span className="serif-italic" style={{ color: '#9A7A3C' }}>selling things</span>.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-7 max-w-[64ch] body-warm leading-relaxed">
              They are about time, family, legal responsibility, memory, and the fear of leaving money — or meaning — on the table. We bring quiet structure to the process: documenting each item, identifying what deserves specialist attention, choosing the right path, and giving you a clear record from the first walkthrough to the final payout.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 md:mt-20">
            {REASSURANCE.map((c, i) => (
              <Reveal key={c.eyebrow} delay={i * 80}>
                <div className="card-advisory h-full">
                  <span className="brass-rule mb-5 block" aria-hidden />
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 22, lineHeight: 1.2,
                      letterSpacing: '-0.01em', color: '#1E1B17',
                      marginBottom: 12,
                    }}
                  >
                    {c.eyebrow}
                  </h3>
                  <p className="body-light leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          PROCESS — six advisory steps.
          Editorial numbered list, generous spacing, no condensed display.
          ───────────────────────────────────────────────────────────────── */}
      <section id="process" className="py-24 md:py-32" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-20 items-end">
              <div className="md:col-span-7">
                <span className="brass-rule mb-5 block" aria-hidden />
                <span className="label block mb-4">The process</span>
                <h2 className="heading-advisory max-w-[18ch]">
                  From walkthrough to settlement, item by item.
                </h2>
              </div>
              <p className="md:col-span-5 body-light max-w-md md:pb-2">
                Six clear steps. You see every item, every approval, every sale price, and every payout — recorded from intake to final report.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={(i % 3) * 80}>
                <div
                  className="h-full p-7 md:p-8"
                  style={{
                    background: '#FBF8F1',
                    border: '1px solid #E5DECF',
                    borderRadius: 12,
                  }}
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span
                      style={{
                        fontFamily: 'var(--font-display-family)',
                        fontStyle: 'italic',
                        fontWeight: 400, fontSize: 30,
                        color: '#9A7A3C', lineHeight: 1,
                      }}
                    >{s.n}</span>
                    <span className="label" style={{ color: '#9A7A3C' }}>Step</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 22, lineHeight: 1.2,
                      letterSpacing: '-0.01em', color: '#1E1B17',
                      marginBottom: 12,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="body-light leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SERVICES — refined service cards with brass detail.
          Replaces colored-bar grid with calm advisory tiles.
          ───────────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 md:py-32" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-20 items-end">
              <div className="md:col-span-7">
                <span className="brass-rule mb-5 block" aria-hidden />
                <span className="label block mb-4">Services</span>
                <h2 className="heading-advisory max-w-[20ch]">
                  The right path for each estate — and each item.
                </h2>
              </div>
              <p className="md:col-span-5 body-light max-w-md md:pb-2">
                Different estates need different paths. We start with a walkthrough and recommend the strategy that fits the property, the timeline, and the item categories.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.slug} delay={(i % 3) * 60}>
                <div className="card-advisory h-full flex flex-col">
                  <span className="brass-rule mb-5" aria-hidden />
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 24, lineHeight: 1.18,
                      letterSpacing: '-0.012em', color: '#1E1B17',
                      marginBottom: 16,
                    }}
                  >
                    {svc.name}
                  </h3>
                  <span className="label mb-1.5">Best for</span>
                  <p className="body-light mb-5">{svc.bestFor}</p>
                  <span className="label mb-1.5">Included</span>
                  <p className="body-light mb-7">{svc.included}</p>
                  <div className="mt-auto pt-2">
                    <Link href={`/services#${svc.slug}`} className="card-link">
                      Learn more →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SCENARIOS — illustrative outcomes, calm catalog rows.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-16 items-end">
              <div className="md:col-span-7">
                <span className="brass-rule mb-5 block" aria-hidden />
                <span className="label block mb-4">Example sale scenarios</span>
                <h2 className="heading-advisory max-w-[20ch]">
                  How different items move through the process.
                </h2>
              </div>
              <p className="md:col-span-5 body-light max-w-md md:pb-2">
                Examples shown for illustration. Actual results depend on condition, provenance, demand, and channel. Estimates are not appraisals.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              background: '#FBF8F1',
              border: '1px solid #E5DECF',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.item} delay={(i % 2) * 60}>
                <div
                  className="px-6 md:px-8 py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid #EBE6D8' }}
                >
                  <div className="md:col-span-5">
                    <span className="label mb-1 block">Item</span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display-family)',
                        fontWeight: 400, fontSize: 22, lineHeight: 1.2,
                        letterSpacing: '-0.01em', color: '#1E1B17',
                      }}
                    >{s.item}</h3>
                    <p className="body-light mt-2">{s.note}</p>
                  </div>
                  <div className="md:col-span-3">
                    <span className="label mb-1 block">Estimate</span>
                    <span className="price text-charcoal" style={{ fontSize: 15.5 }}>{s.estimate}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="label mb-1 block">Channel</span>
                    <span className="body-warm" style={{ fontSize: 14.5 }}>{s.channel}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="label mb-1 block">Outcome</span>
                    <span
                      className="price"
                      style={{
                        color: '#9A7A3C', fontSize: 17,
                        fontFamily: 'var(--font-display-family)',
                        fontWeight: 500,
                      }}
                    >{s.outcome}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 body-light max-w-2xl text-[#706A60]" style={{ fontStyle: 'italic' }}>
            We do not guarantee a specific outcome. Authentication is performed when a category warrants it, and high-risk items may be held from sale until review is complete.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          AUTHENTICATION & APPRAISAL — deep advisory section.
          Replaces stark black with deep olive surface for warmth.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#1E1B17', color: '#FBF8F1' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label-dark block mb-4">Authentication & appraisal</span>
            <h2 className="heading-advisory-dark max-w-[24ch]">
              We tell you what we know, what needs review, and what cannot be confirmed.
            </h2>
            <p
              className="mt-7 max-w-[62ch]"
              style={{
                fontFamily: 'var(--font-body-family)',
                fontWeight: 400, fontSize: 17, lineHeight: 1.7,
                color: 'rgba(251,248,241,0.74)',
              }}
            >
              Not every item requires a formal appraisal. General household items typically receive market-based estimates. Higher-value or legally sensitive items may require specialist review, third-party authentication, or a formal appraisal report — depending on purpose, category, and risk.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 md:mt-16">
            {AUTH_CATEGORIES.map((c, i) => (
              <Reveal key={c.name} delay={(i % 3) * 60}>
                <div
                  className="h-full p-7"
                  style={{
                    background: 'rgba(251,248,241,0.04)',
                    border: '1px solid rgba(251,248,241,0.12)',
                    borderRadius: 12,
                  }}
                >
                  <span className="brass-rule mb-4 block" aria-hidden style={{ background: '#B89A5A' }} />
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 22, lineHeight: 1.2,
                      letterSpacing: '-0.01em', color: '#FBF8F1',
                      marginBottom: 10,
                    }}
                  >{c.name}</h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body-family)',
                      fontWeight: 400, fontSize: 14.5, lineHeight: 1.7,
                      color: 'rgba(251,248,241,0.66)',
                    }}
                  >{c.notes}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <p style={{ fontFamily: 'var(--font-body-family)', fontWeight: 400, fontSize: 13, lineHeight: 1.7, color: 'rgba(251,248,241,0.6)', fontStyle: 'italic' }}>
                We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed.
              </p>
              <p style={{ fontFamily: 'var(--font-body-family)', fontWeight: 400, fontSize: 13, lineHeight: 1.7, color: 'rgba(251,248,241,0.6)', fontStyle: 'italic' }}>
                High-risk or high-value items may be held from sale until review is complete.
              </p>
            </div>
            <div className="mt-9">
              <Link href="/authentication" className="btn btn-outline-white">
                Learn about our authentication approach →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          WHY OUR MODEL — quiet four-up grid.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">Why our model</span>
            <h2 className="heading-advisory max-w-[22ch]">
              Better outcomes come from better routing — and from approval before publication.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
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
                <div className="card-advisory h-full">
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 23, lineHeight: 1.2,
                      letterSpacing: '-0.012em', color: '#1E1B17',
                      marginBottom: 12,
                    }}
                  >{x.t}</h3>
                  <p className="body-warm leading-relaxed">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          CLIENT PORTAL PREVIEW — fiduciary-careful, NOT fintech gamified.
          Language softened: "approve sale path", "settlement status",
          "donation routing" instead of "instant liquidity engine".
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-16 items-end">
              <div className="md:col-span-7">
                <span className="brass-rule mb-5 block" aria-hidden />
                <span className="label block mb-4">Client portal</span>
                <h2 className="heading-advisory max-w-[22ch]">
                  You will never wonder what happened to an item.
                </h2>
              </div>
              <p className="md:col-span-5 body-light max-w-md md:pb-2">
                Inventory, approvals, listings, offers, sale prices, fees, and net proceeds — visible at every step. Sample preview shown.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div
              style={{
                background: '#FBF8F1',
                border: '1px solid #E5DECF',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <div
                className="px-6 md:px-9 py-6 flex flex-wrap items-center justify-between gap-3"
                style={{ borderBottom: '1px solid #E5DECF' }}
              >
                <div>
                  <span className="label" style={{ color: '#706A60' }}>Estate overview · Anonymized sample</span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 26, lineHeight: 1.15,
                      letterSpacing: '-0.012em', color: '#1E1B17',
                      marginTop: 4,
                    }}
                  >
                    Anonymized estate file
                  </h3>
                </div>
                <span className="sample-tag">Sample preview</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {PORTAL_PREVIEW.map((m, i) => (
                  <div
                    key={m.label}
                    className="px-5 md:px-7 py-7"
                    style={{
                      borderRight: (i + 1) % 2 !== 0 ? '1px solid #EBE6D8' : '',
                      borderBottom: i < 4 ? '1px solid #EBE6D8' : '',
                    }}
                  >
                    <span className="label mb-3 block">{m.label}</span>
                    <span
                      className="price"
                      style={{
                        fontFamily: 'var(--font-display-family)',
                        fontWeight: 400, fontSize: 24, color: '#1E1B17',
                        letterSpacing: '-0.01em',
                        fontVariantNumeric: 'tabular-nums lining-nums',
                      }}
                    >{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 md:px-9 py-3" style={{ borderTop: '1px solid #E5DECF' }}>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Cash offer review',
                    'Approve sale path',
                    'Donation routing',
                    'Settlement status',
                  ].map(action => (
                    <span
                      key={action}
                      className="trust-chip"
                      style={{ background: '#FBF8F1', borderColor: '#E5DECF' }}
                    >
                      <span className="trust-chip-dot" aria-hidden />
                      {action}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="px-6 md:px-9 py-5 flex flex-wrap items-center justify-between gap-4"
                style={{ borderTop: '1px solid #E5DECF', background: '#F6F1E8' }}
              >
                <span className="label" style={{ fontSize: 11 }}>
                  Sample data only — does not reflect any real client estate.
                </span>
                <Link href="/portal" className="card-link">
                  Open client portal preview →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          PARTNER PROGRAM — calm two-column.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <Reveal className="md:col-span-6">
              <span className="brass-rule mb-5 block" aria-hidden />
              <span className="label block mb-4">Partner program</span>
              <h2 className="heading-advisory max-w-[20ch]">
                A reliable estate-disposition partner for the professionals who refer.
              </h2>
              <p className="body-warm mt-6 max-w-md leading-relaxed">
                Our partner program gives realtors, attorneys, fiduciaries, and estate professionals a discreet, defensible disposition resource for clients who need inventory, valuation, sale coordination, and itemized settlement reporting.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/partners" className="btn btn-primary">Refer an estate</Link>
                <Link href="/partners#program" className="btn btn-outline">Become a partner</Link>
              </div>
            </Reveal>
            <Reveal className="md:col-span-6" delay={120}>
              <div style={{ borderTop: '1px solid #E5DECF' }}>
                {[
                  ['Realtors & property managers', 'Faster client closings, less staging stress.'],
                  ['Probate & trust attorneys', 'Court-ready inventory and itemized reports.'],
                  ['Fiduciaries & trustees', 'Transparent disposition with seller approvals.'],
                  ['Senior move managers & organizers', 'Coordinated cleanout and donation receipts.'],
                ].map(([t, b]) => (
                  <div key={t} className="py-6 flex items-start gap-5" style={{ borderBottom: '1px solid #E5DECF' }}>
                    <span className="brass-rule mt-3 flex-shrink-0" aria-hidden style={{ width: 20 }} />
                    <div>
                      <p style={{ fontFamily: 'var(--font-body-family)', fontWeight: 600, fontSize: 17, color: '#1E1B17', marginBottom: 4 }}>{t}</p>
                      <p className="body-light">{b}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          PRICING — transparent fee structure.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">Pricing & fees</span>
            <h2 className="heading-advisory max-w-[24ch]">
              Transparent fees. No mystery after the sale.
            </h2>
            <p className="body-warm mt-7 max-w-[62ch] leading-relaxed">
              Every estate is different. Fees depend on scope, timeline, item categories, labor, sale channels, and whether specialist authentication, transport, storage, or cleanout coordination is needed. Before work begins, we explain the recommended strategy, expected costs, commission structure, and settlement timeline.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {[
              { t: 'Seller commission', b: 'Applied to sold items. Varies by service type and estate scope.' },
              { t: 'Buyer premium', b: 'May apply to auction purchases and is disclosed to buyers before bidding.' },
              { t: 'Optional formal appraisal', b: 'Used when a formal report is needed for estate, insurance, tax, legal, or high-value purposes.' },
              { t: 'Optional transport / storage / cleanout', b: 'Quoted separately when required.' },
              { t: 'Specialist authentication', b: 'When a category warrants third-party authentication, fees are disclosed in advance.' },
              { t: 'Settlement timing', b: 'Itemized statements after sale completion, buyer payment, and pickup or shipping confirmation.' },
            ].map((x, i) => (
              <Reveal key={x.t} delay={(i % 3) * 60}>
                <div className="card-advisory h-full">
                  <span className="brass-rule mb-4 block" aria-hidden />
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 20, lineHeight: 1.2,
                      letterSpacing: '-0.01em', color: '#1E1B17',
                      marginBottom: 10,
                    }}
                  >{x.t}</h3>
                  <p className="body-light leading-relaxed">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link href="/pricing" className="btn btn-primary">Request a fee review</Link>
              <Link href="/legal/fee-disclosure" className="card-link" style={{ color: '#706A60' }}>
                Read the full fee disclosure →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          FAQ PREVIEW — calm column rhythm.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-16 items-end">
              <div className="md:col-span-7">
                <span className="brass-rule mb-5 block" aria-hidden />
                <span className="label block mb-4">Common questions</span>
                <h2 className="heading-advisory max-w-[20ch]">
                  Clear answers, before you call.
                </h2>
              </div>
              <Link href="/faq" className="md:col-span-5 card-link md:pb-2 md:justify-end md:flex">
                See all answers →
              </Link>
            </div>
          </Reveal>

          <div style={{ borderTop: '1px solid #E5DECF' }}>
            {FAQ_PREVIEW.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div
                  className="py-9 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12"
                  style={{ borderBottom: '1px solid #E5DECF' }}
                >
                  <h3
                    className="md:col-span-5"
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400, fontSize: 22, lineHeight: 1.2,
                      letterSpacing: '-0.012em', color: '#1E1B17',
                    }}
                  >{f.q}</h3>
                  <p className="md:col-span-7 body-warm leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          AFTER YOU REQUEST — five concierge steps. Calm reassurance.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-14 items-end">
              <div className="md:col-span-7">
                <span className="brass-rule mb-5 block" aria-hidden />
                <span className="label block mb-4">After you submit the form</span>
                <h2 className="heading-advisory max-w-[22ch]">
                  Five calm steps. No pressure, no obligation.
                </h2>
              </div>
              <p className="md:col-span-5 body-light max-w-md md:pb-2">
                You will not be asked to create an account before we have spoken. You decide what comes next at every step.
              </p>
            </div>
          </Reveal>

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { n: '01', t: 'We review', b: 'Within one business day, we read your request and the situation.' },
              { n: '02', t: 'We call you', b: 'A short call to clarify timeline, access, item categories, and concerns.' },
              { n: '03', t: 'On-site walkthrough', b: 'We visit the property to assess scope, condition, and disposition options.' },
              { n: '04', t: 'Written plan', b: 'A clear disposition plan with channel strategy, timeline, and expected fees.' },
              { n: '05', t: 'You decide', b: 'You review the plan and decide what comes next. No obligation to proceed.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <li
                  className="h-full p-6 flex flex-col"
                  style={{
                    background: '#FBF8F1',
                    border: '1px solid #E5DECF',
                    borderRadius: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontStyle: 'italic',
                      fontWeight: 400, fontSize: 22,
                      color: '#9A7A3C', lineHeight: 1, marginBottom: 12,
                    }}
                  >{s.n}</span>
                  <p
                    style={{
                      fontFamily: 'var(--font-body-family)',
                      fontWeight: 600, fontSize: 15.5, lineHeight: 1.35,
                      color: '#1E1B17', marginBottom: 8,
                    }}
                  >{s.t}</p>
                  <p className="body-light text-[14px] leading-relaxed">{s.b}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          FINAL CTA — calm charcoal closer with brass rule.
          ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#1E1B17', color: '#FBF8F1' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-end">
          <div className="md:col-span-7">
            <span className="brass-rule mb-5 block" aria-hidden style={{ background: '#B89A5A' }} />
            <h2 className="heading-advisory-dark max-w-[22ch]">
              Ready for a calm, organized estate process?
            </h2>
          </div>
          <div className="md:col-span-5 flex flex-col gap-6">
            <p
              style={{
                fontFamily: 'var(--font-body-family)',
                fontWeight: 400, fontSize: 17, lineHeight: 1.7,
                color: 'rgba(251,248,241,0.78)',
              }}
            >
              Tell us about the estate. We will read the situation within one business day, recommend a path, and follow up to schedule a private walkthrough.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/request-walkthrough" className="btn btn-brass">
                Request a private estate review
              </Link>
              <Link href="/contact" className="btn btn-outline-white">
                Speak with an advisor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
