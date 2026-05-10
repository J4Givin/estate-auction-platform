import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { Reveal } from '@/components/public/Reveal'
import { ESTATE_OBJECTS } from '@/components/public/EstateObjects'

export const metadata: Metadata = {
  title: 'Estate Liquidity — A calm, careful path for the things a family must let go of.',
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

export default function HomePage() {
  return (
    <PublicShell>
      {/* ─────────────────────────────────────────────────────────────────
          1 — HERO
          Calm, magnetic opening. One promise, two paths, one trust line.
          ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#FBF8F1' }}>
        <div
          className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16"
          style={{
            paddingTop: 'clamp(2.5rem, 7vw, 6rem)',
            paddingBottom: 'clamp(2rem, 5vw, 4rem)',
          }}
        >
          <Reveal>
            <div className="flex items-center gap-3 mb-7 md:mb-10">
              <span className="brass-rule" aria-hidden />
              <span className="label">Private estate advisory · Los Angeles</span>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <h1
              className="display-xl hero-h1 max-w-[20ch] mx-auto md:mx-0 text-center md:text-left"
              style={{ fontWeight: 380 }}
            >
              A calm, careful path for the things a family must{' '}
              <span className="serif-italic" style={{ color: '#9A7A3C' }}>let&nbsp;go</span> of.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-7 sm:mt-9 max-w-[58ch] lede mx-auto md:mx-0 text-center md:text-left">
              We inventory, appraise, authenticate, photograph, list, sell, and settle estate assets — item by item, through the right channels — for sellers, buyers, and the professionals who serve them.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-8 sm:mt-10 flex flex-col items-stretch md:items-start gap-4 md:flex-row md:flex-wrap">
              <Link
                href="/request-walkthrough"
                className="btn btn-primary btn-mobile-primary justify-center"
                style={{ minWidth: 240 }}
              >
                Request an estate review
              </Link>
              <Link
                href="/auth/register"
                className="btn btn-outline btn-mobile-secondary justify-center"
                style={{ minWidth: 240 }}
              >
                Create account · marketplace access
              </Link>
            </div>
            <p className="mt-5 label" style={{ textTransform: 'none', letterSpacing: 0, color: '#706A60', fontSize: 13 }}>
              No obligation. Itemized reporting from intake to payout.
            </p>
          </Reveal>
        </div>

        {/* ───────────────────────────────────────────────────────────────
            ITEM GALLERY — transparent estate objects with light shadow.
            Mobile: scroll-snap horizontal track. Desktop: 6-up grid.
            ─────────────────────────────────────────────────────────────── */}
        <div
          className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16"
          style={{ paddingBottom: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          <Reveal>
            <div className="object-stage">
              {/* Mobile carousel (small + medium phones) */}
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
              <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 relative z-10">
                {ESTATE_OBJECTS.map(({ key, name, note, Component }, i) => (
                  <Reveal key={key} delay={i * 60}>
                    <article className="object-card h-full">
                      <div className="object-svg-wrap">
                        <Component />
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="object-name">{name}</span>
                        <span className="object-note">{note}</span>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p
              className="mt-8 md:mt-10 text-center md:text-left max-w-[60ch] md:mx-0 mx-auto"
              style={{
                fontFamily: 'var(--font-body-family)',
                fontSize: 13.5,
                color: '#706A60',
                fontStyle: 'italic',
              }}
            >
              Illustrative categories. Each item is documented, reviewed, and routed to the path that fits it.
            </p>
          </Reveal>
        </div>

        {/* Trust strip — calm, ivory, never shouty */}
        <div style={{ borderTop: '1px solid #E5DECF', background: '#F6F1E8' }}>
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-5 sm:py-6">
            <ul className="flex flex-wrap gap-2 sm:hidden" aria-label="What we hold ourselves to">
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
          One sentence per audience, one outcome, one carefully placed link.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-14 md:mb-20 items-end">
              <div className="md:col-span-7">
                <span className="brass-rule mb-5 block" aria-hidden />
                <span className="label block mb-4">Three ways to begin</span>
                <h2 className="heading-advisory max-w-[22ch]">
                  Whether you are letting go, looking, or referring — there is a calm way in.
                </h2>
              </div>
              <p className="md:col-span-5 body-light max-w-md md:pb-2">
                We work quietly with families, collectors, and the professionals who serve them. Choose the door that fits.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {PATHWAYS.map((p, i) => (
              <Reveal key={p.eyebrow} delay={i * 90}>
                <article className="path-card h-full flex flex-col">
                  <span className="brass-rule mb-5 block" aria-hidden />
                  <span className="label mb-3">{p.eyebrow}</span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400,
                      fontSize: 22,
                      lineHeight: 1.2,
                      letterSpacing: '-0.012em',
                      color: '#1E1B17',
                      marginBottom: 12,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p className="body-light leading-relaxed mb-6">{p.body}</p>
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
          3 — VALUE PROTECTION
          Three principles. Each links deeper. No long copy here.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">How value is protected</span>
            <h2 className="heading-advisory max-w-[22ch]">
              Three quiet principles. Held to{' '}
              <span className="serif-italic" style={{ color: '#9A7A3C' }}>every estate</span>.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-12 md:mt-16">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div
                  className="h-full p-7 md:p-8 flex flex-col"
                  style={{
                    background: 'rgba(251, 248, 241, 0.65)',
                    border: '1px solid rgba(229, 222, 207, 0.7)',
                    borderRadius: 14,
                    boxShadow: '0 12px 28px -22px rgba(30,27,23,0.16)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 18,
                      color: '#9A7A3C',
                      lineHeight: 1,
                      marginBottom: 12,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-family)',
                      fontWeight: 400,
                      fontSize: 22,
                      lineHeight: 1.2,
                      letterSpacing: '-0.012em',
                      color: '#1E1B17',
                      marginBottom: 12,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p className="body-light leading-relaxed mb-6">{p.body}</p>
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
          Account creation gives access to the marketplace experience.
          Honest about preview status. Real route into /auth/register.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: '#FBF8F1' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            <Reveal className="md:col-span-6">
              <span className="brass-rule mb-5 block" aria-hidden />
              <span className="label block mb-4">Marketplace · account access</span>
              <h2 className="heading-advisory max-w-[22ch]">
                Create an account to follow estates as they come to market.
              </h2>
              <p className="body-warm mt-6 max-w-md leading-relaxed">
                An account opens the marketplace experience: saved and watchlisted items, sale previews, offer review, and documentation per lot. Buyers, collectors, and estate professionals are all welcome.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/auth/register" className="btn btn-primary btn-mobile-primary justify-center">
                  Create an account
                </Link>
                <Link href="/auth/login" className="btn btn-outline btn-mobile-secondary justify-center">
                  Sign in
                </Link>
              </div>
              <p
                className="mt-5"
                style={{
                  fontFamily: 'var(--font-body-family)',
                  fontSize: 13,
                  color: '#706A60',
                }}
              >
                Sellers and families: a private estate review is the right first step —{' '}
                <Link href="/request-walkthrough" style={{ color: '#9A7A3C', borderBottom: '1px solid rgba(154,122,60,0.4)' }}>
                  request a walkthrough
                </Link>
                .
              </p>
            </Reveal>

            {/* Marketplace card — transparent, light shadow, illustrative only */}
            <Reveal className="md:col-span-6" delay={120}>
              <div
                className="relative"
                style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  border: '1px solid rgba(229, 222, 207, 0.7)',
                  borderRadius: 16,
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.6) inset, 0 24px 56px -28px rgba(30,27,23,0.22), 0 8px 18px -10px rgba(30,27,23,0.1)',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="px-6 sm:px-8 py-5 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(229,222,207,0.7)' }}
                >
                  <div className="flex flex-col">
                    <span className="label" style={{ color: '#706A60' }}>
                      Marketplace · sample lots
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display-family)',
                        fontWeight: 400,
                        fontSize: 19,
                        color: '#1E1B17',
                        letterSpacing: '-0.01em',
                        marginTop: 4,
                      }}
                    >
                      Featured this week
                    </span>
                  </div>
                  <span className="sample-tag">Sample preview</span>
                </div>
                <ul className="px-2 sm:px-4">
                  {[
                    { lot: 'Lot 042', name: 'Vintage gold watch', est: '$1,200 – $1,800' },
                    { lot: 'Lot 041', name: 'Signed fine-art print', est: '$800 – $1,200' },
                    { lot: 'Lot 038', name: 'Sterling silver service · 47 pcs', est: '$900 – $1,400' },
                    { lot: 'Lot 034', name: 'Mid-century lounge chair', est: '$600 – $900' },
                  ].map((row, i, arr) => (
                    <li
                      key={row.lot}
                      className="flex items-baseline justify-between gap-4 px-4 sm:px-5 py-4"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(235,230,216,0.7)' : 'none' }}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="label" style={{ fontSize: 10.5 }}>{row.lot}</span>
                        <span
                          className="truncate"
                          style={{
                            fontFamily: 'var(--font-body-family)',
                            fontWeight: 500,
                            fontSize: 14.5,
                            color: '#1E1B17',
                            letterSpacing: '-0.005em',
                            marginTop: 2,
                          }}
                        >
                          {row.name}
                        </span>
                      </div>
                      <span
                        className="price flex-shrink-0"
                        style={{
                          fontSize: 13.5,
                          color: '#3A3530',
                        }}
                      >
                        {row.est}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  className="px-6 sm:px-8 py-4 flex items-center justify-between"
                  style={{
                    borderTop: '1px solid rgba(229,222,207,0.7)',
                    background: 'rgba(246, 241, 232, 0.6)',
                  }}
                >
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
          Five short claims, each one supportable. No fake credentials.
          ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: '#F6F1E8' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <Reveal>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">What you can count on</span>
            <h2 className="heading-advisory max-w-[22ch]">
              Quiet structure. No surprises after the sale.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mt-10 md:mt-14">
            {[
              { t: 'Transparent fees', b: 'Explained before work begins.' },
              { t: 'Itemized settlement', b: 'Every sale price, every fee, every payout.' },
              { t: 'Seller approval', b: 'Nothing goes live without your sign-off.' },
              { t: 'Documentation', b: 'Photographs, condition, provenance signals.' },
              { t: 'Specialist review', b: 'For categories that warrant it.' },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 60}>
                <div
                  className="h-full p-5 md:p-6"
                  style={{
                    background: 'rgba(251, 248, 241, 0.7)',
                    border: '1px solid rgba(229, 222, 207, 0.7)',
                    borderRadius: 12,
                    boxShadow: '0 8px 20px -16px rgba(30,27,23,0.14)',
                  }}
                >
                  <span className="brass-rule mb-3 block" aria-hidden style={{ width: 18 }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-body-family)',
                      fontWeight: 600,
                      fontSize: 15,
                      color: '#1E1B17',
                      marginBottom: 6,
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {x.t}
                  </p>
                  <p className="body-light text-[13.5px] leading-relaxed">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-10 md:mt-12">
              <Link href="/pricing" className="card-link">
                Read the full fee disclosure →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          6 — FINAL CTA
          Split by audience: walkthrough, marketplace, partner.
          Charcoal closer with brass rule. Calm, decisive.
          ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#1E1B17', color: '#FBF8F1' }}>
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-end">
            <div className="md:col-span-7">
              <span className="brass-rule mb-5 block" aria-hidden style={{ background: '#B89A5A' }} />
              <h2 className="heading-advisory-dark max-w-[22ch]">
                Begin where it fits — quietly, on your timeline.
              </h2>
              <p
                className="mt-7 max-w-[58ch]"
                style={{
                  fontFamily: 'var(--font-body-family)',
                  fontWeight: 400,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: 'rgba(251,248,241,0.74)',
                }}
              >
                A private estate review is free and without obligation. Marketplace access is open to buyers, collectors, and estate professionals. The right path is the one that fits your situation.
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-1 gap-3">
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

          <div
            className="mt-14 md:mt-20 pt-8 flex flex-wrap items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(251,248,241,0.14)' }}
          >
            <span className="label-dark">Estate Liquidity · Los Angeles</span>
            <div className="flex flex-wrap gap-x-7 gap-y-2">
              <Link href="/how-it-works" className="label-dark hover:opacity-80">How it works</Link>
              <Link href="/services" className="label-dark hover:opacity-80">Services</Link>
              <Link href="/authentication" className="label-dark hover:opacity-80">Authentication</Link>
              <Link href="/pricing" className="label-dark hover:opacity-80">Pricing</Link>
              <Link href="/faq" className="label-dark hover:opacity-80">FAQ</Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
