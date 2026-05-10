import type { Metadata } from 'next'
import { PublicShell } from '@/components/public/PublicShell'
import { RequestWalkthroughForm } from './RequestWalkthroughForm'

export const metadata: Metadata = {
  title: 'Request a private estate review',
  description:
    'Tell us about the estate. We will review the situation and recommend the right disposition path — no obligation, no immediate account creation.',
  alternates: { canonical: '/request-walkthrough' },
  robots: { index: true, follow: true },
}

export default function RequestWalkthroughPage() {
  return (
    <PublicShell>
      <section style={{ background: '#FBF8F1' }}>
        <div
          className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pb-14 md:pb-20"
          style={{ paddingTop: 'clamp(2rem, 5vw, 5.5rem)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left rail — concierge intake context */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="brass-rule" aria-hidden />
                <span className="label">Estate walkthrough · By appointment</span>
              </div>

              <h1 className="display-xl hero-h1 max-w-[18ch]" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}>
                Request a private estate review.
              </h1>

              <p className="mt-6 sm:mt-8 lede max-w-md">
                Tell us what you are working through. We will read the situation within one business day, recommend a path, and follow up to schedule a private walkthrough — at no cost and no obligation.
              </p>

              <div className="mt-9" style={{ borderTop: '1px solid #E5DECF' }}>
                {[
                  ['No obligation', 'We read the situation and recommend a path. You decide what comes next.'],
                  ['No account required', 'You will not be asked to create an account before we have spoken.'],
                  ['Itemized reporting', 'If you proceed, you see every item, every approval, every sale, fee, and payout.'],
                  ['Discreet & private', 'We do not publish estate names or client details.'],
                ].map(([t, b]) => (
                  <div key={t} className="py-5 flex items-start gap-4" style={{ borderBottom: '1px solid #E5DECF' }}>
                    <span className="brass-rule mt-3 flex-shrink-0" aria-hidden style={{ width: 18 }} />
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-body-family)',
                        fontWeight: 600, fontSize: 16, color: '#1E1B17', marginBottom: 4,
                      }}>{t}</p>
                      <p className="body-light text-[14px]">{b}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 hidden lg:block">
                <span className="label">Prefer to talk first?</span>
                <p className="body-warm mt-2 max-w-md leading-relaxed">
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
