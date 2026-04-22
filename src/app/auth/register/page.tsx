import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">

      {/* Left — editorial dark panel */}
      <div className="w-full md:w-[45%] lg:w-1/2 bg-[#0A0A0A] flex flex-col justify-between
                      p-8 md:p-14 lg:p-20 min-h-[220px] md:min-h-screen">
        <Link href="/" className="flex items-center gap-2 self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF99DC]" />
          <span className="label-dark">Estate Liquidity</span>
        </Link>

        <div className="hidden md:block py-8">
          <p className="label-dark mb-8">New Account</p>
          <h2 className="display-lg text-white leading-none mb-10">
            Trusted<br />
            From <span className="text-[#FF99DC]">Day</span><br />
            One.
          </h2>
          <p className="body-light text-white/50 max-w-xs leading-relaxed">
            Expert authentication. Transparent liquidation. Real-time reporting from the moment you sign up.
          </p>

          {/* Value props */}
          <div className="flex flex-col gap-0 mt-14">
            {[
              { t: 'Free walkthrough', s: 'No commitment required' },
              { t: 'Live within 48 hrs', s: 'After initial assessment' },
              { t: 'Direct deposit', s: 'Every settlement period' },
            ].map(item => (
              <div key={item.t} className="flex items-start gap-4 border-b border-white/10 py-5">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FF99DC]" />
                <div>
                  <span className="body-light text-white/80 block text-sm">{item.t}</span>
                  <span className="label-dark mt-0.5 block">{item.s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="label-dark hidden md:block opacity-40">© 2025 Estate Liquidity</span>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-start md:items-center justify-center
                      pt-12 pb-20 px-8 md:px-14 lg:px-20 bg-white">
        <div className="w-full max-w-md">
          <span className="label block mb-10">Create Account</span>
          <h1 className="mb-12 text-[#0A0A0A]"
            style={{
              fontFamily: 'var(--font-display-family)',
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}>
            Get<br />Started.
          </h1>

          <form className="flex flex-col gap-0" action="/portal" method="get">
            <div className="border-t border-[#E0E0E0] py-5 grid grid-cols-2 gap-6">
              <div>
                <label className="label block mb-2.5">First Name</label>
                <input
                  type="text"
                  placeholder="Jane"
                  className="w-full bg-transparent text-[#0A0A0A] placeholder:text-[#BDBDBD]
                             focus:outline-none py-1 body-light text-base"
                />
              </div>
              <div>
                <label className="label block mb-2.5">Last Name</label>
                <input
                  type="text"
                  placeholder="Smith"
                  className="w-full bg-transparent text-[#0A0A0A] placeholder:text-[#BDBDBD]
                             focus:outline-none py-1 body-light text-base"
                />
              </div>
            </div>
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
              <label className="label block mb-2.5">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                className="w-full bg-transparent text-[#0A0A0A] placeholder:text-[#BDBDBD]
                           focus:outline-none py-1 body-light text-base"
              />
            </div>
            <div className="border-t border-[#E0E0E0] py-5">
              <label className="label block mb-2.5">I am a…</label>
              <select className="w-full bg-transparent text-[#0A0A0A] py-1 body-light border-none text-base
                                 focus:outline-none cursor-pointer">
                <option value="customer">Estate Owner / Family</option>
                <option value="partner">Partner / Referrer</option>
              </select>
            </div>
            <div className="border-t border-[#E0E0E0] pt-7 pb-2">
              <button type="submit" className="btn btn-ink w-full justify-center">
                Create Account →
              </button>
            </div>
          </form>

          <div className="mt-10 flex flex-col gap-3">
            <p className="label text-[#6B6B6B]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#826DEE] hover:underline">Sign in →</Link>
            </p>
            <p className="label text-[#BDBDBD]">By creating an account you agree to our terms of service.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
