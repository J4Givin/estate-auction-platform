import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Services — Estate Auction, Appraisal, Buyout, Cleanout',
  description:
    'Managed estate auction, selective high-value placement, estate buyout, hybrid liquidation, cleanout coordination, and partner referrals.',
  alternates: { canonical: '/services' },
}

const SERVICES = [
  {
    slug: 'managed',
    name: 'Managed Estate Auction',
    color: '#826DEE',
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
    name: 'Selective High-Value Placement',
    color: '#FFDB15',
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
    name: 'Estate Buyout Option',
    color: '#F94500',
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
    name: 'Hybrid Liquidation Plan',
    color: '#FF99DC',
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
    name: 'Cleanout & Disposition Coordination',
    color: '#0A0A0A',
    bestFor: 'Donation, disposal, haul-away, property-ready turnover.',
    summary: 'Coordinated cleanout for the items remaining after sale, with documented donation receipts and disposal logs.',
    included: [
      'Crew coordination and scheduling',
      'Donation logistics and receipts',
      'Documented disposal where required',
      'Broom-clean handoff for property turnover',
    ],
  },
  {
    slug: 'partners',
    name: 'Partner Referral Program',
    color: '#826DEE',
    bestFor: 'Realtors, attorneys, fiduciaries, senior move managers, organizers, property pros.',
    summary: 'A reliable estate-disposition resource for client situations that require inventory, valuation, sale coordination, and itemized reporting.',
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
        title={<>One Estate.<br/>Multiple Paths.<br/>One Partner.</>}
        intro={<>Different estates need different paths. We start with a walkthrough and recommend the strategy that fits the property, timeline, and item categories. You approve before any work begins.</>}
      />

      <Section>
        <div className="border-t border-[#E0E0E0]">
          {SERVICES.map(svc => (
            <article key={svc.slug} id={svc.slug} className="scroll-mt-24 border-b border-[#E0E0E0] py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4">
                <span className="block w-7 h-1 mb-5" style={{ background: svc.color }} aria-hidden />
                <h2 className="text-[28px] md:text-[36px] leading-tight"
                    style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                  {svc.name}
                </h2>
                <p className="label text-[#6B6B6B] mt-4">Best for</p>
                <p className="body-light mt-1">{svc.bestFor}</p>
              </div>
              <div className="md:col-span-8">
                <p className="text-[17px] md:text-[19px] text-[#3a3a3a] leading-relaxed mb-6"
                   style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
                  {svc.summary}
                </p>
                <p className="label text-[#6B6B6B] mb-3">Included</p>
                <ul className="border-t border-[#E0E0E0]">
                  {svc.included.map(d => (
                    <li key={d} className="border-b border-[#E0E0E0] py-4 flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: svc.color }} aria-hidden />
                      <span className="body-light text-[15px] text-[#0A0A0A]">{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/request-walkthrough" className="btn btn-ink">Request review</Link>
                  <Link href="/pricing" className="btn btn-outline">See pricing</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTABanner
        heading="Not sure which path fits?"
        body="Start with a free walkthrough. We will recommend the right service mix for the estate and walk you through expected costs."
        secondaryHref="/how-it-works"
        secondaryLabel="See How It Works"
      />
    </PublicShell>
  )
}
