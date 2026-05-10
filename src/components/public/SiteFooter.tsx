import Link from 'next/link'

const COLS: { title: string; links: { l: string; href: string }[] }[] = [
  {
    title: 'Services',
    links: [
      { l: 'Managed estate auction', href: '/services#managed' },
      { l: 'High-value placement', href: '/services#placement' },
      { l: 'Estate buyout', href: '/services#buyout' },
      { l: 'Hybrid plan', href: '/services#hybrid' },
      { l: 'Cleanout coordination', href: '/services#cleanout' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { l: 'How it works', href: '/how-it-works' },
      { l: 'Authentication & appraisals', href: '/authentication' },
      { l: 'Example sale scenarios', href: '/scenarios' },
      { l: 'Pricing & fees', href: '/pricing' },
      { l: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'For partners',
    links: [
      { l: 'Families & executors', href: '/for/families' },
      { l: 'Realtors', href: '/for/realtors' },
      { l: 'Attorneys & fiduciaries', href: '/for/attorneys' },
      { l: 'Refer an estate', href: '/partners' },
      { l: 'Partner portal', href: '/partner' },
    ],
  },
  {
    title: 'Company',
    links: [
      { l: 'About', href: '/about' },
      { l: 'Contact', href: '/contact' },
      { l: 'Request a private review', href: '/request-walkthrough' },
      { l: 'Client portal', href: '/portal' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer style={{ background: '#1E1B17', color: '#FBF8F1' }}>
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-20 md:pt-28 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-4">
            <span className="flex items-center gap-3 mb-7">
              <span
                className="flex items-center justify-center"
                style={{
                  width: 32, height: 32, borderRadius: 6,
                  border: '1px solid rgba(251,248,241,0.25)',
                  background: 'transparent',
                  fontFamily: 'var(--font-display-family)',
                  fontWeight: 500, fontSize: 14, letterSpacing: '-0.02em',
                  color: '#FBF8F1',
                }}
              >EL</span>
              <span style={{
                fontFamily: 'var(--font-display-family)',
                fontWeight: 400, fontSize: 19, letterSpacing: '-0.012em',
                color: '#FBF8F1',
              }}>Estate Liquidity</span>
            </span>
            <p
              className="leading-relaxed mb-6 max-w-sm"
              style={{
                fontFamily: 'var(--font-body-family)',
                fontWeight: 400, fontSize: 14.5, lineHeight: 1.7,
                color: 'rgba(251,248,241,0.66)',
              }}
            >
              An estate-advisory and asset-disposition partner for families, executors, fiduciaries, and real estate professionals. We document each item, recommend the right path, and report from intake to final payout.
            </p>
            <div className="flex flex-col gap-2" style={{ color: 'rgba(251,248,241,0.62)', fontSize: 13.5 }}>
              <span style={{
                fontFamily: 'var(--font-body-family)', fontWeight: 500,
                fontSize: 11, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: '#B89A5A',
              }}>Los Angeles, California</span>
              <span style={{ fontFamily: 'var(--font-body-family)' }}>By appointment only</span>
            </div>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {COLS.map(col => (
              <div key={col.title}>
                <span
                  className="block mb-4"
                  style={{
                    fontFamily: 'var(--font-body-family)',
                    fontWeight: 600, fontSize: 11,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#B89A5A',
                  }}
                >
                  {col.title}
                </span>
                <ul className="flex flex-col">
                  {col.links.map(lk => (
                    <li key={lk.l}>
                      <Link
                        href={lk.href}
                        className="transition-colors flex items-center"
                        style={{
                          fontFamily: 'var(--font-body-family)',
                          fontWeight: 400, fontSize: 14, lineHeight: 1.4,
                          color: 'rgba(251,248,241,0.72)',
                          minHeight: 44, paddingTop: 6, paddingBottom: 6,
                        }}
                      >
                        {lk.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(251,248,241,0.1)' }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: 12, color: 'rgba(251,248,241,0.42)',
            }}>© {new Date().getFullYear()} Estate Liquidity</span>
            <Link href="/legal/privacy" className="inline-flex items-center" style={{ minHeight: 44, fontFamily: 'var(--font-body-family)', fontSize: 12, color: 'rgba(251,248,241,0.5)' }}>Privacy</Link>
            <Link href="/legal/terms" className="inline-flex items-center" style={{ minHeight: 44, fontFamily: 'var(--font-body-family)', fontSize: 12, color: 'rgba(251,248,241,0.5)' }}>Terms</Link>
            <Link href="/legal/seller-agreement" className="inline-flex items-center" style={{ minHeight: 44, fontFamily: 'var(--font-body-family)', fontSize: 12, color: 'rgba(251,248,241,0.5)' }}>Seller agreement</Link>
            <Link href="/legal/buyer-terms" className="inline-flex items-center" style={{ minHeight: 44, fontFamily: 'var(--font-body-family)', fontSize: 12, color: 'rgba(251,248,241,0.5)' }}>Buyer terms</Link>
            <Link href="/legal/fee-disclosure" className="inline-flex items-center" style={{ minHeight: 44, fontFamily: 'var(--font-body-family)', fontSize: 12, color: 'rgba(251,248,241,0.5)' }}>Fee disclosure</Link>
          </div>
          <span style={{
            fontFamily: 'var(--font-body-family)',
            fontSize: 12, color: 'rgba(251,248,241,0.4)',
            fontStyle: 'italic',
          }}>
            Estimates and appraisal indications are not a guarantee of value.
          </span>
        </div>
      </div>
    </footer>
  )
}
