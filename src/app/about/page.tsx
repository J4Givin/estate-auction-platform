import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'About Estate Liquidity',
  description:
    'A modern estate liquidation and asset-disposition partner for families, executors, fiduciaries, and real estate professionals in Los Angeles.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="About"
        title={<>A calmer way<br/>to handle an estate.</>}
        intro={<>Estate Liquidity is a Los Angeles-based estate liquidation and asset-disposition partner. We help families, executors, trustees, fiduciaries, and real estate professionals inventory, appraise, authenticate, sell, and settle estate assets through the right channels — with itemized reporting from intake to payout.</>}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <span className="label block mb-5">What we do</span>
            <h2 className="display-lg max-w-[16ch]">Inventory, appraisal, authentication, sale, settlement.</h2>
            <p className="body-light mt-6 max-w-md leading-relaxed">
              We exist because estate work is rarely just about selling things. It is about time, family pressure, legal responsibility, memories, and the fear of leaving money on the table. We bring structure, documentation, and the right channels to a process that often runs without either.
            </p>
          </div>
          <div className="border-t border-[#E0E0E0]">
            {[
              ['Service area', 'Los Angeles and surrounding markets.'],
              ['Categories', 'Furniture, jewelry, watches, art, antiques, designer goods, household, collectibles.'],
              ['Standards', 'Documented chain of custody, seller approvals, itemized settlement, careful authentication limits.'],
              ['How we differ', 'We are not a single-channel auction house, generic estate sale company, consignment shop, or marketplace. We route each item to the path that fits.'],
            ].map(([t, b]) => (
              <div key={t} className="border-b border-[#E0E0E0] py-5">
                <p className="text-[16px] mb-1" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{t}</p>
                <p className="body-light text-[14px]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-[#F5F5F5]">
        <span className="label block mb-5">How we work</span>
        <h2 className="display-lg max-w-[18ch]">Documented from first walkthrough to final report.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12 border-t border-[#E0E0E0]">
          {[
            { t: 'Calm and discreet', b: 'We do not publish estate names or client details. Privacy is a default, not an upgrade.' },
            { t: 'Specialist where it matters', b: 'Specialists review the categories that warrant it: jewelry, watches, art, antiques, designer goods.' },
            { t: 'Approval before publication', b: 'You see suggested estimates, reserves, and channels before any item goes live.' },
          ].map(x => (
            <div key={x.t} className="border-b border-[#E0E0E0] md:border-r last:border-r-0 px-0 md:px-8 py-10">
              <h3 className="text-[20px] md:text-[22px] mb-3" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{x.t}</h3>
              <p className="body-light leading-relaxed">{x.b}</p>
            </div>
          ))}
        </div>
        <p className="label text-[#6B6B6B] mt-10 max-w-3xl leading-relaxed">
          Estimates and appraisal indications are not a guarantee of value. We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed.
        </p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          <div>
            <span className="label block mb-5">Get in touch</span>
            <h2 className="display-lg max-w-[14ch]">Start with a free walkthrough.</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <Link href="/request-walkthrough" className="btn btn-ink">Book a Free Evaluation →</Link>
            <Link href="/contact" className="btn btn-outline">Contact</Link>
          </div>
        </div>
      </Section>

      <CTABanner heading="Ready to begin?" body="Tell us about the estate. We will review and follow up with clear next steps." />
    </PublicShell>
  )
}
