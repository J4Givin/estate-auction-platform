import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Partner program — Refer an estate',
  description:
    'A discreet estate-disposition resource for realtors, attorneys, fiduciaries, senior move managers, organizers, and property professionals.',
  alternates: { canonical: '/partners' },
}

const AUDIENCES = [
  { t: 'Realtors', b: 'Faster client closings, less staging stress.', href: '/for/realtors' },
  { t: 'Probate & trust attorneys', b: 'Court-ready inventory and itemized reports.', href: '/for/attorneys' },
  { t: 'Fiduciaries', b: 'Documented disposition with seller approvals.', href: '/for/attorneys' },
  { t: 'Senior move managers', b: 'Coordinated downsizing and donation receipts.', href: '/for/families' },
  { t: 'Professional organizers', b: 'Sale-ready inventory plus cleanout.', href: '/for/families' },
  { t: 'Property managers', b: 'Property-ready turnover after estate clearance.', href: '/for/realtors' },
  { t: 'Assisted-living communities', b: 'Compassionate transitions for incoming residents.', href: '/for/families' },
  { t: 'Funeral homes & wealth managers', b: 'A trusted hand-off resource for sensitive moments.', href: '/for/attorneys' },
]

const BENEFITS = [
  'Fast client intake and acknowledgement',
  'Transparent process from walkthrough to settlement',
  'Itemized reporting suitable for client and legal review',
  'Referral tracking and shared updates',
  'Estate-ready documentation for downstream needs',
  'Cleanout coordination for property turnover',
  'Reduced client burden and emotional load',
  'Better recovery value through right-channel routing',
]

export default function PartnersPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Partner program"
        title={<>A reliable disposition partner for the professionals clients trust.</>}
        intro={<>Our partner program gives realtors, attorneys, fiduciaries, and estate professionals a discreet, defensible disposition resource for clients who need inventory, valuation, sale coordination, and itemized settlement reporting.</>}
      />

      <Section surface="parchment">
        <span className="brass-rule mb-5 block" aria-hidden />
        <span className="label block mb-4">Who we work with</span>
        <h2 className="heading-advisory max-w-[18ch]">Built for the people clients trust.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {AUDIENCES.map(a => (
            <Link key={a.t} href={a.href} className="group card-advisory block h-full">
              <span className="brass-rule mb-4 block" aria-hidden />
              <h3 className="transition-colors" style={{
                fontFamily: 'var(--font-display-family)',
                fontWeight: 400, fontSize: 19, lineHeight: 1.2,
                letterSpacing: '-0.01em', color: '#1E1B17', marginBottom: 10,
              }}>
                {a.t}
              </h3>
              <p className="body-light leading-relaxed text-[14px]">{a.b}</p>
              <span className="label mt-4 block" style={{ color: '#9A7A3C' }}>Learn more →</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="program" surface="ivory">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <span className="brass-rule mb-5 block" aria-hidden />
            <span className="label block mb-4">Program benefits</span>
            <h2 className="heading-advisory max-w-[14ch]">Designed for repeat collaboration.</h2>
            <p className="body-warm mt-6 max-w-md leading-relaxed">
              Our partner program is for professionals who refer estate situations regularly. We track referrals, share status, and produce documentation your downstream work needs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/partner" className="btn btn-primary">Open partner portal</Link>
              <Link href="/contact" className="btn btn-outline">Speak with an advisor</Link>
            </div>
          </div>
          <div className="md:col-span-7" style={{ borderTop: '1px solid #E5DECF' }}>
            {BENEFITS.map(b => (
              <div key={b} className="py-4 flex items-start gap-4" style={{ borderBottom: '1px solid #E5DECF' }}>
                <span className="brass-rule mt-3 flex-shrink-0" aria-hidden style={{ width: 18 }} />
                <span className="body-warm" style={{ fontSize: 15 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTABanner heading="Refer an estate or become a partner." body="Submit a referral or open the partner portal to get started." secondaryHref="/partner" secondaryLabel="Open partner portal" />
    </PublicShell>
  )
}
