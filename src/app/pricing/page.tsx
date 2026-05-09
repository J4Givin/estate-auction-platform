import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Pricing & How We Get Paid',
  description:
    'Transparent fee categories. No mystery after the sale. Final fees depend on scope, item categories, channels, and required services.',
  alternates: { canonical: '/pricing' },
}

const FEE_CATEGORIES = [
  {
    title: 'Seller Commission',
    body: 'Applied to sold items. Varies by service type and estate scope. The exact percentage is documented in your engagement before any work begins.',
  },
  {
    title: 'Buyer Premium',
    body: 'May apply to auction purchases and is disclosed to buyers before bidding. Buyer premiums are standard practice in the auction industry.',
  },
  {
    title: 'Optional Formal Appraisal',
    body: 'Used when a formal appraisal report is needed for estate, insurance, tax, legal, or high-value purposes. Quoted by scope and intended use.',
  },
  {
    title: 'Optional Transport / Storage / Cleanout',
    body: 'When pickup, secure storage, or cleanout coordination is required, we quote separately based on scope and timeline.',
  },
  {
    title: 'Specialist Authentication',
    body: 'When a category warrants third-party authentication, those fees are disclosed in advance. Some labs charge per item or per category.',
  },
  {
    title: 'Settlement Timing',
    body: 'Itemized settlement statements are issued after sale completion, buyer payment confirmation, and pickup or shipping confirmation.',
  },
]

const FACTORS = [
  'Service type (auction, placement, buyout, hybrid, cleanout)',
  'Estate size and item count',
  'Item categories (jewelry, watches, art, antiques, designer goods, household)',
  'Labor and time on site',
  'Pickup, shipping, and storage requirements',
  'Sale channel(s) selected per item',
  'Specialist authentication when required',
  'Cleanout and disposition coordination when included',
]

export default function PricingPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Pricing & Fees"
        title={<>Transparent fees.<br/>No mystery<br/>after the sale.</>}
        intro={<>Every estate is different. Fees depend on the scope, timeline, item categories, labor requirements, sale channels, and whether specialist authentication, transport, storage, or cleanout coordination is needed. Before work begins, we explain the recommended strategy, expected costs, commission structure, and settlement timeline.</>}
      />

      <Section>
        <span className="label block mb-5">Fee Categories</span>
        <h2 className="display-lg max-w-[18ch]">What you might be charged for, and why.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mt-12 border-t border-[#E0E0E0]">
          {FEE_CATEGORIES.map((f, i) => (
            <div key={f.title} className={`px-0 md:px-8 py-10 md:py-12 border-b border-[#E0E0E0] ${i % 3 < 2 ? 'md:border-r' : ''}`}>
              <h3 className="text-[20px] md:text-[22px] mb-4 leading-snug"
                  style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                {f.title}
              </h3>
              <p className="body-light leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-[#F5F5F5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <span className="label block mb-5">What Affects Your Fee</span>
            <h2 className="display-lg max-w-[16ch]">Eight factors we walk through with you.</h2>
            <p className="body-light mt-6 max-w-md leading-relaxed">
              We do not publish a single percentage because we do not believe in surprise fees later. We discuss each factor with you before any work begins.
            </p>
          </div>
          <div className="border-t border-[#E0E0E0]">
            {FACTORS.map(f => (
              <div key={f} className="border-b border-[#E0E0E0] py-4 flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE] mt-2.5 flex-shrink-0" aria-hidden />
                <span className="body-light text-[15px] text-[#0A0A0A]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="label block mb-5">What You Can Expect</span>
            <h2 className="text-[28px] md:text-[36px] leading-tight"
                style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
              Documented from intake to payout.
            </h2>
            <ul className="border-t border-[#E0E0E0] mt-6">
              {[
                'Recommended strategy in writing before work begins',
                'Approval before publication on every key item',
                'Reserves on items that warrant a floor',
                'Itemized settlement after buyer payment confirms',
                'Unsold disposition documented and approved',
              ].map(t => (
                <li key={t} className="border-b border-[#E0E0E0] py-4 flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE] mt-2.5 flex-shrink-0" aria-hidden />
                  <span className="body-light text-[15px] text-[#0A0A0A]">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#F5F5F5] p-8 md:p-12">
            <span className="label block mb-4">Request a Fee Review</span>
            <h3 className="text-[24px] md:text-[28px] mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
              Get a clear estimate for your estate.
            </h3>
            <p className="body-light mb-6 leading-relaxed">
              Tell us about the property, timeline, and item categories. We will review, recommend a path, and walk through expected costs before any commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/request-walkthrough" className="btn btn-ink">Book a free evaluation →</Link>
              <Link href="/contact" className="btn btn-outline">Talk to us</Link>
            </div>
            <p className="label text-[#6B6B6B] mt-6">
              Estimates and appraisal indications are not a guarantee of value.
            </p>
          </div>
        </div>
      </Section>

      <CTABanner
        heading="Ready for transparent fees?"
        body="We document the recommended strategy and expected costs before any work begins."
        secondaryHref="/legal/fee-disclosure"
        secondaryLabel="Read Fee Disclosure"
      />
    </PublicShell>
  )
}
