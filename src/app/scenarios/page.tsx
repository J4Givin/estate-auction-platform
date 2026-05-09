import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Example Sale Scenarios — Illustrative Outcomes',
  description:
    'Illustrative examples of how different estate items are routed and sold. Actual results depend on condition, provenance, market demand, and channel.',
  alternates: { canonical: '/scenarios' },
}

const SCENARIOS = [
  {
    item: 'Signed Fine Art Print',
    estimate: '$800 – $1,200',
    channel: 'Specialist auction',
    outcome: '$1,475',
    note: 'Signature and edition review recommended before publication.',
    accent: '#826DEE',
  },
  {
    item: 'Vintage Gold Watch',
    estimate: '$1,200 – $1,800',
    channel: 'Private buyer network',
    outcome: '$2,050',
    note: 'Serial and reference verification required. Movement photos requested.',
    accent: '#FFDB15',
  },
  {
    item: 'Mid-Century Dining Set',
    estimate: '$600 – $900',
    channel: 'Local estate auction',
    outcome: '$825',
    note: 'Maker review and condition documentation. Pickup coordinated.',
    accent: '#F94500',
  },
  {
    item: 'Sterling Silver Service',
    estimate: '$900 – $1,400',
    channel: 'Multi-channel auction',
    outcome: '$1,320',
    note: 'Hallmark identification and weight documentation.',
    accent: '#FF99DC',
  },
  {
    item: 'Designer Handbag',
    estimate: '$700 – $1,100',
    channel: 'Authentication-required marketplace',
    outcome: '$985',
    note: 'Serial code and material check via partner authenticator.',
    accent: '#0A0A0A',
  },
  {
    item: 'Pair of Antique Side Tables',
    estimate: '$400 – $700',
    channel: 'Hybrid plan: local sale + clearout',
    outcome: '$520',
    note: 'Maker uncertain. Documented as period style with condition notes.',
    accent: '#826DEE',
  },
]

export default function ScenariosPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Example Sale Scenarios"
        title={<>What different items<br/>actually look like.</>}
        intro={<>Examples shown for illustrative purposes. Actual results depend on condition, provenance, market demand, and sale channel. We do not guarantee a specific outcome.</>}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-[#E0E0E0]">
          {SCENARIOS.map((s, i) => (
            <div key={s.item} className={`px-0 md:px-8 py-10 md:py-14 border-b border-[#E0E0E0] ${i % 2 === 0 ? 'md:border-r' : ''}`}>
              <span className="block w-6 h-0.5 mb-5" style={{ background: s.accent }} aria-hidden />
              <h2 className="text-[24px] md:text-[28px] mb-5 leading-tight"
                  style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                {s.item}
              </h2>
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
          ))}
        </div>

        <p className="mt-12 label text-[#6B6B6B] max-w-3xl leading-relaxed">
          Estimates and appraisal indications are not a guarantee of value. Authentication is performed when a category warrants it, and high-risk items may be held from sale until review is complete.
        </p>
      </Section>

      <CTABanner
        heading="Curious what your estate could look like?"
        body="Start with a free walkthrough. We will outline a recommended path with item categories and channels before any work begins."
      />
    </PublicShell>
  )
}
