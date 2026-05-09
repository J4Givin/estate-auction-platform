import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Authentication & Appraisal Framework',
  description:
    'How we tell the difference between a market estimate, an internal catalog review, specialist authentication, and a formal appraisal report.',
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
  { name: 'Watches', notes: 'Serial/reference, movement photos, service history, condition.' },
  { name: 'Art', notes: 'Attribution, medium, edition, provenance, condition, framing.' },
  { name: 'Antiques', notes: 'Period, construction, maker marks, comps, restoration notes.' },
  { name: 'Designer goods', notes: 'Serial codes, stitching/materials, authentication partner.' },
  { name: 'Furniture', notes: 'Maker, age, construction, restoration, market demand.' },
]

export default function AuthenticationPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Authentication & Appraisal"
        title={<>What we know,<br/>what needs review,<br/>what cannot be confirmed.</>}
        intro={<>Not every item requires a formal appraisal. General household items often receive a market-based estimate. Higher-value or legally sensitive items may require specialist review, third-party authentication, or a formal appraisal report depending on purpose, category, and risk.</>}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <span className="label block mb-5">Five Levels</span>
            <h2 className="display-lg max-w-[14ch]">From estimate to formal report.</h2>
            <p className="body-light mt-6 max-w-md leading-relaxed">
              Each item is treated according to its category, value, and intended use. We document which path was used and why.
            </p>
          </div>
          <div className="border-t border-[#E0E0E0]">
            {LEVELS.map(l => (
              <div key={l.n} className="border-b border-[#E0E0E0] py-6 grid grid-cols-12 gap-4">
                <span className="col-span-2 label text-[#826DEE]">{l.n}</span>
                <div className="col-span-10">
                  <p className="text-[17px] mb-2" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{l.name}</p>
                  <p className="body-light leading-relaxed">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section dark>
        <span className="label-dark block mb-5">By Category</span>
        <h2 className="display-lg text-white max-w-[16ch]">Specialist review where it matters.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mt-12 border-t border-white/10">
          {CATEGORIES.map((c, i) => (
            <div key={c.name} className={`border-b border-white/10 px-0 md:px-8 py-10 md:[&:nth-child(3n)]:border-r-0 ${i % 3 < 2 ? 'md:border-r' : ''}`}>
              <h3 className="text-[20px] md:text-[22px] mb-3 text-white"
                  style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                {c.name}
              </h3>
              <p className="body-light text-white/70">{c.notes}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <span className="label block mb-5">Limits & Disclaimers</span>
        <h2 className="display-lg max-w-[18ch]">We tell you what we can — and cannot — confirm.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 max-w-5xl">
          <p className="body-light text-[16px] leading-relaxed">
            We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed. Where authentication has not been performed, items are presented based on documented condition and category notes only.
          </p>
          <p className="body-light text-[16px] leading-relaxed">
            High-risk or high-value items may be held from sale until review is complete. Estimates and appraisal indications are not a guarantee of value. Final outcome depends on condition, provenance, market demand, and sale channel.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/request-walkthrough" className="btn btn-ink">Request a Walkthrough</Link>
          <Link href="/pricing" className="btn btn-outline">See Pricing</Link>
        </div>
      </Section>

      <CTABanner
        heading="Have a category that needs specialist review?"
        body="We will tell you which path fits — market estimate, specialist review, third-party authentication, or formal appraisal."
      />
    </PublicShell>
  )
}
