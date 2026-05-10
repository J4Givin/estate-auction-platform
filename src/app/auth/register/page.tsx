import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create marketplace account · Estate Liquidity',
  description:
    'Create an account to follow estates as they come to market. Saved items, sale previews, and offer review for buyers, collectors, and estate professionals.',
  alternates: { canonical: '/auth/register' },
}

/**
 * Marketplace account creation.
 *
 * The private seller funnel still routes through /request-walkthrough —
 * we never ask sellers/families to open an account before we have spoken.
 * This page is for buyers, collectors, and estate professionals who want
 * marketplace access (saved items, sale previews, offer review).
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: '#FBF8F1' }}>
      {/* Left — editorial advisory panel */}
      <div
        className="w-full md:w-[44%] lg:w-1/2 flex flex-col justify-between
                   px-6 sm:px-10 md:px-14 lg:px-20
                   pt-10 pb-10 md:pt-16 md:pb-14
                   min-h-[260px] md:min-h-screen"
        style={{ background: '#1E1B17', color: '#FBF8F1' }}
      >
        <Link href="/" className="flex items-center gap-3 self-start">
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid rgba(251,248,241,0.4)',
              fontFamily: 'var(--font-display-family)',
              fontWeight: 500,
              fontSize: 13,
              color: '#FBF8F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            EL
          </span>
          <span className="label-dark">Estate Liquidity</span>
        </Link>

        <div className="hidden md:block py-8">
          <span className="brass-rule mb-5 block" aria-hidden style={{ background: '#B89A5A' }} />
          <span className="label-dark mb-6 block">Marketplace access</span>
          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.014em',
              color: '#FBF8F1',
            }}
          >
            Follow estates as they come to market.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: 16,
              lineHeight: 1.7,
              color: 'rgba(251,248,241,0.72)',
              maxWidth: '36ch',
            }}
          >
            An account opens saved items, sale previews, offer review, and the documentation we keep on every lot — for buyers, collectors, and estate professionals.
          </p>
        </div>

        <div className="hidden md:flex flex-col gap-2 mt-auto">
          <span className="label-dark">Selling or settling an estate?</span>
          <Link
            href="/request-walkthrough"
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: 13.5,
              color: '#B89A5A',
              borderBottom: '1px solid rgba(184,154,90,0.5)',
              alignSelf: 'flex-start',
            }}
          >
            Request a private review →
          </Link>
        </div>

        <span className="label-dark hidden md:block opacity-50 mt-8">
          © {new Date().getFullYear()} Estate Liquidity · Los Angeles
        </span>
      </div>

      {/* Right — form panel */}
      <div
        className="flex-1 flex items-start md:items-center justify-center
                   pt-12 pb-20 px-6 sm:px-10 md:px-14 lg:px-20"
        style={{ background: '#FBF8F1' }}
      >
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <span className="brass-rule" aria-hidden />
            <span className="label">Create marketplace account</span>
          </div>

          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 2.6rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.014em',
              color: '#1E1B17',
            }}
          >
            Welcome.
          </h1>
          <p className="body-light mb-10 max-w-md leading-relaxed">
            Open marketplace access in under a minute. We will keep your account quiet — no marketing blasts, no shared lists.
          </p>

          <form className="flex flex-col gap-0" action="/portal" method="get" noValidate>
            <div className="border-t py-5" style={{ borderColor: '#E5DECF' }}>
              <label htmlFor="reg-name" className="label block mb-2.5">Full name</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                required
                className="w-full bg-transparent focus:outline-none py-1 body-light text-base"
                style={{ border: 'none', padding: 0, color: '#1E1B17' }}
              />
            </div>
            <div className="border-t py-5" style={{ borderColor: '#E5DECF' }}>
              <label htmlFor="reg-email" className="label block mb-2.5">Email address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="w-full bg-transparent focus:outline-none py-1 body-light text-base"
                style={{ border: 'none', padding: 0, color: '#1E1B17' }}
              />
            </div>
            <div className="border-t py-5" style={{ borderColor: '#E5DECF' }}>
              <label htmlFor="reg-role" className="label block mb-2.5">I am a…</label>
              <select
                id="reg-role"
                name="role"
                defaultValue="buyer"
                className="w-full bg-transparent focus:outline-none py-1 body-light text-base"
                style={{ border: 'none', padding: 0, color: '#1E1B17' }}
              >
                <option value="buyer">Buyer / collector</option>
                <option value="professional">Estate professional (realtor, attorney, fiduciary)</option>
                <option value="seller">Seller / family member</option>
              </select>
            </div>
            <div className="border-t py-5" style={{ borderColor: '#E5DECF' }}>
              <div className="flex items-center justify-between mb-2.5">
                <label htmlFor="reg-password" className="label">Create password</label>
                <span className="label" style={{ color: '#968F82', textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>
                  8+ characters
                </span>
              </div>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full bg-transparent focus:outline-none py-1 body-light text-base"
                style={{ border: 'none', padding: 0, color: '#1E1B17' }}
              />
            </div>
            <div className="border-t pt-7 pb-2" style={{ borderColor: '#E5DECF' }}>
              <button type="submit" className="btn btn-primary btn-mobile-primary w-full justify-center">
                Create account →
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-col gap-3">
            <p className="label" style={{ color: '#706A60', textTransform: 'none', letterSpacing: 0, fontSize: 13 }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: '#9A7A3C', borderBottom: '1px solid rgba(154,122,60,0.4)' }}>
                Sign in →
              </Link>
            </p>
            <p className="label" style={{ color: '#968F82', textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>
              By creating an account you agree to our{' '}
              <Link href="/legal/terms" style={{ color: '#706A60', borderBottom: '1px solid #C9C0AC' }}>
                terms
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" style={{ color: '#706A60', borderBottom: '1px solid #C9C0AC' }}>
                privacy notice
              </Link>
              .
            </p>
          </div>

          <div className="mt-12 pt-8" style={{ borderTop: '1px solid #E5DECF' }}>
            <span className="label block mb-3">Selling or settling an estate?</span>
            <p className="body-light text-[14px] mb-5 leading-relaxed">
              The right first step for sellers and families is a private estate walkthrough — no account required, no obligation.
            </p>
            <Link
              href="/request-walkthrough"
              className="btn btn-outline btn-mobile-secondary w-full justify-center"
            >
              Request a private review →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
