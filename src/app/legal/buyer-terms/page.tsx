import type { Metadata } from 'next'
import { LegalPage } from '@/components/public/LegalPage'

export const metadata: Metadata = {
  title: 'Buyer Terms Overview',
  description: 'Plain-language overview of buyer terms. Final auction terms are disclosed at the listing or sale level.',
  alternates: { canonical: '/legal/buyer-terms' },
  robots: { index: true, follow: true },
}

export default function BuyerTermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={<>Buyer Terms Overview</>}
      intro={<>This placeholder describes typical buyer terms. Final terms — including any buyer premium, payment, pickup, shipping, and return rules — are disclosed at the listing or sale level before bidding or purchase.</>}
      sections={[
        { heading: 'Buyer Premium', body: <p>A buyer premium may apply to auction purchases and is disclosed before bidding. Buyer premiums are standard practice in the auction industry.</p> },
        { heading: 'Condition & Authenticity', body: <p>Items are described based on documented condition and category notes. Authenticity is not guaranteed unless formal third-party authentication or appraisal has been completed.</p> },
        { heading: 'Payment & Pickup', body: <p>Payment terms, pickup windows, and shipping options are disclosed at the listing or sale level. Chain of custody is documented from intake to handoff.</p> },
        { heading: 'Returns', body: <p>Most auction sales are final. Specific return rules, where they apply, are disclosed at the sale level.</p> },
        { heading: 'Disputes', body: <p>Disputes are handled in accordance with the listed sale terms and applicable consumer protection law.</p> },
      ]}
    />
  )
}
