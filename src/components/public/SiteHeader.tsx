'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Services', href: '/services' },
  { label: 'Authentication', href: '/authentication' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For Partners', href: '/partners' },
  { label: 'FAQ', href: '/faq' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E0E0E0]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Estate Liquidity home">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#6B6B6B]">Estate</span>
          <span className="w-px h-4 bg-[#E0E0E0]" aria-hidden />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#0A0A0A] font-bold">Liquidity</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`label transition-colors ${active ? 'text-[#0A0A0A]' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/portal" className="label text-[#6B6B6B] hover:text-[#0A0A0A]">
            Client Portal
          </Link>
          <Link href="/request-walkthrough" className="btn btn-ink py-2.5 px-5 text-[10px]">
            Book Free Evaluation
          </Link>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="lg:hidden tap-target -mr-2"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <div className="flex flex-col gap-[5px]">
            <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-[#E0E0E0] px-6 sm:px-10 py-8 flex flex-col gap-1 max-h-[calc(100vh-64px)] overflow-y-auto">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={close} className="label text-[#0A0A0A] py-3 border-b border-[#F0F0F0]">
              {item.label}
            </Link>
          ))}
          <Link href="/about" onClick={close} className="label text-[#0A0A0A] py-3 border-b border-[#F0F0F0]">About</Link>
          <Link href="/contact" onClick={close} className="label text-[#0A0A0A] py-3 border-b border-[#F0F0F0]">Contact</Link>
          <Link href="/portal" onClick={close} className="label text-[#6B6B6B] py-3 border-b border-[#F0F0F0]">Client Portal</Link>
          <Link href="/partner" onClick={close} className="label text-[#6B6B6B] py-3 border-b border-[#F0F0F0]">Partner Portal</Link>
          <Link href="/request-walkthrough" onClick={close} className="btn btn-ink self-start mt-4">
            Book Free Evaluation
          </Link>
        </div>
      )}
    </header>
  )
}
