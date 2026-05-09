import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'How It Works — From Walkthrough to Settlement',
  description:
    'Six clear steps: walkthrough, inventory, appraisal-led pricing, seller approval, sale launch, and itemized settlement.',
  alternates: { canonical: '/how-it-works' },
}

const STEPS = [
  {
    n: '01',
    title: 'Free Estate Walkthrough',
    body: 'We assess the property, timeline, item categories, access needs, and the best disposition strategy.',
    detail: [
      'Walk every room with you or your designated contact.',
      'Identify items that warrant specialist review.',
      'Outline a recommended path before any work begins.',
    ],
  },
  {
    n: '02',
    title: 'Inventory & Photo Documentation',
    body: 'Approved items receive photos, descriptions, condition notes, category tags, and tracking IDs.',
    detail: [
      'Each item receives a tracking ID from intake to payout.',
      'Condition notes recorded so listings reflect reality.',
      'Sentimental or excluded items flagged and not listed.',
    ],
  },
  {
    n: '03',
    title: 'Appraisal-Led Pricing & Channel Strategy',
    body: 'We route each item to the best sale path: estate auction, marketplace, private buyer, specialty auction, buyout, donation, or clearout.',
    detail: [
      'Comparable sales reviewed for category and condition.',
      'Authentication coordination when a category warrants it.',
      'Channel chosen per item, not per estate.',
    ],
  },
  {
    n: '04',
    title: 'Seller Approval & Reserve Settings',
    body: 'You review key items, suggested estimates, reserves, and sale strategy before publication.',
    detail: [
      'Approve or hold items individually.',
      'Set reserves on items that warrant a floor.',
      'Withdrawal allowed before publication.',
    ],
  },
  {
    n: '05',
    title: 'Sale Launch & Buyer Management',
    body: 'We handle listings, promotion, questions, payment, pickup, shipping coordination, and offer tracking.',
    detail: [
      'Listings published across appropriate channels.',
      'Buyer questions and offers managed centrally.',
      'Pickup and shipping coordinated with documented chain of custody.',
    ],
  },
  {
    n: '06',
    title: 'Settlement & Final Report',
    body: 'You receive an itemized settlement showing sale prices, fees, net proceeds, payout status, and unsold disposition.',
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
        eyebrow="The Process"
        title={<>Six Steps,<br />From Walkthrough<br />To Settlement.</>}
        intro={<>Estate work is rarely just about selling things. We bring structure to the process — documenting each item, identifying what deserves specialist attention, choosing the right channels, and giving you a clear record from intake to final payout.</>}
      />

      <Section>
        <div className="border-t border-[#E0E0E0]">
          {STEPS.map(s => (
            <div key={s.n} className="border-b border-[#E0E0E0] py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#826DEE] block mb-4">Step {s.n}</span>
                <h2 className="text-[28px] md:text-[36px] leading-tight"
                    style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                  {s.title}
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-[17px] md:text-[19px] text-[#3a3a3a] leading-relaxed mb-6"
                   style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
                  {s.body}
                </p>
                <ul className="border-t border-[#E0E0E0]">
                  {s.detail.map(d => (
                    <li key={d} className="border-b border-[#E0E0E0] py-4 flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE] mt-2.5 flex-shrink-0" aria-hidden />
                      <span className="body-light text-[15px] text-[#0A0A0A]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl">
          <p className="label text-[#6B6B6B] leading-relaxed">
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
        heading="Start with a free walkthrough."
        body="We will review the estate, timeline, and item categories, then recommend the path that fits your situation."
        secondaryHref="/faq"
        secondaryLabel="See FAQ"
      />
    </PublicShell>
  )
}
