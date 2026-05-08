import Link from 'next/link'

const COLS: { title: string; links: { l: string; href: string }[] }[] = [
  {
    title: 'Services',
    links: [
      { l: 'Managed Estate Auction', href: '/services#managed' },
      { l: 'High-Value Placement', href: '/services#placement' },
      { l: 'Estate Buyout', href: '/services#buyout' },
      { l: 'Hybrid Plan', href: '/services#hybrid' },
      { l: 'Cleanout Coordination', href: '/services#cleanout' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { l: 'How It Works', href: '/how-it-works' },
      { l: 'Authentication & Appraisals', href: '/authentication' },
      { l: 'Example Sale Scenarios', href: '/scenarios' },
      { l: 'Pricing & Fees', href: '/pricing' },
      { l: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'For Partners',
    links: [
      { l: 'Families & Executors', href: '/for/families' },
      { l: 'Realtors', href: '/for/realtors' },
      { l: 'Attorneys & Fiduciaries', href: '/for/attorneys' },
      { l: 'Refer an Estate', href: '/partners' },
      { l: 'Partner Portal', href: '/partner' },
    ],
  },
  {
    title: 'Company',
    links: [
      { l: 'About', href: '/about' },
      { l: 'Contact', href: '/contact' },
      { l: 'Request Walkthrough', href: '/request-walkthrough' },
      { l: 'Client Portal', href: '/portal' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-20 md:pt-28 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <span className="label text-white/50 block mb-5">Estate Liquidity</span>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs"
               style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
              A modern estate liquidation and asset-disposition partner for families, executors, fiduciaries, and real estate professionals.
            </p>
            <p className="label text-white/40">Los Angeles, California</p>
          </div>
          {COLS.map(col => (
            <div key={col.title}>
              <span className="label text-white/50 block mb-5">{col.title}</span>
              <ul className="flex flex-col gap-3">
                {col.links.map(lk => (
                  <li key={lk.l}>
                    <Link href={lk.href}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                      style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>
                      {lk.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="label text-white/40">© {new Date().getFullYear()} Estate Liquidity</span>
            <Link href="/legal/privacy" className="label text-white/40 hover:text-white/70">Privacy</Link>
            <Link href="/legal/terms" className="label text-white/40 hover:text-white/70">Terms</Link>
            <Link href="/legal/seller-agreement" className="label text-white/40 hover:text-white/70">Seller Agreement</Link>
            <Link href="/legal/buyer-terms" className="label text-white/40 hover:text-white/70">Buyer Terms</Link>
            <Link href="/legal/fee-disclosure" className="label text-white/40 hover:text-white/70">Fee Disclosure</Link>
          </div>
          <span className="label text-white/30">Estimates and appraisal indications are not a guarantee of value.</span>
        </div>
      </div>
    </footer>
  )
}
