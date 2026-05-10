import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Pricing & how we get paid',
  description:
    'Transparent fee categories. No mystery after the sale. Final fees depend on scope, item categories, channels, and required services.',
  alternates: { canonical: '/pricing' },
}

const FEE_CATEGORIES = [
  {
    title: 'Seller commission',
    body: 'Applied to sold items. Varies by service type and estate scope. The exact percentage is documented in your engagement before any work begins.',
  },
  {
    title: 'Buyer premium',
    body: 'May apply to auction purchases and is disclosed to buyers before bidding. Buyer premiums are standard practice in the auction industry.',
  },
  {
    title: 'Optional formal appraisal',
    body: 'Used when a formal appraisal report is needed for estate, insurance, tax, legal, or high-value purposes. Quoted by scope and intended use.',
  },
  {
    title: 'Optional transport / storage / cleanout',
    body: 'When pickup, secure storage, or cleanout coordination is required, we quote separately based on scope and timeline.',
  },
  {
    title: 'Specialist authentication',
    body: 'When a category warrants third-party authentication, those fees are disclosed in advance. Some labs charge per item or per category.',
  },
  {
    title: 'Settlement timing',
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
        eyebrow="Pricing & fees"
        title={<>Transparent fees. No mystery after the sale.</>}
        intro={<>Every estate is different. Fees depend on scope, timeline, item categories, labor, sale channels, and whether specialist authentication, transport, storage, or cleanout coordination is needed. Before work begins, we explain the recommended strategy, expected costs, commission structure, and settlement timeline.</>}
      />

      <Section surface="parchment">
        <span className="brass-rule mb-5 block" aria-hidden />
        <span className="label block mb-4">Fee categories</span>
        <h2 className="heading-advisory max-w-[20ch]">What you might be charged for, and why.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {FEE_CATEGORIES.map(f => (
            <div key={f.title} className="card-advisory h-full">
              <span className="brass-rule mb-4 block" aria-hidden />
              <h3 style={{
                fontFamily: 'var(--font-display-family)',
                fontWeight: 400, fontSize: 21, lineHeight: 1.2,
                letterSpacing: '-0.01em', color: '#1E1B17', marginBottom: 10,
              }}>{f.title}</h3>
              <p className="body-light leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section surface="ivory">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">What affects your fee</span>
            <h2 className="heading-advisory max-w-[16ch]">Eight factors we walk through with you.</h2>
            <p className="body-warm mt-6 max-w-md leading-relaxed">
              We do not publish a single percentage because we do not believe in surprise fees later. We discuss each factor with you before any work begins.
            </p>
          </div>
          <div style={{ borderTop: '1px solid #E5DECF' }}>
            {FACTORS.map(f => (
              <div key={f} className="py-4 flex items-start gap-4" style={{ borderBottom: '1px solid #E5DECF' }}>
                <span className="brass-rule mt-3 flex-shrink-0" aria-hidden style={{ width: 18 }} />
                <span className="body-warm" style={{ fontSize: 15 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section surface="parchment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">What you can expect</span>
            <h2 className="heading-advisory">Documented from intake to payout.</h2>
            <ul className="mt-6" style={{ borderTop: '1px solid #E5DECF' }}>
              {[
                'Recommended strategy in writing before work begins',
                'Approval before publication on every key item',
                'Reserves on items that warrant a floor',
                'Itemized settlement after buyer payment confirms',
                'Unsold disposition documented and approved',
              ].map(t => (
                <li key={t} className="py-4 flex items-start gap-4" style={{ borderBottom: '1px solid #E5DECF' }}>
                  <span className="brass-rule mt-3 flex-shrink-0" aria-hidden style={{ width: 18 }} />
                  <span className="body-warm" style={{ fontSize: 15 }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-soft p-8 md:p-10" style={{ background: '#F6F1E8' }}>
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">Request a fee review</span>
            <h3 className="display-md">Get a clear estimate for your estate.</h3>
            <p className="body-warm mt-5 mb-7 leading-relaxed">
              Tell us about the property, timeline, and item categories. We will review, recommend a path, and walk through expected costs before any commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/request-walkthrough" className="btn btn-primary">Request a private review</Link>
              <Link href="/contact" className="btn btn-outline">Speak with an advisor</Link>
            </div>
            <p className="label mt-6" style={{ fontStyle: 'normal' }}>
              Estimates and appraisal indications are not a guarantee of value.
            </p>
          </div>
        </div>
      </Section>

      <CTABanner
        heading="Ready for transparent fees?"
        body="We document the recommended strategy and expected costs before any work begins."
        secondaryHref="/legal/fee-disclosure"
        secondaryLabel="Read fee disclosure"
      />
    </PublicShell>
  )
}
