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
 *
 * Mobile composition: a tight charcoal header strip (no giant blank
 * dark block), then the form. Desktop composition: a 50/50 editorial
 * panel layout matching /auth/login.
 */
export default function RegisterPage() {
  return (
    <div className="auth-page">
      {/* ── Compact mobile header (visible <md) ────────────────────────── */}
      <div className="auth-mobile-head md:hidden">
        <Link href="/" className="flex items-center gap-3">
          <span className="auth-logo-mark">EL</span>
          <span className="label-dark">Estate Liquidity</span>
        </Link>
        <Link href="/auth/login" className="auth-mobile-signin">
          Sign in →
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
            <span className="label-dark mb-5 block">Marketplace access</span>
            <h2 className="auth-aside-title">
              Follow estates as they come to market.
            </h2>
            <p className="auth-aside-copy">
              An account opens saved items, sale previews, offer review, and
              the documentation we keep on every lot — for buyers,
              collectors, and estate professionals.
            </p>
          </div>

          <div className="auth-aside-foot">
            <span className="label-dark mb-2 block">Selling or settling an estate?</span>
            <Link href="/request-walkthrough" className="auth-aside-link">
              Request a private review →
            </Link>
          </div>
        </aside>

        {/* ── Right — form panel ──────────────────────────────────────── */}
        <main className="auth-main">
          <div className="auth-form-wrap">
            <div className="flex items-center gap-3 mb-6">
              <span className="brass-rule" aria-hidden />
              <span className="label">Create marketplace account</span>
            </div>

            <h1 className="auth-h1">Welcome.</h1>
            <p className="body-light mb-8 max-w-md leading-relaxed" style={{ fontSize: 14.5 }}>
              Open marketplace access in under a minute. We keep accounts
              quiet — no marketing blasts, no shared lists.
            </p>

            <form className="auth-form" action="/portal" method="get" noValidate>
              <div className="auth-field">
                <label htmlFor="reg-name" className="auth-label">Full name</label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-email" className="auth-label">Email address</label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-role" className="auth-label">I am a…</label>
                <select
                  id="reg-role"
                  name="role"
                  defaultValue="buyer"
                  className="auth-input"
                >
                  <option value="buyer">Buyer or collector</option>
                  <option value="professional">
                    Estate professional (realtor, attorney, fiduciary)
                  </option>
                  <option value="seller">Seller or family member</option>
                </select>
              </div>
              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="reg-password" className="auth-label">Create password</label>
                  <span className="auth-hint">8+ characters</span>
                </div>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                  className="auth-input"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-mobile-primary auth-submit">
                Create account →
              </button>
            </form>

            <p className="auth-fineprint">
              Already have an account?{' '}
              <Link href="/auth/login" className="auth-inline-link">
                Sign in →
              </Link>
            </p>
            <p className="auth-fineprint auth-fineprint--soft">
              By creating an account you agree to our{' '}
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
                The right first step for sellers and families is a private
                estate walkthrough — no account required, no obligation.
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
