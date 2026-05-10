import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'How it works — From walkthrough to settlement',
  description:
    'Six clear steps: walkthrough, inventory, appraisal-led pricing, seller approval, sale launch, and itemized settlement.',
  alternates: { canonical: '/how-it-works' },
}

const STEPS = [
  {
    n: '01',
    title: 'Private estate walkthrough',
    body: 'We assess the property, timeline, item categories, access needs, and the right disposition strategy — at no cost and with no obligation.',
    detail: [
      'Walk every room with you or your designated contact.',
      'Identify items that warrant specialist review.',
      'Outline a recommended path before any work begins.',
    ],
  },
  {
    n: '02',
    title: 'Inventory & photographic record',
    body: 'Approved items receive photographs, condition notes, category tags, provenance signals, and tracking IDs.',
    detail: [
      'Each item receives a tracking ID from intake to payout.',
      'Condition notes recorded so listings reflect reality.',
      'Sentimental or excluded items flagged and held back.',
    ],
  },
  {
    n: '03',
    title: 'Appraisal-led pricing & channel routing',
    body: 'We route each item to the right path: estate auction, specialist auction, private buyer, marketplace, buyout, donation, or coordinated cleanout.',
    detail: [
      'Comparable sales reviewed for category and condition.',
      'Authentication coordination when a category warrants it.',
      'Channel chosen per item, not per estate.',
    ],
  },
  {
    n: '04',
    title: 'Approval & reserves',
    body: 'You review key items, estimates, reserves, and sale strategy before anything is published.',
    detail: [
      'Approve or hold items individually.',
      'Set reserves on items that warrant a floor.',
      'Withdrawal allowed before publication.',
    ],
  },
  {
    n: '05',
    title: 'Sale, buyer management & pickup',
    body: 'We handle listings, buyer questions, offers, payment, pickup, and shipping coordination.',
    detail: [
      'Listings published across appropriate channels.',
      'Buyer questions and offers managed centrally.',
      'Pickup and shipping coordinated with a documented chain of custody.',
    ],
  },
  {
    n: '06',
    title: 'Itemized settlement',
    body: 'You receive an itemized statement: sale prices, fees, net proceeds, payout status, and unsold disposition.',
    detail: [
      'Settlement statement issued after buyer payment confirms.',
      'Unsold items dispositioned per your direction.',
      'Final estate report archived in the client portal.',
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="The process"
        title={<>Six steps, from walkthrough to settlement.</>}
        intro={<>Estate work is rarely just about selling things. We bring quiet structure to the process — documenting each item, identifying what deserves specialist attention, choosing the right channels, and giving you a clear record from the first walkthrough to the final payout.</>}
      />

      <Section surface="parchment">
        <div style={{ borderTop: '1px solid #E5DECF' }}>
          {STEPS.map(s => (
            <div key={s.n} className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12" style={{ borderBottom: '1px solid #E5DECF' }}>
              <div className="md:col-span-4">
                <div className="flex items-baseline gap-3 mb-4">
                  <span style={{
                    fontFamily: 'var(--font-display-family)',
                    fontStyle: 'italic', fontWeight: 400, fontSize: 32,
                    color: '#9A7A3C', lineHeight: 1,
                  }}>{s.n}</span>
                  <span className="label" style={{ color: '#9A7A3C' }}>Step</span>
                </div>
                <h2 className="display-md max-w-[16ch]">{s.title}</h2>
              </div>
              <div className="md:col-span-8">
                <p className="lede mb-6 max-w-[58ch]">{s.body}</p>
                <ul style={{ borderTop: '1px solid #E5DECF' }}>
                  {s.detail.map(d => (
                    <li key={d} className="py-4 flex items-start gap-4" style={{ borderBottom: '1px solid #E5DECF' }}>
                      <span className="brass-rule mt-3 flex-shrink-0" aria-hidden style={{ width: 18 }} />
                      <span className="body-warm" style={{ fontSize: 15 }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 max-w-3xl">
          <p className="body-light leading-relaxed" style={{ fontStyle: 'italic' }}>
            We do not guarantee a specific outcome. Estimates and appraisal indications are not a guarantee of value. High-risk or high-value items may be held from sale until review is complete.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services" className="btn btn-outline">See services</Link>
            <Link href="/authentication" className="btn btn-outline">Authentication & appraisal</Link>
            <Link href="/pricing" className="btn btn-outline">Pricing & fees</Link>
          </div>
        </div>
      </Section>

      <CTABanner
        heading="Start with a private walkthrough."
        body="We read every request within one business day and call you to discuss before any walkthrough is scheduled."
        secondaryHref="/faq"
        secondaryLabel="See FAQ"
      />
    </PublicShell>
  )
}
