import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Services — Estate auction, appraisal, buyout, cleanout',
  description:
    'Managed estate auction, high-value placement, estate buyout, hybrid liquidation, cleanout coordination, and partner referrals.',
  alternates: { canonical: '/services' },
}

const SERVICES = [
  {
    slug: 'managed',
    name: 'Managed estate auction',
    bestFor: 'Full homes, probate, downsizing, move deadlines.',
    summary: 'A complete managed process: walkthrough, inventory, photography, listing across appropriate channels, buyer management, and itemized settlement.',
    included: [
      'Property walkthrough and recommended strategy',
      'Inventory with tracking IDs and condition notes',
      'Photography and listing copy',
      'Multi-channel placement based on category',
      'Buyer questions, payments, and pickup coordination',
      'Settlement statement after sale completion',
    ],
  },
  {
    slug: 'placement',
    name: 'High-value placement',
    bestFor: 'Jewelry, watches, art, antiques, designer goods, rare collectibles.',
    summary: 'For items that benefit from specialist review and category-specific channels rather than a generic estate listing.',
    included: [
      'Specialist review of category-specific items',
      'Authentication coordination where warranted',
      'Channel selection by item, not by estate',
      'Reserve strategy with seller approval',
      'Documented condition and provenance notes',
    ],
  },
  {
    slug: 'buyout',
    name: 'Estate buyout option',
    bestFor: 'Speed, privacy, certainty, and simplified disposition.',
    summary: 'A walkthrough-based offer for the estate or a defined scope. Useful when timing or privacy outweighs maximum recovery.',
    included: [
      'Walkthrough and category review',
      'Buyout offer or hybrid offer with consigned items',
      'Contract, pickup, and chain-of-custody documentation',
      'Final settlement after review',
    ],
  },
  {
    slug: 'hybrid',
    name: 'Hybrid liquidation plan',
    bestFor: 'Mixed estates needing specialist placement plus local sale or clearout.',
    summary: 'Combine high-value placement, managed auction, and cleanout into one coordinated plan with segmented reporting.',
    included: [
      'Combined channel strategy',
      'Segmented inventory by treatment path',
      'Coordinated cleanout for non-sale items',
      'Itemized settlement across paths',
    ],
  },
  {
    slug: 'cleanout',
    name: 'Cleanout & disposition coordination',
    bestFor: 'Donation, disposal, haul-away, property-ready turnover.',
    summary: 'Coordinated cleanout for items remaining after sale, with documented donation receipts and disposal logs.',
    included: [
      'Crew coordination and scheduling',
      'Donation logistics and receipts',
      'Documented disposal where required',
      'Broom-clean handoff for property turnover',
    ],
  },
  {
    slug: 'partners',
    name: 'Partner referral program',
    bestFor: 'Realtors, attorneys, fiduciaries, senior move managers, organizers, property pros.',
    summary: 'A discreet estate-disposition resource for client situations that require inventory, valuation, sale coordination, and itemized reporting.',
    included: [
      'Fast intake and acknowledgement',
      'Transparent process and shared updates',
      'Referral tracking and reporting',
      'Estate-ready documentation for downstream needs',
    ],
  },
]

export default function ServicesPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Services"
        title={<>One estate. Multiple paths. One careful partner.</>}
        intro={<>Different estates need different paths. We start with a walkthrough and recommend the strategy that fits the property, the timeline, and the item categories. You approve before any work begins.</>}
      />

      <Section surface="parchment">
        <div style={{ borderTop: '1px solid #E5DECF' }}>
          {SERVICES.map(svc => (
            <article
              key={svc.slug}
              id={svc.slug}
              className="scroll-mt-24 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
              style={{ borderBottom: '1px solid #E5DECF' }}
            >
              <div className="md:col-span-4">
                <span className="brass-rule mb-5 block" aria-hidden />
                <h2 className="display-md max-w-[14ch]">{svc.name}</h2>
                <span className="label mt-5 block">Best for</span>
                <p className="body-light mt-1">{svc.bestFor}</p>
              </div>
              <div className="md:col-span-8">
                <p className="lede mb-6 max-w-[58ch]">{svc.summary}</p>
                <span className="label block mb-3">Included</span>
                <ul style={{ borderTop: '1px solid #E5DECF' }}>
                  {svc.included.map(d => (
                    <li key={d} className="py-4 flex items-start gap-4" style={{ borderBottom: '1px solid #E5DECF' }}>
                      <span className="brass-rule mt-3 flex-shrink-0" aria-hidden style={{ width: 18 }} />
                      <span className="body-warm" style={{ fontSize: 15 }}>{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/request-walkthrough" className="btn btn-primary">Request a private review</Link>
                  <Link href="/pricing" className="btn btn-outline">See pricing</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTABanner
        heading="Not sure which path fits?"
        body="Start with a private walkthrough. We will recommend the right service mix for the estate and walk you through expected costs."
        secondaryHref="/how-it-works"
        secondaryLabel="See how it works"
      />
    </PublicShell>
  )
}
