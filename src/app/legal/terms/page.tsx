import type { Metadata } from 'next'
import { LegalPage } from '@/components/public/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing use of the Estate Liquidity website and client portal.',
  alternates: { canonical: '/legal/terms' },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={<>Terms of Use</>}
      intro={<>This placeholder summarizes the terms governing use of the Estate Liquidity website, intake forms, and portal experiences. Final terms will be finalized prior to launch and will govern in case of conflict with this placeholder.</>}
      sections={[
        { heading: 'Acceptance', body: <p>By using this site, you agree to these terms. If you do not agree, do not use the site.</p> },
        { heading: 'Acceptable Use', body: <p>Do not misuse the site or attempt to disrupt its operation. The site is provided for informational and intake purposes.</p> },
        { heading: 'No Guarantee of Outcome', body: <p>Estimates and appraisal indications are not a guarantee of value. We do not guarantee a specific sale outcome. We do not guarantee authenticity unless formal third-party authentication or appraisal has been completed.</p> },
        { heading: 'Engagement', body: <p>Engagements are governed by your signed seller agreement or partner terms, which take precedence over website language for clients.</p> },
        { heading: 'Intellectual Property', body: <p>Site content is owned by Estate Liquidity or its licensors. Do not republish without permission.</p> },
        { heading: 'Limitation of Liability', body: <p>To the extent permitted by law, our liability for site use is limited. Engagement liabilities are governed by your seller agreement.</p> },
        { heading: 'Contact', body: <p>Questions about these terms? Contact us via the contact page.</p> },
      ]}
    />
  )
}
