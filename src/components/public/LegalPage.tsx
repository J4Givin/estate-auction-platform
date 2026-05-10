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
      <Section surface="parchment">
        <div
          role="note"
          aria-label="Pre-launch placeholder notice"
          className="mb-10 md:mb-12 px-6 py-5 max-w-3xl"
          style={{
            borderLeft: '2px solid #9A7A3C',
            background: '#F6F1E8',
            borderRadius: '0 10px 10px 0',
          }}
        >
          <span className="label block mb-2" style={{ color: '#9A7A3C' }}>Pre-launch placeholder</span>
          <p className="body-warm" style={{ fontSize: 14.5 }}>
            This page is a structural placeholder. Final language will be reviewed by counsel and replaced before launch. It is shown so prospective clients can see the intended scope of the policy, not as a binding agreement.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <aside className="md:col-span-3">
            <span className="brass-rule mb-4 block" aria-hidden />
            <span className="label block mb-4">On this page</span>
            <ul style={{ borderTop: '1px solid #E5DECF' }}>
              {sections.map(s => (
                <li key={s.heading} className="py-3" style={{ borderBottom: '1px solid #E5DECF' }}>
                  <a
                    href={`#${slug(s.heading)}`}
                    className="body-light text-[14px] transition-colors"
                    style={{ color: '#3A3530' }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
            <p className="label mt-6 leading-relaxed">
              Placeholder language. Replace with finalized legal copy before launch.
            </p>
          </aside>
          <div className="md:col-span-9">
            {sections.map(s => (
              <section key={s.heading} id={slug(s.heading)} className="scroll-mt-24 mb-12">
                <h2 className="display-md mb-5 max-w-[28ch]">{s.heading}</h2>
                <div
                  className="body-warm leading-relaxed space-y-4 max-w-3xl"
                  style={{ color: '#3A3530' }}
                >
                  {s.body}
                </div>
              </section>
            ))}
            <div className="pt-8 mt-12 flex flex-wrap gap-3" style={{ borderTop: '1px solid #E5DECF' }}>
              <Link href="/legal/privacy" className="label">Privacy</Link>
              <Link href="/legal/terms" className="label">Terms</Link>
              <Link href="/legal/seller-agreement" className="label">Seller agreement</Link>
              <Link href="/legal/buyer-terms" className="label">Buyer terms</Link>
              <Link href="/legal/fee-disclosure" className="label">Fee disclosure</Link>
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
