import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { SampleBanner } from '@/components/portal/SampleBanner'

export const metadata: Metadata = {
  title: 'Client Portal',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SampleBanner label="Client Portal — Sample Preview" detail="Anonymized sample data — does not represent any real client estate." />
      {children}
    </>
  )
}
