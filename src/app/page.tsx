'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B]">Estate</span>
            <span className="w-px h-4 bg-[#E0E0E0]" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#0A0A0A] font-bold">Liquidity</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {['How It Works', 'Partners', 'Sign In'].map(item => (
              <Link key={item} href="#" className="label text-[#0A0A0A] hover:text-[#826DEE] transition-colors">
                {item}
              </Link>
            ))}
            <Link href="/auth/login" className="btn btn-ink text-[10px] py-2.5 px-5">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(v => !v)} className="md:hidden tap-target">
            <div className="flex flex-col gap-[5px]">
              <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E0E0E0] px-6 py-8 flex flex-col gap-6">
            {['How It Works', 'Partners', 'Sign In'].map(item => (
              <Link key={item} href="#" onClick={() => setMobileMenuOpen(false)}
                className="label text-[#0A0A0A] text-sm">
                {item}
              </Link>
            ))}
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}
              className="btn btn-ink self-start">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="pt-14 min-h-screen flex flex-col justify-between bg-white">
        {/* Top label row */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 pb-6 flex items-center justify-between">
          <span className="label">Est. 2024 — Los Angeles</span>
          <span className="label">Verified Appraisals</span>
        </div>

        {/* Massive headline */}
        <div className="relative overflow-hidden px-4 md:px-8">
          <h1 className="display-xl text-[#0A0A0A] leading-none">
            <span className="block">Estate</span>
            <span className="block text-[#826DEE]">Inventory,</span>
            <span className="block">Authenticated</span>
            <span className="block">&amp; Sold.</span>
          </h1>
        </div>

        {/* Sub row */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-16 pt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <p className="body-light max-w-xs">
            We catalog every item, authenticate what matters, and sell across 6+ channels simultaneously — so your family receives the most.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth/register" className="btn btn-violet">Book a Free Walkthrough →</Link>
            <Link href="#process" className="btn btn-outline">How It Works</Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="divider" />
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div className="bg-[#FFDB15] py-3 overflow-hidden">
        <div className="marquee-track">
          {Array.from({length: 8}).map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-8 whitespace-nowrap"
              style={{ fontFamily: 'var(--font-mono-family)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0A0A0A' }}>
              Verified Appraisals
              <span className="text-[#F94500]">◆</span>
              Authenticated Provenance
              <span className="text-[#826DEE]">◆</span>
              Multi-Channel Liquidation
              <span className="text-[#F94500]">◆</span>
              Direct Deposit
              <span className="text-[#826DEE]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <section className="border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E0E0E0]">
            {[
              { n: '$4.2M+', l: 'Client Proceeds' },
              { n: '2,500+', l: 'Items Sold' },
              { n: '98%',    l: 'Client Satisfaction' },
              { n: '48 hrs', l: 'Avg. Time to Live' },
            ].map(s => (
              <div key={s.l} className="px-8 md:px-12 py-10 flex flex-col gap-2">
                <span className="display-md text-[#826DEE]">{s.n}</span>
                <span className="label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="process" className="py-24 md:py-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Section header */}
          <div className="flex items-start justify-between mb-16 md:mb-24 flex-col md:flex-row gap-6">
            <div>
              <span className="label block mb-4">The Process</span>
              <h2 className="display-lg text-[#0A0A0A]">From Walkthrough<br/>to Deposit.</h2>
            </div>
            <p className="body-light max-w-xs md:mt-auto md:pb-2">In days, not months. Every step is tracked, verified, and reported to you in real time.</p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              { n: '01', title: 'Schedule a Walkthrough', body: 'We come to your property, photograph, catalog, and assess every item of value — typically in under two hours.', accent: '#826DEE' },
              { n: '02', title: 'Catalog, Authenticate & Price', body: 'AI-assisted identification with human expert review. High-value pieces receive full provenance authentication.', accent: '#FFDB15' },
              { n: '03', title: 'Multi-Channel Liquidation', body: 'Items list simultaneously across 6+ channels — online storefront, eBay, Facebook Marketplace, Etsy, and live auction.', accent: '#F94500' },
              { n: '04', title: 'Direct Deposit to You', body: 'Net proceeds deposited after each settlement period. Full itemized statements with every transaction visible.', accent: '#FF99DC' },
            ].map(step => (
              <div key={step.n} className="group border-t border-[#E0E0E0] p-8 md:p-12 flex flex-col gap-6 transition-colors duration-200 hover:bg-[#F5F5F5]">
                <div className="flex items-start justify-between">
                  <span className="label">{step.n}</span>
                  <span className="w-8 h-8 flex items-end justify-end">
                    <span className="w-2 h-2 rounded-full" style={{ background: step.accent }} />
                  </span>
                </div>
                <h3 className="display-md leading-tight" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>{step.title}</h3>
                <p className="body-light">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHENTICATION FEATURE — full width editorial ── */}
      <section className="bg-[#0A0A0A] py-24 md:py-40 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="label-dark block mb-6">Authentication First</span>
              <h2 className="display-lg text-white">Every Piece<br/>Verified Before<br/><span className="text-[#FFDB15]">It Sells.</span></h2>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { label: 'Provenance Documentation', color: '#826DEE' },
                { label: 'Maker-Mark Photography',  color: '#FFDB15' },
                { label: 'Comparable Sales Research', color: '#FF99DC' },
                { label: 'Expert Sign-Off',          color: '#F94500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="body-light text-white/70 flex-1">{item.label}</span>
                  <span className="label-dark">Complete</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 md:py-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <span className="label block mb-6">Services</span>
          <h2 className="display-lg mb-16 md:mb-24">Everything<br/>Included.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {[
              { n: '01', title: 'Appraisal', body: 'Certified valuations by accredited specialists.', color: '#826DEE' },
              { n: '02', title: 'Authentication', body: 'Provenance verification for high-value pieces.', color: '#FFDB15' },
              { n: '03', title: 'Cataloging', body: 'Professional photography and detailed descriptions.', color: '#F94500' },
              { n: '04', title: 'Channel Listing', body: 'Simultaneous placement across 6+ platforms.', color: '#FF99DC' },
              { n: '05', title: 'Live Commerce', body: 'White-glove auction management and live streaming.', color: '#826DEE' },
              { n: '06', title: 'Reporting', body: 'Real-time dashboards and settlement statements.', color: '#FFDB15' },
            ].map(svc => (
              <div key={svc.n} className="border-t border-l border-[#E0E0E0] p-8 flex flex-col gap-4 group hover:bg-[#F5F5F5] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="label">{svc.n}</span>
                  <span className="w-3 h-3" style={{ background: svc.color }} />
                </div>
                <h3 className="display-md" style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}>{svc.title}</h3>
                <p className="body-light">{svc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BLOCK ── */}
      <section className="bg-[#826DEE]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-40 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <h2 className="display-lg text-white">Ready<br/>to Begin?</h2>
          <div className="flex flex-col gap-4">
            <p className="body-light text-white/70 max-w-xs">Most estates are fully listed within 5 business days of the initial walkthrough.</p>
            <Link href="/auth/register" className="btn btn-yellow self-start">Book Free Walkthrough →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A0A0A] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="label text-white/40 block mb-4">Estate Liquidity</span>
            <p className="body-light text-white/40 text-sm">Verified appraisals. Authenticated provenance. Transparent liquidation.</p>
          </div>
          {[
            { title: 'Platform', links: ['How It Works', 'Authentication', 'Pricing', 'Partners'] },
            { title: 'Account', links: ['Sign In', 'Create Account', 'Customer Portal', 'Partner Portal'] },
            { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <span className="label text-white/40 block mb-4">{col.title}</span>
              <ul className="flex flex-col gap-2">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 300 }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="label text-white/30">© 2024 Estate Liquidity Platform</span>
          <span className="label text-white/30">All Rights Reserved</span>
        </div>
      </footer>
    </div>
  )
}
