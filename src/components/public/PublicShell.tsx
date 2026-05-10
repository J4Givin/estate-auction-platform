import { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ background: '#FBF8F1', color: '#1E1B17' }}
    >
      <SiteHeader />
      <main
        id="main"
        className="flex-1 public-main-with-header"
        style={{ paddingTop: 'calc(var(--public-header-h, 68px) + env(safe-area-inset-top, 0px))' }}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
