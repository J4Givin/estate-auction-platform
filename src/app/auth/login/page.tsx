import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in · Estate Liquidity',
  description:
    'Sign in to your Estate Liquidity account — marketplace access for buyers, collectors, and estate professionals, and seller portal access after a private estate review.',
  alternates: { canonical: '/auth/login' },
}

/**
 * Sign-in page.
 *
 * Two account types share this entry point:
 *  - Marketplace accounts (buyers, collectors, estate professionals),
 *    self-served via /auth/register.
 *  - Seller / family portal accounts, which are issued after a private
 *    estate walkthrough — never self-served, to protect the advisory flow.
 *
 * Mobile composition: a tight charcoal header strip (no giant blank
 * dark block), then the form.
 */
export default function LoginPage() {
  return (
    <div className="auth-page">
      {/* ── Compact mobile header (visible <md) ────────────────────────── */}
      <div className="auth-mobile-head md:hidden">
        <Link href="/" className="flex items-center gap-3">
          <span className="auth-logo-mark">EL</span>
          <span className="label-dark">Estate Liquidity</span>
        </Link>
        <Link href="/auth/register" className="auth-mobile-signin">
          Create account →
        </Link>
      </div>

      <div className="auth-grid">
        {/* ── Left — editorial dark panel (md and up) ─────────────────── */}
        <aside className="auth-aside hidden md:flex">
          <Link href="/" className="flex items-center gap-3 self-start">
            <span className="auth-logo-mark auth-logo-mark--dark">EL</span>
            <span className="label-dark">Estate Liquidity</span>
          </Link>

          <div className="auth-aside-body">
            <span className="brass-rule mb-5 block" aria-hidden style={{ background: '#B89A5A' }} />
            <span className="label-dark mb-5 block">Account access</span>
            <h2 className="auth-aside-title">
              Welcome back.
            </h2>
            <p className="auth-aside-copy">
              Marketplace accounts give buyers, collectors, and estate
              professionals saved items, sale previews, and offer review.
              Sellers and families access the portal after their private
              estate walkthrough.
            </p>
          </div>

          <div className="auth-aside-foot">
            <span className="label-dark mb-2 block">New to Estate Liquidity?</span>
            <Link href="/auth/register" className="auth-aside-link">
              Create marketplace account →
            </Link>
          </div>
        </aside>

        {/* ── Right — form panel ──────────────────────────────────────── */}
        <main className="auth-main">
          <div className="auth-form-wrap">
            <div className="flex items-center gap-3 mb-6">
              <span className="brass-rule" aria-hidden />
              <span className="label">Sign in</span>
            </div>

            <h1 className="auth-h1">Welcome back.</h1>
            <p className="body-light mb-8 max-w-md leading-relaxed" style={{ fontSize: 14.5 }}>
              Sign in to your marketplace or seller portal account.
            </p>

            <form className="auth-form" action="/portal" method="get" noValidate>
              <div className="auth-field">
                <label htmlFor="login-email" className="auth-label">Email address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="login-password" className="auth-label">Password</label>
                  <Link href="/auth/forgot" className="auth-hint" style={{ color: '#9A7A3C' }}>
                    Forgot?
                  </Link>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="auth-input"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-mobile-primary auth-submit">
                Sign in →
              </button>
            </form>

            <p className="auth-fineprint">
              New to Estate Liquidity?{' '}
              <Link href="/auth/register" className="auth-inline-link">
                Create marketplace account →
              </Link>
            </p>
            <p className="auth-fineprint auth-fineprint--soft">
              By signing in you agree to our{' '}
              <Link href="/legal/terms" className="auth-inline-link auth-inline-link--soft">
                terms
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="auth-inline-link auth-inline-link--soft">
                privacy notice
              </Link>
              .
            </p>

            <div className="auth-aside-footnote">
              <span className="label block mb-2">Selling or settling an estate?</span>
              <p className="body-light leading-relaxed mb-4" style={{ fontSize: 13.5 }}>
                Seller portal access is issued after a private estate
                walkthrough — no obligation, no account required to begin.
              </p>
              <Link
                href="/request-walkthrough"
                className="btn btn-outline btn-mobile-secondary w-full justify-center"
              >
                Request a private review →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
