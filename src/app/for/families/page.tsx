import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'For Families & Executors',
  description:
    'Estate liquidation for families, heirs, and executors. Inventory, appraisal, authentication, multi-channel sale, and itemized settlement.',
  alternates: { canonical: '/for/families' },
}

export default function ForFamiliesPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="For Families & Executors"
        title={<>A calmer path<br/>through a hard moment.</>}
        intro={<>When you are responsible for clearing a parent&apos;s home, an inherited property, or a downsizing move, the items can feel overwhelming. We bring structure, documentation, and the right channels — so the family conversation can be about decisions, not chaos.</>}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <span className="label block mb-5">What we handle</span>
            <h2 className="display-lg max-w-[14ch]">From walkthrough to final report.</h2>
            <p className="body-light mt-6 max-w-md leading-relaxed">
              We document each item, identify what may warrant specialist review, route items to the channels that fit, and produce an itemized settlement statement that family members and attorneys can rely on.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/request-walkthrough" className="btn btn-ink">Request a walkthrough →</Link>
              <Link href="/how-it-works" className="btn btn-outline">See process</Link>
            </div>
          </div>
          <div className="border-t border-[#E0E0E0]">
            {[
              ['Probate-ready records', 'Itemized inventory, settlement statements, and sale records suitable for legal review.'],
              ['Sentimental items respected', 'Items you want to keep are flagged and never listed.'],
              ['Coordinated cleanout', 'Donation receipts and disposal logs, with a broom-clean handoff.'],
              ['One point of contact', 'A single contact for the family, with shared status updates.'],
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
        <span className="label block mb-5">Common situations</span>
        <h2 className="display-lg max-w-[18ch]">We have seen variations of this before.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12 border-t border-[#E0E0E0]">
          {[
            { t: 'Parent has passed', b: 'Probate is in motion. The home needs to be cleared and the estate accounted for.' },
            { t: 'Move to assisted living', b: 'Decisions need to be made quickly, with sensitivity, and many items will not move with them.' },
            { t: 'Long-distance estate', b: 'You live far from the property and need a partner who documents everything.' },
          ].map(x => (
            <div key={x.t} className="border-b border-[#E0E0E0] md:border-r last:border-r-0 px-0 md:px-8 py-10">
              <h3 className="text-[20px] md:text-[22px] mb-3" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{x.t}</h3>
              <p className="body-light leading-relaxed">{x.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTABanner heading="Ready for a clearer path?" body="Start with a free walkthrough. We will outline what we recommend and what to expect." />
    </PublicShell>
  )
}
