import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/public/LegalPage'

export const metadata: Metadata = {
  title: 'Fee Disclosure',
  description: 'Plain-language fee disclosure. Specific percentages and amounts are documented per engagement before any work begins.',
  alternates: { canonical: '/legal/fee-disclosure' },
  robots: { index: true, follow: true },
}

export default function FeeDisclosurePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={<>Fee Disclosure</>}
      intro={<>This placeholder explains the categories of fees that may apply to an engagement. Specific percentages and amounts are documented per engagement before any work begins. See the <Link href="/pricing" className="underline decoration-[#826DEE] underline-offset-4">Pricing</Link> page for the public summary.</>}
      sections={[
        { heading: 'Seller Commission', body: <p>Applied to sold items. Varies by service type and estate scope. Documented in your engagement before work begins.</p> },
        { heading: 'Buyer Premium', body: <p>May apply to auction purchases and is disclosed to buyers before bidding.</p> },
        { heading: 'Optional Formal Appraisal', body: <p>Used when a formal appraisal report is needed for estate, insurance, tax, legal, or high-value purposes. Quoted by scope and intended use.</p> },
        { heading: 'Optional Transport, Storage, Cleanout', body: <p>When pickup, secure storage, or cleanout coordination is required, these services are quoted separately based on scope and timeline.</p> },
        { heading: 'Specialist Authentication', body: <p>When a category warrants third-party authentication, those fees are disclosed in advance. Some labs charge per item or per category.</p> },
        { heading: 'Settlement Timing', body: <p>Itemized settlement statements are issued after sale completion, buyer payment confirmation, and pickup or shipping confirmation.</p> },
        { heading: 'Disclaimers', body: <p>Estimates and appraisal indications are not a guarantee of value. We do not guarantee a specific sale outcome. We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed.</p> },
      ]}
    />
  )
}
