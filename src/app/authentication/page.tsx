import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Authentication & appraisal framework',
  description:
    'How we tell the difference between a market estimate, a catalog review, specialist authentication, and a formal appraisal report.',
  alternates: { canonical: '/authentication' },
}

const LEVELS = [
  {
    n: '01',
    name: 'Market estimate',
    body: 'A range based on comparable sales, condition, and current demand for the category. Useful for general household items where a formal report is not required.',
  },
  {
    n: '02',
    name: 'Internal catalog review',
    body: 'Documentation of category, maker, age, condition, and notable details. Records are stored against a tracking ID for the item from intake to payout.',
  },
  {
    n: '03',
    name: 'Specialist review',
    body: 'A category specialist reviews the piece for elements that affect placement and pricing — for example, watch reference and movement, jewelry hallmarks, or art attribution.',
  },
  {
    n: '04',
    name: 'Third-party authentication',
    body: 'Coordinated with an external lab or recognized authentication partner where a category warrants it. Outcome and limitations are documented before the item is published.',
  },
  {
    n: '05',
    name: 'Formal appraisal report',
    body: 'A written valuation prepared for estate, insurance, tax, legal, or high-value purposes. Scope, intended use, and methodology are documented.',
  },
]

const CATEGORIES = [
  { name: 'Jewelry', notes: 'Metal testing, gemstone screening, hallmark review, lab referral.' },
  { name: 'Watches', notes: 'Serial / reference, movement photography, service history, condition.' },
  { name: 'Art', notes: 'Attribution, medium, edition, provenance, condition, framing.' },
  { name: 'Antiques', notes: 'Period, construction, maker marks, comparables, restoration notes.' },
  { name: 'Designer goods', notes: 'Serial codes, stitching and materials, authentication partner.' },
  { name: 'Furniture', notes: 'Maker, age, construction, restoration, market demand.' },
]

export default function AuthenticationPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Authentication & appraisal"
        title={<>What we know, what needs review, and what cannot be confirmed.</>}
        intro={<>Not every item requires a formal appraisal. General household items typically receive a market-based estimate. Higher-value or legally sensitive items may require specialist review, third-party authentication, or a formal appraisal report — depending on purpose, category, and risk.</>}
      />

      <Section surface="parchment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">Five levels</span>
            <h2 className="heading-advisory max-w-[14ch]">From estimate to formal report.</h2>
            <p className="body-warm mt-6 max-w-md leading-relaxed">
              Each item is treated according to its category, value, and intended use. We document which path was used and why.
            </p>
          </div>
          <div style={{ borderTop: '1px solid #E5DECF' }}>
            {LEVELS.map(l => (
              <div key={l.n} className="py-6 grid grid-cols-12 gap-4" style={{ borderBottom: '1px solid #E5DECF' }}>
                <span
                  className="col-span-2"
                  style={{
                    fontFamily: 'var(--font-display-family)',
                    fontStyle: 'italic', fontWeight: 400, fontSize: 22,
                    color: '#9A7A3C', lineHeight: 1.1,
                  }}
                >{l.n}</span>
                <div className="col-span-10">
                  <p style={{
                    fontFamily: 'var(--font-display-family)',
                    fontWeight: 400, fontSize: 19, lineHeight: 1.2,
                    letterSpacing: '-0.01em', color: '#1E1B17', marginBottom: 8,
                  }}>{l.name}</p>
                  <p className="body-light leading-relaxed">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section surface="charcoal">
        <span className="brass-rule mb-5 block" aria-hidden style={{ background: '#B89A5A' }} />
        <span className="label-dark block mb-4">By category</span>
        <h2 className="heading-advisory-dark max-w-[18ch]">Specialist review where it matters.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {CATEGORIES.map(c => (
            <div
              key={c.name}
              className="p-7 h-full"
              style={{
                background: 'rgba(251,248,241,0.04)',
                border: '1px solid rgba(251,248,241,0.12)',
                borderRadius: 12,
              }}
            >
              <span className="brass-rule mb-4 block" aria-hidden style={{ background: '#B89A5A' }} />
              <h3 style={{
                fontFamily: 'var(--font-display-family)',
                fontWeight: 400, fontSize: 22, lineHeight: 1.2,
                letterSpacing: '-0.01em', color: '#FBF8F1', marginBottom: 10,
              }}>{c.name}</h3>
              <p style={{
                fontFamily: 'var(--font-body-family)',
                fontWeight: 400, fontSize: 14.5, lineHeight: 1.7,
                color: 'rgba(251,248,241,0.66)',
              }}>{c.notes}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section surface="parchment">
        <span className="brass-rule mb-5 block" aria-hidden />
        <span className="label block mb-4">Limits & disclaimers</span>
        <h2 className="heading-advisory max-w-[20ch]">We tell you what we can — and cannot — confirm.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 max-w-5xl">
          <p className="body-warm text-[16px] leading-relaxed">
            We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed. Where authentication has not been performed, items are presented based on documented condition and category notes only.
          </p>
          <p className="body-warm text-[16px] leading-relaxed">
            High-risk or high-value items may be held from sale until review is complete. Estimates and appraisal indications are not a guarantee of value. Final outcome depends on condition, provenance, market demand, and sale channel.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/request-walkthrough" className="btn btn-primary">Request a private review</Link>
          <Link href="/pricing" className="btn btn-outline">See pricing</Link>
        </div>
      </Section>

      <CTABanner
        heading="Have a category that needs specialist review?"
        body="We will tell you which path fits — market estimate, specialist review, third-party authentication, or formal appraisal."
      />
    </PublicShell>
  )
}
