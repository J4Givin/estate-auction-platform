import { redirect } from 'next/navigation'

export default function RegisterRedirect() {
  // Account creation happens after a qualified walkthrough/consultation.
  // Software-first signup is intentionally disabled in the public funnel.
  redirect('/request-walkthrough')
}
