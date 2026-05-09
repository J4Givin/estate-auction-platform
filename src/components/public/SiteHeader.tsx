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
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E0E0E0]"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Estate Liquidity home" onClick={close}>
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
          aria-controls="public-mobile-drawer"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <div className="flex flex-col gap-[5px]">
            <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#0A0A0A] transition-all duration-200 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile sheet — overlays page content, does not push it. */}
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="lg:hidden fixed inset-0 z-40 bg-[#0A0A0A]/40 animate-fade-in"
            style={{ top: 'calc(64px + env(safe-area-inset-top, 0px))' }}
          />
          <div
            id="public-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="lg:hidden fixed left-0 right-0 z-50 bg-white border-t border-b border-[#E0E0E0] animate-fade-in"
            style={{
              top: 'calc(64px + env(safe-area-inset-top, 0px))',
              maxHeight: 'calc(100dvh - 64px - env(safe-area-inset-top, 0px))',
              overflowY: 'auto',
            }}
          >
            <nav className="px-6 sm:px-10 pt-4 pb-6 flex flex-col" aria-label="Mobile primary">
              {NAV.map(item => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center justify-between border-b border-[#F0F0F0]"
                    style={{ minHeight: 56 }}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className="text-[#0A0A0A]"
                      style={{
                        fontFamily: 'var(--font-body-family)',
                        fontWeight: active ? 600 : 500,
                        fontSize: 17,
                      }}
                    >
                      {item.label}
                    </span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE]" aria-hidden />}
                  </Link>
                )
              })}
              <Link href="/about" onClick={close} className="flex items-center border-b border-[#F0F0F0]" style={{ minHeight: 56 }}>
                <span className="text-[#0A0A0A]" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500, fontSize: 17 }}>About</span>
              </Link>
              <Link href="/contact" onClick={close} className="flex items-center border-b border-[#F0F0F0]" style={{ minHeight: 56 }}>
                <span className="text-[#0A0A0A]" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500, fontSize: 17 }}>Contact</span>
              </Link>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link href="/portal" onClick={close} className="btn btn-outline btn-mobile-secondary justify-center">
                  Client Portal
                </Link>
                <Link href="/partner" onClick={close} className="btn btn-outline btn-mobile-secondary justify-center">
                  Partner Portal
                </Link>
              </div>

              <Link
                href="/request-walkthrough"
                onClick={close}
                className="btn btn-ink btn-mobile-primary justify-center mt-3"
              >
                Book Free Evaluation →
              </Link>

              <p className="label text-[#6B6B6B] mt-5 text-center" style={{ letterSpacing: '0.14em' }}>
                Los Angeles · Estate Advisory
              </p>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
