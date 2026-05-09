import { ReactNode } from 'react'
import Link from 'next/link'
import { PublicShell } from './PublicShell'
import { PageHero, Section } from './PageHero'

export function LegalPage({ eyebrow, title, intro, sections }: {
  eyebrow: string
  title: ReactNode
  intro: ReactNode
  sections: { heading: string; body: ReactNode }[]
}) {
  return (
    <PublicShell>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} />
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <aside className="md:col-span-3">
            <span className="label block mb-4">On this page</span>
            <ul className="border-t border-[#E0E0E0]">
              {sections.map(s => (
                <li key={s.heading} className="border-b border-[#E0E0E0] py-3">
                  <a href={`#${slug(s.heading)}`} className="body-light text-[14px] hover:text-[#826DEE]">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
            <p className="label text-[#6B6B6B] mt-6">Placeholder language. Replace with finalized legal copy before launch.</p>
          </aside>
          <div className="md:col-span-9">
            {sections.map(s => (
              <section key={s.heading} id={slug(s.heading)} className="scroll-mt-24 mb-12">
                <h2 className="text-[24px] md:text-[28px] mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                  {s.heading}
                </h2>
                <div className="body-light leading-relaxed space-y-4 text-[#0A0A0A]/85 max-w-3xl">
                  {s.body}
                </div>
              </section>
            ))}
            <div className="border-t border-[#E0E0E0] pt-8 mt-12 flex flex-wrap gap-3">
              <Link href="/legal/privacy" className="label text-[#6B6B6B] hover:text-[#0A0A0A]">Privacy</Link>
              <Link href="/legal/terms" className="label text-[#6B6B6B] hover:text-[#0A0A0A]">Terms</Link>
              <Link href="/legal/seller-agreement" className="label text-[#6B6B6B] hover:text-[#0A0A0A]">Seller Agreement</Link>
              <Link href="/legal/buyer-terms" className="label text-[#6B6B6B] hover:text-[#0A0A0A]">Buyer Terms</Link>
              <Link href="/legal/fee-disclosure" className="label text-[#6B6B6B] hover:text-[#0A0A0A]">Fee Disclosure</Link>
            </div>
          </div>
        </div>
      </Section>
    </PublicShell>
  )
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
