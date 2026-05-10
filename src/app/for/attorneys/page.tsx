import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'For Attorneys & Fiduciaries',
  description:
    'Estate liquidation for probate and trust attorneys, fiduciaries, and trustees. Documented chain of custody, court-ready records.',
  alternates: { canonical: '/for/attorneys' },
}

export default function ForAttorneysPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="For Attorneys & Fiduciaries"
        title={<>Documented disposition,<br/>defensible records.</>}
        intro={<>For probate and trust attorneys, fiduciaries, and trustees, the issue is rarely the sale — it is the documentation. We provide itemized inventories, seller approvals, settlement statements, and unsold disposition records suitable for court and beneficiary review.</>}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <span className="label block mb-5">Built for the role</span>
            <h2 className="display-lg max-w-[14ch]">Records you can defend.</h2>
            <p className="body-light mt-6 max-w-md leading-relaxed">
              We document chain of custody from intake to handoff, log seller approvals, and produce itemized settlement statements — the kind of records you would want in a beneficiary review.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/partners" className="btn btn-ink">Refer an estate →</Link>
              <Link href="/contact" className="btn btn-outline">Talk to us</Link>
            </div>
          </div>
          <div className="md:col-span-7 border-t border-[#E5DECF]">
            {[
              ['Itemized inventory', 'Each item tracked from intake to payout with photos and condition notes.'],
              ['Documented approvals', 'Seller decisions logged before publication.'],
              ['Authentication limits', 'We tell you what we can and cannot confirm. We do not guarantee authenticity unless formally authenticated.'],
              ['Reserves and unsold disposition', 'Floors set with seller approval. Unsold items dispositioned per direction with documentation.'],
              ['Settlement statement', 'Itemized record of sale prices, fees, net proceeds, and payouts.'],
            ].map(([t, b]) => (
              <div key={t} className="border-b border-[#E5DECF] py-5">
                <p className="text-[16px] mb-1" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{t}</p>
                <p className="body-light text-[14px]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-[#F6F1E8]">
        <span className="label block mb-5">Disclosure</span>
        <p className="body-light max-w-3xl leading-relaxed">
          Estate Liquidity is not a law firm and does not provide legal advice. Estimates and appraisal indications are not a guarantee of value. We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed.
        </p>
      </Section>

      <CTABanner heading="Have an estate that needs documented disposition?" body="Refer the client and we will follow up to coordinate." secondaryHref="/partner" secondaryLabel="Open Partner Portal" />
    </PublicShell>
  )
}
