import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { SampleBanner } from '@/components/portal/SampleBanner'

export const metadata: Metadata = {
  title: 'Operations',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function OpsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SampleBanner label="Operations Console — Sample / Demo" detail="Internal tool. Anonymized data only. Not a public surface." />
      {children}
    </>
  )
}
