import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left — editorial panel */}
      <div className="w-full md:w-1/2 bg-[#0A0A0A] flex flex-col justify-between p-8 md:p-16 min-h-[200px] md:min-h-screen">
        <Link href="/" className="flex items-center gap-2">
          <span className="label-dark">Estate Liquidity</span>
        </Link>
        <div className="hidden md:block">
          <h2 className="display-lg text-white leading-none mb-8">The Smarter<br/><span className="text-[#FFDB15]">Way to Sell</span><br/>an Estate.</h2>
          <p className="body-light text-white/50 max-w-xs">Trusted by families across the region. Every item verified, every transaction transparent.</p>
        </div>
        <span className="label-dark hidden md:block">© 2024 Estate Liquidity</span>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-start md:items-center justify-center pt-10 pb-16 px-6 md:px-16 bg-white">
        <div className="w-full max-w-md">
          <span className="label block mb-8">Sign In</span>
          <h1 className="display-md mb-10 text-[#0A0A0A]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Welcome<br/>Back.</h1>

          <form className="flex flex-col gap-0">
            <div className="border-t border-[#E0E0E0] py-4">
              <label className="label block mb-2">Email Address</label>
              <input type="email" placeholder="you@example.com"
                className="w-full bg-transparent text-[#0A0A0A] placeholder:text-[#BDBDBD] focus:outline-none py-1 body-light" />
            </div>
            <div className="border-t border-[#E0E0E0] py-4">
              <div className="flex items-center justify-between mb-2">
                <label className="label">Password</label>
                <a href="#" className="label text-[#826DEE] hover:underline">Forgot?</a>
              </div>
              <input type="password" placeholder="••••••••"
                className="w-full bg-transparent text-[#0A0A0A] placeholder:text-[#BDBDBD] focus:outline-none py-1 body-light" />
            </div>
            <div className="border-t border-[#E0E0E0] pt-6 pb-2">
              <button type="submit" className="btn btn-ink w-full justify-center">Sign In →</button>
            </div>
          </form>

          <p className="label mt-8 text-[#6B6B6B]">
            No account?{' '}
            <Link href="/auth/register" className="text-[#826DEE] hover:underline">Create one →</Link>
          </p>
          <p className="label mt-2 text-[#BDBDBD]">By signing in you agree to our terms of service.</p>
        </div>
      </div>
    </div>
  )
}
