'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Services', href: '/services' },
  { label: 'Authentication', href: '/authentication' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For partners', href: '/partners' },
  { label: 'FAQ', href: '/faq' },
]

/**
 * Logotype — refined advisory mark.
 * "EL" monogram in serif + small advisory wordmark, set against a soft
 * brass keyline. Replaces the prior tracked-mono "ESTATE | LIQUIDITY"
 * label which read as SaaS rather than estate-house.
 */
function Logotype() {
  return (
    <span className="flex items-center gap-3" aria-hidden>
      <span
        className="flex items-center justify-center"
        style={{
          width: 30,
          height: 30,
          borderRadius: 6,
          border: '1px solid #C9C0AC',
          background: '#FBF8F1',
          fontFamily: 'var(--font-display-family)',
          fontWeight: 500,
          fontSize: 14,
          letterSpacing: '-0.02em',
          color: '#1E1B17',
        }}
      >
        EL
      </span>
      <span className="flex flex-col leading-tight">
        <span
          style={{
            fontFamily: 'var(--font-display-family)',
            fontWeight: 400,
            fontSize: 17,
            letterSpacing: '-0.012em',
            color: '#1E1B17',
            lineHeight: 1.05,
          }}
        >
          Estate Liquidity
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body-family)',
            fontWeight: 500,
            fontSize: 9.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#9A7A3C',
            lineHeight: 1,
          }}
        >
          Estate Advisory · Los Angeles
        </span>
      </span>
    </span>
  )
}

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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(251,248,241,0.92)',
        backdropFilter: 'saturate(140%) blur(14px)',
        WebkitBackdropFilter: 'saturate(140%) blur(14px)',
        borderBottom: '1px solid #E5DECF',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 h-[68px] flex items-center justify-between">
        <Link href="/" aria-label="Estate Liquidity home" onClick={close} className="flex items-center">
          <Logotype />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors"
                style={{
                  fontFamily: 'var(--font-body-family)',
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  letterSpacing: '-0.005em',
                  color: active ? '#1E1B17' : '#3A3530',
                  borderBottom: active ? '1px solid #9A7A3C' : '1px solid transparent',
                  paddingBottom: 2,
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="transition-colors"
            style={{
              fontFamily: 'var(--font-body-family)',
              fontWeight: 500,
              fontSize: 13.5,
              color: '#706A60',
            }}
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="btn btn-outline"
            style={{ padding: '10px 16px', fontSize: 13.5 }}
          >
            Create account
          </Link>
          <Link
            href="/request-walkthrough"
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: 13.5 }}
          >
            Request a private review
          </Link>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="lg:hidden tap-target -mr-2"
          aria-expanded={open}
          aria-controls="public-mobile-drawer"
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{ borderRadius: 8 }}
        >
          <div className="flex flex-col gap-[5px]">
            <span className={`block w-5 h-[1.5px] bg-[#1E1B17] transition-all duration-200 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#1E1B17] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#1E1B17] transition-all duration-200 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile drawer — overlays page content, soft ivory surface */}
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="lg:hidden fixed inset-0 z-40 animate-fade-in"
            style={{
              background: 'rgba(30,27,23,0.36)',
              top: 'calc(68px + env(safe-area-inset-top, 0px))',
            }}
          />
          <div
            id="public-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="lg:hidden fixed left-0 right-0 z-50 animate-fade-in"
            style={{
              top: 'calc(68px + env(safe-area-inset-top, 0px))',
              maxHeight: 'calc(100dvh - 68px - env(safe-area-inset-top, 0px))',
              overflowY: 'auto',
              background: '#FBF8F1',
              borderTop: '1px solid #E5DECF',
              borderBottom: '1px solid #E5DECF',
            }}
          >
            <nav className="px-6 sm:px-10 pt-5 pb-7 flex flex-col" aria-label="Mobile primary">
              {NAV.map(item => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="flex items-center justify-between"
                    style={{
                      minHeight: 56,
                      borderBottom: '1px solid #EBE6D8',
                    }}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display-family)',
                        fontWeight: 400,
                        fontSize: 21,
                        color: '#1E1B17',
                        letterSpacing: '-0.012em',
                      }}
                    >
                      {item.label}
                    </span>
                    {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#9A7A3C' }} aria-hidden />}
                  </Link>
                )
              })}
              <Link href="/about" onClick={close} className="flex items-center" style={{ minHeight: 56, borderBottom: '1px solid #EBE6D8' }}>
                <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 400, fontSize: 21, color: '#1E1B17', letterSpacing: '-0.012em' }}>About</span>
              </Link>
              <Link href="/contact" onClick={close} className="flex items-center" style={{ minHeight: 56, borderBottom: '1px solid #EBE6D8' }}>
                <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 400, fontSize: 21, color: '#1E1B17', letterSpacing: '-0.012em' }}>Contact</span>
              </Link>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <Link href="/auth/login" onClick={close} className="btn btn-outline btn-mobile-secondary justify-center">
                  Sign in
                </Link>
                <Link href="/auth/register" onClick={close} className="btn btn-outline btn-mobile-secondary justify-center">
                  Create account
                </Link>
              </div>

              <Link
                href="/request-walkthrough"
                onClick={close}
                className="btn btn-primary btn-mobile-primary justify-center mt-3"
              >
                Request a private estate review
              </Link>

              <p
                className="mt-6 text-center"
                style={{
                  fontFamily: 'var(--font-body-family)',
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#9A7A3C',
                }}
              >
                Estate Advisory · Los Angeles
              </p>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
