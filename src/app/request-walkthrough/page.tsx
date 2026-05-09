import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { RequestWalkthroughForm } from './RequestWalkthroughForm'

export const metadata: Metadata = {
  title: 'Request a Free Estate Walkthrough',
  description:
    'Tell us about the estate. We will review the situation and recommend the best disposition path — no obligation, no immediate account creation.',
  alternates: { canonical: '/request-walkthrough' },
  robots: { index: true, follow: true },
}

export default function RequestWalkthroughPage() {
  return (
    <PublicShell>
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pb-12 md:pb-16"
             style={{ paddingTop: 'clamp(2rem, 5vw, 5.5rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left rail */}
            <div className="lg:col-span-5">
              <span className="label block mb-5 sm:mb-6">Estate Walkthrough</span>
              <h1 className="text-[#0A0A0A] hero-h1"
                  style={{
                    fontFamily: 'var(--font-display-family)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.85rem, 4.6vw, 3.6rem)',
                    lineHeight: 1.04,
                    letterSpacing: '-0.015em',
                    textTransform: 'uppercase',
                  }}>
                Request a Free<br />Estate Walkthrough.
              </h1>

              <p className="mt-6 sm:mt-8 text-[16px] sm:text-[17px] text-[#3a3a3a] leading-relaxed max-w-md"
                 style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
                Tell us what you are working through. We will review the estate, timeline, and item categories, then recommend the best path forward.
              </p>

              <div className="mt-8 sm:mt-10 border-t border-[#E0E0E0]">
                {[
                  ['No obligation', 'We review the situation and recommend a path. You decide what comes next.'],
                  ['No account required', 'You will not be asked to create an account before we have spoken.'],
                  ['Itemized reporting', 'If you proceed, you see every item, approval, sale, fee, and payout.'],
                  ['Discreet & private', 'We do not publish estate names or client details.'],
                ].map(([t, b]) => (
                  <div key={t} className="border-b border-[#E0E0E0] py-4 sm:py-5 flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE] mt-2 flex-shrink-0" aria-hidden />
                    <div>
                      <p className="text-[15px] sm:text-[16px] mb-1" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{t}</p>
                      <p className="body-light text-[13.5px] sm:text-[14px]">{b}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 hidden lg:block">
                <span className="label text-[#6B6B6B]">Prefer to talk first?</span>
                <p className="text-[15px] text-[#0A0A0A] mt-2 leading-relaxed max-w-md"
                   style={{ fontFamily: 'var(--font-body-family)', fontWeight: 400 }}>
                  Use this form for intake — we read every request within one business day and call you to discuss before any walkthrough is scheduled.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <RequestWalkthroughForm />
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
