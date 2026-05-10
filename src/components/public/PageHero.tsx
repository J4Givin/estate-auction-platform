import { ReactNode } from 'react'

export function PageHero({ eyebrow, title, intro, accent }: { eyebrow: string; title: ReactNode; intro?: ReactNode; accent?: string }) {
  return (
    <section className="bg-white border-b border-[#E0E0E0]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent ?? '#826DEE' }} aria-hidden />
          <span className="label">{eyebrow}</span>
        </div>
        <h1 className="text-[#0A0A0A] max-w-[20ch]"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}>
          {title}
        </h1>
        {intro && (
          <div className="mt-8 md:mt-10 max-w-3xl text-[17px] md:text-[19px] text-[#3a3a3a] leading-relaxed"
               style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
            {intro}
          </div>
        )}
      </div>
    </section>
  )
}

export function Section({ children, dark = false, className = '', id }: { children: ReactNode; dark?: boolean; className?: string; id?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-28 lg:py-36 ${dark ? 'bg-[#0A0A0A] text-white' : 'bg-white'} ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24">{children}</div>
    </section>
  )
}

export function CTABanner({ heading, body, primaryHref = '/request-walkthrough', primaryLabel = 'Book a Free Estate Evaluation →', secondaryHref, secondaryLabel }: { heading: string; body?: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string }) {
  return (
    <section className="bg-[#826DEE]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
        <div className="md:col-span-7">
          <h2 className="display-lg text-white max-w-[18ch]">{heading}</h2>
        </div>
        <div className="md:col-span-5 flex flex-col gap-5">
          {body && (
            <p className="text-white/85 text-[17px] leading-relaxed"
               style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
              {body}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={primaryHref} data-cta="cta-banner-primary" className="btn btn-yellow">{primaryLabel}</a>
            {secondaryHref && secondaryLabel && (
              <a href={secondaryHref} data-cta="cta-banner-secondary" className="btn btn-outline-white">{secondaryLabel}</a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
