import { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col overflow-x-hidden">
      <SiteHeader />
      <main id="main" className="flex-1 pt-16">{children}</main>
      <SiteFooter />
    </div>
  )
}
