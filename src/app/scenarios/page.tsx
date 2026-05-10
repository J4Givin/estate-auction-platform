import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Example sale scenarios — Illustrative outcomes',
  description:
    'Illustrative examples of how different estate items are routed and sold. Actual results depend on condition, provenance, market demand, and channel.',
  alternates: { canonical: '/scenarios' },
}

const SCENARIOS = [
  {
    item: 'Signed fine art print',
    estimate: '$800 – $1,200',
    channel: 'Specialist auction',
    outcome: '$1,475',
    note: 'Signature and edition reviewed before publication.',
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
    note: 'Maker reviewed; condition documented; pickup coordinated.',
  },
  {
    item: 'Sterling silver service',
    estimate: '$900 – $1,400',
    channel: 'Multi-channel auction',
    outcome: '$1,320',
    note: 'Hallmark and weight noted in catalog.',
  },
  {
    item: 'Designer handbag',
    estimate: '$700 – $1,100',
    channel: 'Authenticated marketplace',
    outcome: '$985',
    note: 'Serial code and materials reviewed by partner authenticator.',
  },
  {
    item: 'Pair of antique side tables',
    estimate: '$400 – $700',
    channel: 'Hybrid plan: local sale + clearout',
    outcome: '$520',
    note: 'Maker uncertain; documented as period style with condition notes.',
  },
]

export default function ScenariosPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Example sale scenarios"
        title={<>How different items move through the process.</>}
        intro={<>Examples shown for illustration. Actual results depend on condition, provenance, market demand, and sale channel. We do not guarantee a specific outcome.</>}
      />

      <Section surface="parchment">
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5DECF',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {SCENARIOS.map((s, i) => (
            <div
              key={s.item}
              className="px-6 md:px-8 py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline"
              style={{ borderTop: i === 0 ? 'none' : '1px solid #EBE6D8' }}
            >
              <div className="md:col-span-5">
                <span className="label mb-1 block">Item</span>
                <h2 style={{
                  fontFamily: 'var(--font-display-family)',
                  fontWeight: 400, fontSize: 22, lineHeight: 1.2,
                  letterSpacing: '-0.012em', color: '#1E1B17',
                }}>{s.item}</h2>
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
                <span className="price" style={{
                  color: '#9A7A3C', fontSize: 17,
                  fontFamily: 'var(--font-display-family)', fontWeight: 500,
                }}>{s.outcome}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 body-light max-w-3xl leading-relaxed" style={{ fontStyle: 'italic' }}>
          Estimates and appraisal indications are not a guarantee of value. Authentication is performed when a category warrants it, and high-risk items may be held from sale until review is complete.
        </p>
      </Section>

      <CTABanner
        heading="Curious what your estate could look like?"
        body="Start with a private walkthrough. We will outline a recommended path with item categories and channels before any work begins."
      />
    </PublicShell>
  )
}
