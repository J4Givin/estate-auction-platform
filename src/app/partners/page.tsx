import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicShell } from '@/components/public/PublicShell'
import { PageHero, Section, CTABanner } from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Partner Program — Refer an Estate',
  description:
    'A reliable estate liquidation resource for realtors, attorneys, fiduciaries, senior move managers, organizers, and property professionals.',
  alternates: { canonical: '/partners' },
}

const AUDIENCES = [
  { t: 'Realtors', b: 'Faster client closings, less staging stress.', href: '/for/realtors' },
  { t: 'Probate & trust attorneys', b: 'Court-ready inventory and itemized reports.', href: '/for/attorneys' },
  { t: 'Fiduciaries', b: 'Documented disposition with seller approvals.', href: '/for/attorneys' },
  { t: 'Senior move managers', b: 'Coordinated downsizing and donation receipts.', href: '/for/families' },
  { t: 'Professional organizers', b: 'Sale-ready inventory plus cleanout.', href: '/for/families' },
  { t: 'Property managers', b: 'Property-ready turnover after estate clearance.', href: '/for/realtors' },
  { t: 'Assisted living communities', b: 'Compassionate transitions for incoming residents.', href: '/for/families' },
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
        eyebrow="Partner Program"
        title={<>Help clients clear estates faster, with less friction.</>}
        intro={<>Our partner program gives realtors, attorneys, fiduciaries, and estate professionals a reliable liquidation resource for clients who need inventory, valuation, sale coordination, and final settlement reporting.</>}
      />

      <Section>
        <span className="label block mb-5">Who we work with</span>
        <h2 className="display-lg max-w-[18ch]">Built for the people clients trust.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mt-12 border-t border-[#E0E0E0]">
          {AUDIENCES.map(a => (
            <Link key={a.t} href={a.href}
              className="group block px-0 md:px-6 py-8 border-b border-r border-[#E0E0E0] last:border-r-0">
              <h3 className="text-[18px] md:text-[20px] mb-3 group-hover:text-[#826DEE] transition-colors"
                  style={{ fontFamily: 'var(--font-body-family)', fontWeight: 500 }}>
                {a.t}
              </h3>
              <p className="body-light leading-relaxed text-[14px]">{a.b}</p>
              <span className="label text-[#826DEE] mt-4 block">Learn more →</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="program" className="bg-[#F5F5F5]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <span className="label block mb-5">Program benefits</span>
            <h2 className="display-lg max-w-[14ch]">Designed for repeat collaboration.</h2>
            <p className="body-light mt-6 max-w-md leading-relaxed">
              Our partner program is for professionals who refer estate situations regularly. We track referrals, share status, and produce documentation your downstream work needs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/partner" className="btn btn-ink">Open partner portal →</Link>
              <Link href="/contact" className="btn btn-outline">Talk to us</Link>
            </div>
          </div>
          <div className="md:col-span-7 border-t border-[#E0E0E0]">
            {BENEFITS.map(b => (
              <div key={b} className="border-b border-[#E0E0E0] py-4 flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#826DEE] mt-2.5 flex-shrink-0" aria-hidden />
                <span className="body-light text-[15px] text-[#0A0A0A]">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTABanner heading="Refer an estate or become a partner." body="Submit a referral or open the partner portal to get started." secondaryHref="/partner" secondaryLabel="Open Partner Portal" />
    </PublicShell>
  )
}
