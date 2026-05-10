import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'For Realtors',
  description:
    'A reliable estate liquidation partner for realtors. Faster client closings, less staging stress, itemized reporting.',
  alternates: { canonical: '/for/realtors' },
}

export default function ForRealtorsPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="For Realtors"
        title={<>Less estate friction.<br/>Faster property turnover.</>}
        intro={<>Estate clearance often slows down deals. We coordinate inventory, valuation, sale, and cleanout — so you can focus on the listing, the showings, and the close.</>}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <span className="label block mb-5">Why partner with us</span>
            <h2 className="display-lg max-w-[14ch]">A clean path to the close.</h2>
            <p className="body-light mt-6 max-w-md leading-relaxed">
              We document each item, route to appropriate channels, and coordinate broom-clean handoff. Your clients get a real settlement statement; you get a property ready to show.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/partners" className="btn btn-ink">Refer a client →</Link>
              <Link href="/request-walkthrough" className="btn btn-outline">Request a walkthrough</Link>
            </div>
          </div>
          <div className="md:col-span-7 border-t border-[#E5DECF]">
            {[
              ['Coordinated walkthrough', 'On your timeline, with a single contact for the family.'],
              ['Sentimental & excluded items', 'Flagged and not listed, so nothing is lost in the rush.'],
              ['Cleanout and turnover', 'Donations, disposal, and broom-clean handoff documented.'],
              ['Shared status updates', 'You see progress without becoming the middle of every email thread.'],
              ['Documented settlement', 'Itemized statement family and attorney can use.'],
            ].map(([t, b]) => (
              <div key={t} className="border-b border-[#E5DECF] py-5">
                <p className="text-[16px] mb-1" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{t}</p>
                <p className="body-light text-[14px]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTABanner heading="Have a listing that needs estate clearance?" body="Refer the client and we will follow up to coordinate a walkthrough." secondaryHref="/partner" secondaryLabel="Open Partner Portal" />
    </PublicShell>
  )
}
