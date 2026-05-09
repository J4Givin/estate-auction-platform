import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { SampleBanner } from '@/components/portal/SampleBanner'

export const metadata: Metadata = {
  title: 'Partner Portal',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SampleBanner label="Partner Portal — Sample Preview" detail="Anonymized sample data — does not represent any real partner activity." />
      {children}
    </>
  )
}
