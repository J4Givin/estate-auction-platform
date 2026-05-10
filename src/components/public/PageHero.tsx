import { ReactNode } from 'react'

/**
 * PageHero — calm advisory hero used across supporting pages.
 * Editorial serif H1 in title/sentence case, eyebrow as small label,
 * lede paragraph beneath. Sits on warm parchment, not stark white.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  accent,
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  accent?: string
}) {
  return (
    <section style={{ background: '#FBF8F1', borderBottom: '1px solid #E5DECF' }}>
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-12 md:pt-20 pb-14 md:pb-24">
        <div className="flex items-center gap-3 mb-7">
          <span className="brass-rule" style={{ background: accent ?? '#9A7A3C' }} aria-hidden />
          <span className="label">{eyebrow}</span>
        </div>
        <h1 className="display-xl hero-h1 max-w-[22ch]">
          {title}
        </h1>
        {intro && (
          <div className="mt-7 md:mt-9 lede max-w-[62ch]">
            {intro}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Section — calm spacing wrapper. Default surface is parchment; pass dark
 * to invert into the deep charcoal authentication-style section.
 */
export function Section({
  children,
  dark = false,
  surface,
  className = '',
  id,
}: {
  children: ReactNode
  dark?: boolean
  surface?: 'ivory' | 'parchment' | 'white' | 'stone' | 'charcoal' | 'olive'
  className?: string
  id?: string
}) {
  const surfaceMap: Record<string, { bg: string; color: string }> = {
    ivory:     { bg: '#F6F1E8', color: '#1E1B17' },
    parchment: { bg: '#FBF8F1', color: '#1E1B17' },
    white:     { bg: '#FFFFFF', color: '#1E1B17' },
    stone:     { bg: '#EFE9DC', color: '#1E1B17' },
    charcoal:  { bg: '#1E1B17', color: '#FBF8F1' },
    olive:     { bg: '#343B2F', color: '#FBF8F1' },
  }
  const s = surface
    ? surfaceMap[surface]
    : dark
      ? surfaceMap.charcoal
      : surfaceMap.parchment
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-20 md:py-28 lg:py-32 ${className}`}
      style={{ background: s.bg, color: s.color }}
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">{children}</div>
    </section>
  )
}

/**
 * CTABanner — calm advisory closer. Replaces prior loud purple slab
 * with a warm charcoal panel, brass detail rule, and concierge copy.
 */
export function CTABanner({
  heading,
  body,
  primaryHref = '/request-walkthrough',
  primaryLabel = 'Request a private estate review',
  secondaryHref,
  secondaryLabel,
}: {
  heading: string
  body?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  return (
    <section style={{ background: '#1E1B17', color: '#FBF8F1' }}>
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-end">
        <div className="md:col-span-7">
          <span className="brass-rule mb-5" aria-hidden />
          <h2 className="heading-advisory-dark max-w-[22ch] mt-4">{heading}</h2>
        </div>
        <div className="md:col-span-5 flex flex-col gap-6">
          {body && (
            <p
              style={{
                fontFamily: 'var(--font-body-family)',
                fontWeight: 400, fontSize: 16, lineHeight: 1.7,
                color: 'rgba(251,248,241,0.8)',
              }}
            >
              {body}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={primaryHref} data-cta="cta-banner-primary" className="btn btn-brass">
              {primaryLabel}
            </a>
            {secondaryHref && secondaryLabel && (
              <a href={secondaryHref} data-cta="cta-banner-secondary" className="btn btn-outline-white">
                {secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
