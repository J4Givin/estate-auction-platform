import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Contact Estate Liquidity',
  description:
    'Talk to our team about a property, timeline, or item category. Free walkthroughs in Los Angeles and surrounding markets.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Contact"
        title={<>Talk to a person<br/>who gets it.</>}
        intro={<>Tell us what you are working through. We will review the property, timeline, and item categories, then follow up with the best path forward — no obligation, no immediate account creation.</>}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <span className="label block mb-5">Reach us</span>
            <h2 className="text-[24px] md:text-[28px] leading-tight"
                style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
              We respond within one business day.
            </h2>

            <div className="mt-8 border-t border-[#E5DECF]">
              {[
                ['Service area', 'Los Angeles and surrounding markets.'],
                ['Intake', <>Use the <Link href="/request-walkthrough" className="underline decoration-[#9A7A3C] underline-offset-4">walkthrough request form</Link>. We read every request within one business day.</>],
                ['Phone', 'Direct line shared after first contact.'],
                ['Hours', 'Mon–Fri, 9am–6pm Pacific. Saturdays by appointment.'],
              ].map(([t, b], i) => (
                <div key={i} className="border-b border-[#E5DECF] py-5">
                  <p className="label text-[#706A60] mb-1.5">{t}</p>
                  <p className="text-[16px]" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{b}</p>
                </div>
              ))}
            </div>

            <p className="label text-[#706A60] mt-8 leading-relaxed max-w-md">
              For urgent move-out deadlines or sensitive estate situations, mention the timeline in your request and we will prioritize follow-up.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="border border-[#E5DECF] p-8 md:p-12 bg-white">
              <span className="label block mb-5">Preferred path</span>
              <h3 className="text-[24px] md:text-[28px] mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                Request a Free Estate Walkthrough
              </h3>
              <p className="body-light mb-6 leading-relaxed">
                Our walkthrough request form captures the details we need — property, timeline, item categories, role — so the first call is useful from the first minute.
              </p>
              <Link href="/request-walkthrough" className="btn btn-ink">Open the request form →</Link>

              <div className="mt-10 border-t border-[#E5DECF] pt-8">
                <span className="label block mb-3">Are you a partner?</span>
                <p className="body-light mb-5 leading-relaxed">
                  Realtors, attorneys, fiduciaries, and senior move managers can submit a referral or learn about the partner program.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/partners" className="btn btn-outline">Refer an estate</Link>
                  <Link href="/partners#program" className="btn btn-outline">Become a partner</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <CTABanner heading="Prefer to start with a request?" body="The walkthrough form is the fastest way to begin. We will follow up with next steps." />
    </PublicShell>
  )
}
