import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { Reveal } from '@/components/public/Reveal'
import { ESTATE_OBJECTS } from '@/components/public/EstateObjects'

export const metadata: Metadata = {
  title:
    'Estate Liquidity — A calm, careful path for the things a family must let go of.',
  description:
    'A private estate-advisory and asset-disposition partner for families, executors, fiduciaries, and the professionals who serve them. Inventory, appraisal, authentication, multi-channel sale, and itemized settlement — handled with care.',
  alternates: { canonical: '/' },
}

const TRUST = [
  'Documented from intake',
  'Reviewed before sale',
  'Itemized settlement',
  'Seller approval at every step',
]

const PATHWAYS = [
  {
    eyebrow: 'Sellers & families',
    title: 'A quiet, organized path forward.',
    body: 'For executors, trustees, downsizing families, and anyone facing a property to clear. We listen first, then propose a plan.',
    href: '/request-walkthrough',
    cta: 'Request a private review',
  },
  {
    eyebrow: 'Buyers & collectors',
    title: 'Documented objects, cleanly catalogued.',
    body: 'Create an account for marketplace access — saved items, sale previews, and offers as estates come to market. Every lot is documented item by item.',
    href: '/auth/register',
    cta: 'Create an account',
  },
  {
    eyebrow: 'Estate professionals',
    title: 'A defensible disposition partner.',
    body: 'Realtors, attorneys, fiduciaries, and senior-move managers refer estates that need inventory, valuation, and a clean paper trail.',
    href: '/partners',
    cta: 'Partner with us',
  },
]

const PRINCIPLES = [
  {
    title: 'Documented from intake.',
    body: 'Photographs, condition notes, provenance signals, and tracking IDs — recorded the day we walk in.',
    href: '/how-it-works',
    cta: 'See how it works',
  },
  {
    title: 'Reviewed before sale.',
    body: 'Specialist categories receive specialist review. You approve estimates, reserves, and channel before anything goes live.',
    href: '/authentication',
    cta: 'Our authentication approach',
  },
  {
    title: 'Routed to the right channel.',
    body: 'One sale rarely fits an entire estate. We split items across the paths — auction, private buyer, marketplace, donation — that fit each one.',
    href: '/services',
    cta: 'Services & paths',
  },
]

const REASSURANCE = [
  { t: 'Transparent fees', b: 'Explained before work begins.' },
  { t: 'Itemized settlement', b: 'Every sale price, every fee, every payout.' },
  { t: 'Seller approval', b: 'Nothing goes live without your sign-off.' },
  { t: 'Documentation', b: 'Photographs, condition, provenance signals.' },
  { t: 'Specialist review', b: 'For categories that warrant it.' },
]

export default function HomePage() {
  return (
    <PublicShell>
      {/* ─────────────────────────────────────────────────────────────────
          1 — HERO
          Calm, magnetic opening. One promise, two paths, one trust line.
          Always left-aligned (estate-house composition, never centered).
          Hand-controlled line break keeps "let go of." together.
          ───────────────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ background: '#FBF8F1' }}>
        <div className="hero-inner max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <span className="brass-rule" aria-hidden />
              <span className="label">Private estate advisory · Los Angeles</span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-8">
              <Reveal delay={60}>
                <h1 className="hero-h1 home-h1">
                  A calm, careful path for the things a family must
                  {' '}
                  <span className="serif-italic" style={{ color: '#9A7A3C' }}>
                    let&nbsp;go&nbsp;of.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-6 sm:mt-7 lede max-w-[56ch]">
                  We inventory, appraise, authenticate, photograph, list, sell,
                  and settle estate assets — item by item, through the right
                  channels — for sellers, buyers, and the professionals who
                  serve them.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  <Link
                    href="/request-walkthrough"
                    className="btn btn-primary btn-mobile-primary justify-center"
                  >
                    Request an estate review
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn btn-outline btn-mobile-secondary justify-center"
                  >
                    Create marketplace account
                  </Link>
                </div>
                <p
                  className="mt-4"
                  style={{
                    fontFamily: 'var(--font-body-family)',
                    fontSize: 13,
                    color: '#706A60',
                    lineHeight: 1.5,
                  }}
                >
                  No obligation. Itemized reporting from intake to payout.
                </p>
              </Reveal>
            </div>

            {/* Inline doc card on desktop — quiet visual anchor */}
            <Reveal delay={180} className="hidden lg:block lg:col-span-4">
              <aside
                aria-label="Estate file preview"
                className="hero-doc"
              >
                <div className="hero-doc-head">
                  <div className="flex flex-col">
                    <span className="label" style={{ color: '#706A60' }}>
                      Estate file · anonymized
                    </span>
                    <span className="hero-doc-title">Catalog sheet</span>
                  </div>
                  <span className="sample-tag">Sample preview</span>
                </div>
                <ul className="hero-doc-list">
                  {[
                    { lot: '042', name: 'Vintage gold watch', est: '$1,200 – $1,800' },
                    { lot: '041', name: 'Signed fine-art print', est: '$800 – $1,200' },
                    { lot: '038', name: 'Sterling silver service', est: '$900 – $1,400' },
                    { lot: '034', name: 'Mid-century lounge chair', est: '$600 – $900' },
                  ].map((row) => (
                    <li key={row.lot} className="hero-doc-row">
                      <span className="hero-doc-lot">Lot {row.lot}</span>
                      <span className="hero-doc-name">{row.name}</span>
                      <span className="hero-doc-est">{row.est}</span>
                    </li>
                  ))}
                </ul>
                <div className="hero-doc-foot">
                  <span>Documented item by item.</span>
                  <Link href="/auth/register" className="hero-doc-link">
                    Create account →
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ITEM GALLERY — transparent estate objects with light shadow.
            Mobile: snap-scroll carousel. Tablet+: 6-up grid.
            ───────────────────────────────────────────────────────────── */}
        <div className="hero-gallery max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Mobile carousel */}
          <div className="object-track sm:hidden -mx-5">
            {ESTATE_OBJECTS.map(({ key, name, note, Component }) => (
              <article key={key} className="object-card">
                <div className="object-svg-wrap">
                  <Component />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="object-name">{name}</span>
                  <span className="object-note">{note}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Tablet+ grid */}
          <div className="object-stage hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 relative">
            {ESTATE_OBJECTS.map(({ key, name, note, Component }) => (
              <article key={key} className="object-card h-full relative z-10">
                <div className="object-svg-wrap">
                  <Component />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="object-name">{name}</span>
                  <span className="object-note">{note}</span>
                </div>
              </article>
            ))}
          </div>

          <p className="hero-gallery-note">
            Illustrative categories. Each item is documented, reviewed, and
            routed to the path that fits it.
          </p>
        </div>

        {/* Trust strip — calm, ivory, never shouty */}
        <div className="trust-strip">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-5 sm:py-6">
            <ul className="flex flex-wrap gap-2 sm:hidden">
              {TRUST.map((t) => (
                <li key={t}>
                  <span className="trust-chip">
                    <span className="trust-chip-dot" aria-hidden />
                    {t}
                  </span>
                </li>
              ))}
            </ul>
            <div className="hidden sm:flex flex-wrap items-center justify-between gap-x-10 gap-y-3">
              {TRUST.map((t, i) => (
                <span key={t} className="label flex items-center gap-3">
                  {t}
                  {i < TRUST.length - 1 && (
                    <span
                      className="hidden md:inline w-1 h-1 rounded-full"
                      style={{ background: '#C9C0AC' }}
                      aria-hidden
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          2 — AUDIENCE PATHWAYS
          ───────────────────────────────────────────────────────────────── */}
      <section className="section-rhythm" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 md:mb-14 items-end">
            <Reveal className="md:col-span-7">
              <span className="brass-rule mb-4 block" aria-hidden />
              <span className="label block mb-3">Three ways to begin</span>
              <h2 className="heading-advisory max-w-[22ch]">
                Whether you are letting go, looking, or referring — there is a
                calm way in.
              </h2>
            </Reveal>
            <Reveal className="md:col-span-5" delay={60}>
              <p className="body-light max-w-md md:pb-2">
                We work quietly with families, collectors, and the professionals
                who serve them. Choose the door that fits.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {PATHWAYS.map((p, i) => (
              <Reveal key={p.eyebrow} delay={i * 70}>
                <article className="path-card h-full flex flex-col">
                  <span className="brass-rule mb-4 block" aria-hidden />
                  <span className="label mb-3">{p.eyebrow}</span>
                  <h3 className="path-title">{p.title}</h3>
                  <p className="body-light leading-relaxed mb-5">{p.body}</p>
                  <div className="mt-auto pt-1">
                    <Link href={p.href} className="card-link">
                      {p.cta} →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          3 — VALUE PROTECTION (three principles)
          ───────────────────────────────────────────────────────────────── */}
      <section className="section-rhythm" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-4 block" aria-hidden />
            <span className="label block mb-3">How value is protected</span>
            <h2 className="heading-advisory max-w-[22ch]">
              Three quiet principles. Held to{' '}
              <span className="serif-italic" style={{ color: '#9A7A3C' }}>
                every estate
              </span>
              .
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-10 md:mt-14">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="principle-card h-full flex flex-col">
                  <span className="principle-num">0{i + 1}</span>
                  <h3 className="path-title">{p.title}</h3>
                  <p className="body-light leading-relaxed mb-5">{p.body}</p>
                  <div className="mt-auto pt-1">
                    <Link href={p.href} className="card-link">
                      {p.cta} →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          4 — MARKETPLACE / ACCOUNT TEASER
          ───────────────────────────────────────────────────────────────── */}
      <section className="section-rhythm" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
            <Reveal className="md:col-span-6">
              <span className="brass-rule mb-4 block" aria-hidden />
              <span className="label block mb-3">Marketplace · account access</span>
              <h2 className="heading-advisory max-w-[22ch]">
                Create an account to follow estates as they come to market.
              </h2>
              <p className="body-warm mt-5 max-w-md leading-relaxed">
                An account opens the marketplace experience: saved and
                watchlisted items, sale previews, offer review, and
                documentation per lot. Buyers, collectors, and estate
                professionals are all welcome.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <Link
                  href="/auth/register"
                  className="btn btn-primary btn-mobile-primary justify-center"
                >
                  Create marketplace account
                </Link>
                <Link
                  href="/auth/login"
                  className="btn btn-outline btn-mobile-secondary justify-center"
                >
                  Sign in
                </Link>
              </div>
              <p
                className="mt-4"
                style={{
                  fontFamily: 'var(--font-body-family)',
                  fontSize: 13,
                  color: '#706A60',
                }}
              >
                Sellers and families: a private estate review is the right first
                step —{' '}
                <Link
                  href="/request-walkthrough"
                  style={{
                    color: '#9A7A3C',
                    borderBottom: '1px solid rgba(154,122,60,0.4)',
                  }}
                >
                  request a walkthrough
                </Link>
                .
              </p>
            </Reveal>

            <Reveal className="md:col-span-6" delay={120}>
              <div className="market-card">
                <div className="market-card-head">
                  <div className="flex flex-col">
                    <span className="label" style={{ color: '#706A60' }}>
                      Marketplace · sample lots
                    </span>
                    <span className="market-card-title">Featured this week</span>
                  </div>
                  <span className="sample-tag">Sample preview</span>
                </div>
                <ul className="market-list">
                  {[
                    { lot: 'Lot 042', name: 'Vintage gold watch', est: '$1,200 – $1,800' },
                    { lot: 'Lot 041', name: 'Signed fine-art print', est: '$800 – $1,200' },
                    { lot: 'Lot 038', name: 'Sterling silver service · 47 pcs', est: '$900 – $1,400' },
                    { lot: 'Lot 034', name: 'Mid-century lounge chair', est: '$600 – $900' },
                  ].map((row) => (
                    <li key={row.lot} className="market-row">
                      <div className="flex flex-col min-w-0">
                        <span className="label" style={{ fontSize: 10.5 }}>
                          {row.lot}
                        </span>
                        <span className="market-name truncate">{row.name}</span>
                      </div>
                      <span className="market-est">{row.est}</span>
                    </li>
                  ))}
                </ul>
                <div className="market-card-foot">
                  <span className="label" style={{ fontSize: 10.5 }}>
                    Sample data — does not reflect current listings.
                  </span>
                  <Link href="/auth/register" className="card-link">
                    Create account →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          5 — REASSURANCE STRIP
          ───────────────────────────────────────────────────────────────── */}
      <section className="section-rhythm-tight" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-4 block" aria-hidden />
            <span className="label block mb-3">What you can count on</span>
            <h2 className="heading-advisory max-w-[22ch]">
              Quiet structure. No surprises after the sale.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mt-8 md:mt-12">
            {REASSURANCE.map((x, i) => (
              <Reveal key={x.t} delay={i * 50}>
                <div className="trust-card h-full">
                  <span className="brass-rule mb-3 block" aria-hidden style={{ width: 18 }} />
                  <p className="trust-card-title">{x.t}</p>
                  <p className="body-light text-[13.5px] leading-relaxed">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-8 md:mt-10 flex flex-wrap gap-x-6 gap-y-3 items-center">
              <Link href="/pricing" className="card-link">
                Read the full fee disclosure →
              </Link>
              <Link href="/faq" className="card-link" style={{ color: '#706A60' }}>
                Common questions →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          6 — FINAL CTA
          ───────────────────────────────────────────────────────────────── */}
      <section className="cta-section" style={{ background: '#1E1B17', color: '#FBF8F1' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-end">
            <div className="md:col-span-7">
              <span className="brass-rule mb-4 block" aria-hidden style={{ background: '#B89A5A' }} />
              <h2 className="heading-advisory-dark max-w-[22ch]">
                Begin where it fits — quietly, on your timeline.
              </h2>
              <p
                className="mt-6 max-w-[58ch]"
                style={{
                  fontFamily: 'var(--font-body-family)',
                  fontWeight: 400,
                  fontSize: 16.5,
                  lineHeight: 1.7,
                  color: 'rgba(251,248,241,0.74)',
                }}
              >
                A private estate review is free and without obligation.
                Marketplace access is open to buyers, collectors, and estate
                professionals. The right path is the one that fits your
                situation.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col gap-3">
              <Link
                href="/request-walkthrough"
                className="btn btn-brass btn-mobile-primary justify-center"
                style={{ minHeight: 52 }}
              >
                Request a private estate review
              </Link>
              <Link
                href="/auth/register"
                className="btn btn-outline-white btn-mobile-secondary justify-center"
                style={{ minHeight: 48 }}
              >
                Create marketplace account
              </Link>
              <Link
                href="/partners"
                className="btn btn-outline-white btn-mobile-secondary justify-center"
                style={{ minHeight: 48 }}
              >
                Refer or partner with us
              </Link>
            </div>
          </div>

          <div className="cta-foot">
            <span className="label-dark">Estate Liquidity · Los Angeles</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/how-it-works" className="label-dark hover:opacity-80">
                How it works
              </Link>
              <Link href="/services" className="label-dark hover:opacity-80">
                Services
              </Link>
              <Link href="/authentication" className="label-dark hover:opacity-80">
                Authentication
              </Link>
              <Link href="/pricing" className="label-dark hover:opacity-80">
                Pricing
              </Link>
              <Link href="/faq" className="label-dark hover:opacity-80">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
