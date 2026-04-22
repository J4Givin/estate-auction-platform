'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, ReactNode } from 'react'

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

const PRODUCTS = [
  {
    id: 1,
    name: 'Silver Candelabra',
    period: 'Continental, c. 1890',
    estimate: '$1,800 – $2,600',
    realized: '$3,400',
    img: '/products/silver_candelabra.png',
    label: 'Top Realized',
    labelColor: '#826DEE',
  },
  {
    id: 2,
    name: 'Victorian Wingback Armchair',
    period: 'English, c. 1870',
    estimate: '$1,800 – $2,400',
    realized: '$3,600',
    img: '/products/armchair.png',
    label: 'Most Popular',
    labelColor: '#F94500',
  },
  {
    id: 3,
    name: 'Crystal Candelabra Chandelier',
    period: 'Continental, c. 1920',
    estimate: '$3,200 – $4,800',
    realized: '$6,200',
    img: '/products/chandelier.png',
    label: 'Record Price',
    labelColor: '#FFDB15',
    labelText: '#0A0A0A',
  },
  {
    id: 4,
    name: 'Skeleton Pocket Watch',
    period: 'Swiss, c. 1895',
    estimate: '$800 – $1,200',
    realized: '$2,050',
    img: '/products/watch.png',
    label: 'Top Value',
    labelColor: '#FF99DC',
    labelText: '#0A0A0A',
  },
  {
    id: 5,
    name: 'Scholar\'s Writing Desk',
    period: 'American, c. 1860',
    estimate: '$1,200 – $1,800',
    realized: '$2,800',
    img: '/products/desk.png',
    label: 'Featured',
    labelColor: '#826DEE',
  },
  {
    id: 6,
    name: 'Floral Damask Armchair',
    period: 'French, c. 1900',
    estimate: '$900 – $1,400',
    realized: '$1,950',
    img: '/products/armchair2.png',
    label: 'Sold',
    labelColor: '#0A0A0A',
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#6B6B6B]">Estate</span>
            <span className="w-px h-4 bg-[#E0E0E0]" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#0A0A0A] font-bold">Liquidity</span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Top Sellers', href: '#featured' },
              { label: 'How It Works', href: '#process' },
              { label: 'Partners', href: '#' },
              { label: 'Sign In', href: '/auth/login' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="label text-[#0A0A0A] hover:text-[#826DEE] transition-colors">
                {item.label}
              </Link>
            ))}
            <Link href="/auth/register" className="btn btn-ink py-2.5 px-6 text-[10px]">
              Get Started
            </Link>
          </div>
          <button onClick={() => setMobileMenuOpen(v => !v)} className="md:hidden tap-target" aria-label="Toggle menu">
            <div className="flex flex-col gap-[5px]">
              <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </div>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E0E0E0] px-8 py-10 flex flex-col gap-7">
            {[
              { label: 'Top Sellers', href: '#featured' },
              { label: 'How It Works', href: '#process' },
              { label: 'Partners', href: '#' },
              { label: 'Sign In', href: '/auth/login' },
            ].map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="label text-[#0A0A0A]">{item.label}</Link>
            ))}
            <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}
              className="btn btn-ink self-start mt-2">Get Started</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="pt-16 min-h-screen flex flex-col bg-white">
        {/* Top meta row */}
        <div className="max-w-[1440px] mx-auto w-full px-8 md:px-16 lg:px-24 pt-16 pb-10 flex items-center justify-between">
          <span className="label text-[#6B6B6B]">Est. 2024 — Los Angeles, CA</span>
          <span className="label text-[#6B6B6B]">Verified Appraisals</span>
        </div>

        {/* Headline — reduced from display-xl to display-lg-hero */}
        <div className="px-8 md:px-16 lg:px-24">
          <h1
            className="text-[#0A0A0A] leading-none"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 9vw, 9rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            <span className="block">Estate</span>
            <span className="block text-[#826DEE]">Inventory,</span>
            <span className="block">Authenticated</span>
            <span className="block">&amp; Sold.</span>
          </h1>
        </div>

        {/* Empty line between heading and sub */}
        <div className="h-10 md:h-14 lg:h-16" />

        {/* Sub row — subheading */}
        <div className="max-w-[1440px] mx-auto w-full px-8 md:px-16 lg:px-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <p className="body-light max-w-sm text-base leading-relaxed">
            We catalog every item, authenticate what matters, and sell across 6+ channels simultaneously — so your family receives the most.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth/register" className="btn btn-violet">Book a Free Walkthrough →</Link>
            <Link href="#process" className="btn btn-outline">How It Works</Link>
          </div>
        </div>

        {/* 2 lines space before marquee */}
        <div className="h-16 md:h-20 lg:h-24" />

        <div className="divider" />
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-[#FFDB15] py-4 overflow-hidden">
        <div className="marquee-track">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="flex items-center gap-10 px-10 whitespace-nowrap"
              style={{ fontFamily: 'var(--font-mono-family)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0A0A0A' }}>
              Verified Appraisals
              <span style={{ color: '#F94500' }}>◆</span>
              Authenticated Provenance
              <span style={{ color: '#826DEE' }}>◆</span>
              Multi-Channel Liquidation
              <span style={{ color: '#F94500' }}>◆</span>
              Direct Deposit
              <span style={{ color: '#826DEE' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2 lines space after marquee */}
      <div className="h-16 md:h-20 lg:h-28 bg-white" />

      {/* ── STATS ── */}
      <Reveal>
        <section className="border-t border-b border-[#E0E0E0]">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E0E0E0]">
              {[
                { n: '$4.2M+', l: 'Client Proceeds' },
                { n: '2,500+', l: 'Items Sold' },
                { n: '98%',    l: 'Client Satisfaction' },
                { n: '48 hrs', l: 'Avg. Time to Live' },
              ].map(s => (
                <div key={s.l} className="px-8 md:px-16 lg:px-20 py-16 flex flex-col gap-3">
                  <span className="display-md text-[#826DEE]">{s.n}</span>
                  <span className="label">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Space beneath stats */}
      <div className="h-20 md:h-28 lg:h-36 bg-white" />

      {/* ── FEATURED PRODUCTS — Gallery ── */}
      <section id="featured" className="pb-32 md:pb-48 lg:pb-64">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">

          {/* Section header */}
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 md:mb-32">
              <div>
                <span className="label block mb-5">Top Sellers / Highest Value</span>
                <h2 className="display-lg text-[#0A0A0A]">Recent<br/>Highlights.</h2>
              </div>
              <p className="body-light max-w-xs md:pb-1">
                A selection of recently authenticated and sold pieces from our client estates. Every item verified, every price transparent.
              </p>
            </div>
          </Reveal>

          {/* Gallery grid — art gallery feel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 lg:gap-x-16 lg:gap-y-36">
            {PRODUCTS.map((product, idx) => (
              <Reveal key={product.id} delay={Math.min((idx % 3) * 80, 160)}>
                <div className="group flex flex-col">
                  {/* Image stage — gallery pedestal feel */}
                  <div className="relative flex items-end justify-center mb-8"
                    style={{ height: '360px', background: 'transparent' }}>
                    {/* Subtle floor shadow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-6 rounded-full"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.11) 0%, transparent 70%)' }} />
                    {/* Product image */}
                    <Image
                      src={product.img}
                      alt={product.name}
                      width={520}
                      height={520}
                      className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      style={{
                        maxHeight: '320px',
                        width: 'auto',
                        filter: 'drop-shadow(0 28px 48px rgba(10,10,10,0.13)) drop-shadow(0 8px 18px rgba(10,10,10,0.07))',
                        background: 'transparent',
                      }}
                    />
                    {/* Label badge */}
                    <span className="absolute top-0 left-0 font-mono text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 font-bold"
                      style={{ background: product.labelColor, color: (product as any).labelText ?? '#FFFFFF' }}>
                      {product.label}
                    </span>
                  </div>

                  {/* Product info */}
                  <div className="border-t border-[#E0E0E0] pt-6">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-sans text-[#0A0A0A] text-base leading-snug" style={{ fontWeight: 500 }}>
                        {product.name}
                      </h3>
                      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#826DEE] whitespace-nowrap font-bold">
                        {product.realized}
                      </span>
                    </div>
                    <span className="label block mb-3">{product.period}</span>
                    <span className="label text-[#BDBDBD]">Est. {product.estimate}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Gallery CTA */}
          <Reveal>
            <div className="mt-24 md:mt-36 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-[#E0E0E0] pt-14">
              <p className="body-light max-w-sm">Every item in our catalog comes with verified provenance documentation and a certified appraisal.</p>
              <Link href="/auth/register" className="btn btn-ink flex-shrink-0">View Full Catalog →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="process" className="py-28 md:py-44 lg:py-60 bg-[#F5F5F5]">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 md:mb-32">
              <div>
                <span className="label block mb-5">The Process</span>
                <h2 className="display-lg text-[#0A0A0A]">From Walkthrough<br/>to Deposit.</h2>
              </div>
              <p className="body-light max-w-xs md:pb-1">In days, not months. Every step is tracked, verified, and reported in real time.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              { n: '01', title: 'Schedule a Walkthrough', body: 'We come to your property, photograph, catalog, and assess every item of value — typically in under two hours.', accent: '#826DEE' },
              { n: '02', title: 'Catalog, Authenticate & Price', body: 'AI-assisted identification with human expert review. High-value pieces receive full provenance authentication.', accent: '#FFDB15' },
              { n: '03', title: 'Multi-Channel Liquidation', body: 'Items list simultaneously across 6+ channels — online storefront, eBay, Facebook Marketplace, Etsy, and live auction.', accent: '#F94500' },
              { n: '04', title: 'Direct Deposit to You', body: 'Net proceeds deposited after each settlement period. Full itemized statements with every transaction visible.', accent: '#FF99DC' },
            ].map((step, idx) => (
              <Reveal key={step.n} delay={idx * 60}>
                <div
                  className="group border-t border-[#E0E0E0] px-8 md:px-12 lg:px-16 py-16 md:py-20 flex flex-col gap-7 bg-[#F5F5F5] hover:bg-white transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <span className="label">{step.n}</span>
                    <span className="w-3 h-3 mt-0.5" style={{ background: step.accent }} />
                  </div>
                  <h3 className="display-md leading-tight" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}>{step.title}</h3>
                  <p className="body-light leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHENTICATION — dark editorial ── */}
      <section className="bg-[#0A0A0A] py-28 md:py-44 lg:py-60">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-28 items-center">
            <Reveal>
              <div>
                <span className="label-dark block mb-6">Authentication First</span>
                <h2 className="display-lg text-white">Every Piece<br/>Verified Before<br/><span className="text-[#FFDB15]">It Sells.</span></h2>
                <p className="body-light text-white/50 mt-8 max-w-xs leading-relaxed">
                  Our authentication workflow requires provenance documentation, maker-mark photography, and expert sign-off before any high-value item is published. Inconclusive pieces are flagged — never guessed.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex flex-col gap-0">
                {[
                  { label: 'Provenance Documentation', color: '#826DEE', note: 'Ownership chain verified' },
                  { label: 'Maker-Mark Photography',   color: '#FFDB15', note: 'High-res macro imaging' },
                  { label: 'Comparable Sales Research', color: '#FF99DC', note: 'Live auction data' },
                  { label: 'Expert Sign-Off',           color: '#F94500', note: 'Accredited specialist' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-5 border-b border-white/10 py-8">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: item.color }} />
                    <div className="flex-1">
                      <span className="body-light text-white/80 block">{item.label}</span>
                      <span className="label-dark mt-1 block">{item.note}</span>
                    </div>
                    <span className="label-dark text-white/40 flex-shrink-0">Complete</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-28 md:py-44 lg:py-60">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 md:mb-32">
              <div>
                <span className="label block mb-5">Services</span>
                <h2 className="display-lg">Everything<br/>Included.</h2>
              </div>
              <p className="body-light max-w-xs md:pb-1">No hidden fees. Every service is included in our standard commission — from first walkthrough to final deposit.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {[
              { n: '01', title: 'Appraisal',        body: 'Certified valuations by accredited specialists.', color: '#826DEE' },
              { n: '02', title: 'Authentication',   body: 'Provenance verification for high-value pieces.', color: '#FFDB15' },
              { n: '03', title: 'Cataloging',       body: 'Professional photography and detailed descriptions.', color: '#F94500' },
              { n: '04', title: 'Channel Listing',  body: 'Simultaneous placement across 6+ platforms.', color: '#FF99DC' },
              { n: '05', title: 'Live Commerce',    body: 'White-glove auction management and live streaming.', color: '#826DEE' },
              { n: '06', title: 'Reporting',        body: 'Real-time dashboards and settlement statements.', color: '#FFDB15' },
            ].map((svc, idx) => (
              <Reveal key={svc.n} delay={(idx % 3) * 60}>
                <div
                  className="border-t border-l border-[#E0E0E0] px-8 md:px-10 py-14 md:py-16 flex flex-col gap-5 hover:bg-[#F5F5F5] transition-colors h-full">
                  <div className="flex items-center justify-between">
                    <span className="label">{svc.n}</span>
                    <span className="w-3 h-3" style={{ background: svc.color }} />
                  </div>
                  <h3 className="display-md" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)' }}>{svc.title}</h3>
                  <p className="body-light leading-relaxed">{svc.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <Reveal>
        <div className="border-t border-b border-[#E0E0E0] py-12">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 flex flex-wrap items-center justify-between gap-8">
            {[
              'ISALB Certified Appraisers',
              'AuctionGuard™ Escrow',
              '256-bit SSL',
              'BBB Accredited',
              'USPAP Compliant',
            ].map(badge => (
              <span key={badge} className="label text-[#6B6B6B]">{badge}</span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal>
        <section className="bg-[#826DEE]">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 py-28 md:py-44 lg:py-60 flex flex-col md:flex-row items-start md:items-end justify-between gap-14">
            <h2 className="display-lg text-white">Ready<br/>to Begin?</h2>
            <div className="flex flex-col gap-5 md:pb-1">
              <p className="body-light text-white/70 max-w-xs leading-relaxed">
                Most estates are fully listed within 5 business days of the initial walkthrough.
              </p>
              <Link href="/auth/register" className="btn btn-yellow self-start">Book Free Walkthrough →</Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A0A0A] text-white">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 py-20 md:py-28 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <span className="label text-white/40 block mb-5">Estate Liquidity</span>
            <p className="body-light text-white/40 text-sm leading-relaxed">
              Verified appraisals. Authenticated provenance. Transparent liquidation.
            </p>
          </div>
          {[
            { title: 'Platform', links: [{ l: 'How It Works', href: '#process' }, { l: 'Authentication', href: '#' }, { l: 'Pricing', href: '#' }, { l: 'Partners', href: '#' }] },
            { title: 'Account',  links: [{ l: 'Sign In', href: '/auth/login' }, { l: 'Create Account', href: '/auth/register' }, { l: 'Customer Portal', href: '/portal' }, { l: 'Partner Portal', href: '/partner' }] },
            { title: 'Company',  links: [{ l: 'About', href: '#' }, { l: 'Careers', href: '#' }, { l: 'Press', href: '#' }, { l: 'Contact', href: '#' }] },
          ].map(col => (
            <div key={col.title}>
              <span className="label text-white/40 block mb-5">{col.title}</span>
              <ul className="flex flex-col gap-3">
                {col.links.map(lk => (
                  <li key={lk.l}>
                    <Link href={lk.href} className="text-white/50 hover:text-white text-sm transition-colors"
                      style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>{lk.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="label text-white/30">© 2025 Estate Liquidity Platform</span>
          <span className="label text-white/30">All Rights Reserved</span>
        </div>
      </footer>
    </div>
  )
}
