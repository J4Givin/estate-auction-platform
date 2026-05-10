import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description:
    'Twenty common questions about estate liquidation, appraisal, authentication, fees, and settlement.',
  alternates: { canonical: '/faq' },
}

const FAQS: { q: string; a: string }[] = [
  { q: 'What types of estates do you handle?', a: 'Single-family homes, condos, townhouses, larger estates, storage units, and certain commercial properties. We work with families, executors, trustees, fiduciaries, and real estate professionals.' },
  { q: 'Do you come to the property?', a: 'Yes. We begin with a free estate walkthrough to assess the property, timeline, item categories, and access needs before recommending a path forward.' },
  { q: 'Do I need to know what my items are worth first?', a: 'No. Identifying value is part of our work. We document items, flag what may warrant specialist review, and propose estimates and reserves before publication.' },
  { q: 'What items do you accept?', a: 'Furniture, jewelry, watches, art, antiques, designer goods, silver and china, collectibles, books and media, household goods, tools, and certain vehicles. Some items go to specialist channels rather than estate sale.' },
  { q: 'What items do you not accept?', a: 'Hazardous materials, expired or perishable goods, items prohibited by law, items without clear ownership, and items that cannot be safely transported. We disclose any exclusions during the walkthrough.' },
  { q: 'How do you determine value?', a: 'We use comparable sales research, category specialist input where warranted, and channel-specific demand. For items requiring more, we coordinate authentication or formal appraisal.' },
  { q: 'Do all items receive a formal appraisal?', a: 'No. General household items often receive a market-based estimate. Higher-value or legally sensitive items may require specialist review, third-party authentication, or a formal appraisal report depending on purpose, category, and risk.' },
  { q: 'How do you authenticate jewelry, art, watches, antiques, and designer goods?', a: 'Each category has its own framework: hallmark and metal review for jewelry, serial and reference checks for watches, attribution and provenance for art, maker marks and period research for antiques, and partner authenticators for designer goods.' },
  { q: 'Who sets the reserve price?', a: 'Reserves are recommended by us based on category and comparable sales, then approved by you before publication. Items that warrant a floor get a documented reserve.' },
  { q: 'Can I approve items before they go live?', a: 'Yes. You review key items, suggested estimates, reserves, and channel before publication. Items can be held or withdrawn before they go live.' },
  { q: 'What happens if an item does not sell?', a: 'Unsold items are reviewed for re-list at a revised reserve, alternative channels, donation with documented receipt, or coordinated disposal — always with your approval.' },
  { q: 'How long does the process take?', a: 'Timelines vary with estate size, item categories, and channel selection. After the walkthrough we share an expected timeline along with the recommended strategy.' },
  { q: 'When do I get paid?', a: 'You receive an itemized settlement statement after sale completion, buyer payment confirmation, and pickup or shipping confirmation. Net proceeds follow on the schedule outlined in your engagement.' },
  { q: 'Are buyers allowed inside the home?', a: 'Where the strategy includes an on-site sale, buyer access is scheduled, supervised, and disclosed in advance. Many estates do not require open buyer access — items are photographed, listed, and shipped or picked up.' },
  { q: 'Who handles pickup and shipping?', a: 'We coordinate pickup and shipping based on item category, value, and buyer location. Chain of custody is documented from intake to handoff.' },
  { q: 'Are items insured?', a: 'Items in our possession are handled with care under documented chain of custody. Insurance scope and limits are disclosed in your engagement, and high-value items may have additional coverage requirements.' },
  { q: 'Do you work with realtors, attorneys, trustees, and fiduciaries?', a: 'Yes. Our partner program supports realtors, probate and trust attorneys, fiduciaries, senior move managers, organizers, and property professionals with fast intake and itemized reporting.' },
  { q: 'Do you offer estate buyouts?', a: 'Yes. A buyout is a walkthrough-based offer that prioritizes speed, privacy, and certainty. It can also be combined with consigned items in a hybrid plan.' },
  { q: 'Can you handle urgent move-out deadlines?', a: 'In many cases, yes. Tight timelines may shift the recommended path toward buyout or hybrid plans, with documented expectations and trade-offs.' },
  { q: 'How do I get started?', a: 'Submit a request for a free walkthrough. We will review the situation, recommend the best disposition path, and follow up with clear next steps.' },
]

export default function FAQPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <PublicShell>
      <PageHero
        eyebrow="Frequently asked"
        title={<>Clear answers, before you call.</>}
        intro={<>Twenty common questions about estate liquidation, authentication, appraisal, fees, and settlement. Still have questions? We are happy to talk.</>}
      />

      <Section surface="parchment">
        <div style={{ borderTop: '1px solid #E5DECF' }}>
          {FAQS.map((f, i) => (
            <details key={f.q} className="group" style={{ borderBottom: '1px solid #E5DECF' }}>
              <summary className="cursor-pointer list-none py-7 md:py-8 flex items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <span style={{
                    fontFamily: 'var(--font-display-family)',
                    fontStyle: 'italic', fontWeight: 400, fontSize: 18,
                    color: '#9A7A3C', lineHeight: 1, marginTop: 6, width: 28, flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-display-family)',
                    fontWeight: 400, fontSize: 21, lineHeight: 1.25,
                    letterSpacing: '-0.012em', color: '#1E1B17',
                  }}>
                    {f.q}
                  </p>
                </div>
                <span className="transition-transform group-open:rotate-45 mt-1" aria-hidden style={{ fontFamily: 'var(--font-body-family)', fontSize: 18, color: '#9A7A3C' }}>+</span>
              </summary>
              <div className="pl-14 pr-4 pb-7">
                <p className="body-warm leading-relaxed max-w-3xl">
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/request-walkthrough" className="btn btn-primary">Request a private review</Link>
          <Link href="/contact" className="btn btn-outline">Speak with an advisor</Link>
        </div>
      </Section>

      <CTABanner heading="Ready to begin?" body="Tell us about the estate. We will read the situation within one business day and follow up with clear next steps." />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </PublicShell>
  )
}
