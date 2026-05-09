import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">

      {/* Left — editorial dark panel */}
      <div className="w-full md:w-[45%] lg:w-1/2 bg-[#0A0A0A] flex flex-col justify-between
                      p-6 sm:p-10 md:p-14 lg:p-20 min-h-[220px] md:min-h-screen">
        <Link href="/" className="flex items-center gap-2 self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE]" />
          <span className="label-dark">Estate Liquidity</span>
        </Link>

        <div className="hidden md:block py-8">
          <p className="label-dark mb-8">Client Portal</p>
          <h2 className="display-lg text-white leading-none mb-10">
            The Smarter<br />
            <span className="text-[#FFDB15]">Way to Sell</span><br />
            an Estate.
          </h2>
          <p className="body-light text-white/50 max-w-xs leading-relaxed">
            Trusted by families across the region. Every item verified, every transaction transparent.
          </p>
        </div>

        <span className="label-dark hidden md:block opacity-40">© 2025 Estate Liquidity</span>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-start md:items-center justify-center
                      pt-12 pb-20 px-6 sm:px-10 md:px-14 lg:px-20 bg-white">
        <div className="w-full max-w-md">
          <span className="label block mb-10">Sign In</span>
          <h1 className="mb-12 text-[#0A0A0A]"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}>
            Welcome<br />Back.
          </h1>

          <form className="flex flex-col gap-0" action="/portal" method="get">
            <div className="border-t border-[#E0E0E0] py-5">
              <label className="label block mb-2.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-[#0A0A0A] placeholder:text-[#BDBDBD]
                           focus:outline-none py-1 body-light text-base"
              />
            </div>
            <div className="border-t border-[#E0E0E0] py-5">
              <div className="flex items-center justify-between mb-2.5">
                <label className="label">Password</label>
                <a href="#" className="label text-[#826DEE] hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-[#0A0A0A] placeholder:text-[#BDBDBD]
                           focus:outline-none py-1 body-light text-base"
              />
            </div>
            <div className="border-t border-[#E0E0E0] pt-7 pb-2">
              <button type="submit" className="btn btn-ink w-full justify-center">
                Sign In →
              </button>
            </div>
          </form>

          <div className="mt-10 flex flex-col gap-3">
            <p className="label text-[#6B6B6B]">
              Don&apos;t have access yet?{' '}
              <Link href="/request-walkthrough" className="text-[#826DEE] hover:underline">Request a walkthrough →</Link>
            </p>
            <p className="label text-[#BDBDBD]">By signing in you agree to our terms of service.</p>
          </div>

          <div className="mt-14 pt-8 border-t border-[#E0E0E0]">
            <span className="label block mb-3 text-[#6B6B6B]">New here?</span>
            <p className="body-light text-[14px] mb-5">
              Account access is created after we have spoken about your estate. Start with a free walkthrough.
            </p>
            <Link href="/request-walkthrough" className="btn btn-outline w-full justify-center">
              Book a Free Walkthrough →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
