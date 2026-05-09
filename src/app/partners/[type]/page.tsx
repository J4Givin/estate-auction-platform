import { redirect } from 'next/navigation'

const REDIRECTS: Record<string, string> = {
  realtor: '/for/realtors',
  realtors: '/for/realtors',
  probate: '/for/attorneys',
  attorney: '/for/attorneys',
  attorneys: '/for/attorneys',
  fiduciary: '/for/attorneys',
  fiduciaries: '/for/attorneys',
  family: '/for/families',
  families: '/for/families',
  senior: '/for/families',
  organizer: '/for/families',
  mover: '/for/families',
}

export default async function PartnerTypeRedirect({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const target = REDIRECTS[type?.toLowerCase()] ?? '/partners'
  redirect(target)
}
