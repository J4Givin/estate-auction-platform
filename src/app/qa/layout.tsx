import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { SampleBanner } from '@/components/portal/SampleBanner'

export const metadata: Metadata = {
  title: 'QA Review',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function QaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SampleBanner label="QA Review — Sample / Demo" detail="Internal tool. Anonymized data only. Not a public surface." />
      {children}
    </>
  )
}
