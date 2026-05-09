import type { Metadata } from 'next'
import { LegalPage } from '@/components/public/LegalPage'

export const metadata: Metadata = {
  title: 'Seller Agreement Overview',
  description: 'Plain-language overview of the seller engagement. Final agreement language is provided before any work begins.',
  alternates: { canonical: '/legal/seller-agreement' },
  robots: { index: true, follow: true },
}

export default function SellerAgreementPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={<>Seller Agreement Overview</>}
      intro={<>This placeholder describes the typical scope of our seller engagement. Each engagement is documented in a signed agreement before any work begins, with the recommended strategy, expected costs, commission structure, and settlement timeline.</>}
      sections={[
        { heading: 'Scope of Service', body: <p>Inventory, photography, listing, buyer management, pickup or shipping coordination, and itemized settlement. Specialist authentication, transport, storage, or cleanout coordination are quoted separately when required.</p> },
        { heading: 'Approvals & Reserves', body: <p>You approve key items, suggested estimates, reserves, and channel before publication. Items can be withdrawn before going live.</p> },
        { heading: 'Authentication Limits', body: <p>We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed. High-risk or high-value items may be held from sale until review is complete.</p> },
        { heading: 'Unsold Items', body: <p>Re-listing at a revised reserve, alternative channels, donation with documented receipt, or coordinated disposal — always with your approval.</p> },
        { heading: 'Settlement', body: <p>Itemized settlement statement is issued after sale completion, buyer payment, and pickup or shipping confirmation. Net proceeds are paid on the schedule outlined in your engagement.</p> },
        { heading: 'Insurance & Care', body: <p>Items in our possession are handled with documented chain of custody. Insurance scope is described in the engagement.</p> },
      ]}
    />
  )
}
