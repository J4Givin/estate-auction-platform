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
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-12 md:pt-20 pb-12 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left rail */}
            <div className="lg:col-span-5">
              <span className="label block mb-6">Estate Walkthrough</span>
              <h1 className="text-[#0A0A0A]"
                  style={{
                    fontFamily: 'var(--font-display-family)',
                    fontWeight: 900,
                    fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                  }}>
                Request a Free<br />Estate Walkthrough.
              </h1>

              <p className="mt-8 text-[17px] text-[#3a3a3a] leading-relaxed max-w-md"
                 style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
                Tell us what you are working through. We will review the estate, timeline, and item categories, then recommend the best path forward.
              </p>

              <div className="mt-10 border-t border-[#E0E0E0]">
                {[
                  ['No obligation', 'We review the situation and recommend a path. You decide what comes next.'],
                  ['No account required', 'You will not be asked to create an account before we have spoken.'],
                  ['Itemized reporting', 'If you proceed, you see every item, approval, sale, fee, and payout.'],
                  ['Discreet & private', 'We do not publish estate names or client details.'],
                ].map(([t, b]) => (
                  <div key={t} className="border-b border-[#E0E0E0] py-5">
                    <p className="text-[16px] mb-1" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>{t}</p>
                    <p className="body-light text-[14px]">{b}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 hidden lg:block">
                <span className="label text-[#6B6B6B]">Prefer to talk first?</span>
                <p className="text-[15px] text-[#0A0A0A] mt-2"
                   style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                  Email <a href="mailto:hello@example.com" className="underline decoration-[#826DEE] underline-offset-4">hello@example.com</a>
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
