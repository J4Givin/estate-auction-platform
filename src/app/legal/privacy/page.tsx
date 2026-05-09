import type { Metadata } from 'next'
import { LegalPage } from '@/components/public/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Estate Liquidity collects, uses, and protects information.',
  alternates: { canonical: '/legal/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={<>Privacy Policy</>}
      intro={<>This placeholder summarizes how Estate Liquidity collects, uses, and protects information collected through our website, intake forms, and client portal. Final policy language will be finalized prior to launch.</>}
      sections={[
        { heading: 'Information We Collect', body: <p>Information you provide via intake forms, including name, contact information, property location, role, estate type, timeline, and item categories. We may collect technical data such as IP address, device type, and browser to operate the site securely.</p> },
        { heading: 'How We Use Information', body: <p>To respond to walkthrough requests, prepare evaluations, communicate about your engagement, and operate the client and partner portals. We do not sell personal information.</p> },
        { heading: 'Sharing', body: <p>We may share information with subprocessors required to operate the service (hosting, email, analytics) under appropriate confidentiality terms. We do not list estate names or client details on the public site.</p> },
        { heading: 'Data Retention', body: <p>We retain intake and engagement records as required for our work and applicable law. You can request deletion of personal information subject to legal retention requirements.</p> },
        { heading: 'Your Choices', body: <p>You can request access, correction, or deletion of your personal information by contacting us. Marketing communications, if any, can be unsubscribed at any time.</p> },
        { heading: 'Contact', body: <p>For privacy questions, contact us at the email address listed on our contact page.</p> },
      ]}
    />
  )
}
