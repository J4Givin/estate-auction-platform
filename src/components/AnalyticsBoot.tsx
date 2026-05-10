"use client"
import { useEffect } from "react"
import { installCtaListener } from "@/lib/analytics"

/**
 * Mount once at the root layout. Installs a delegated `data-cta` click
 * listener so every CTA tagged with `data-cta="..."` automatically emits
 * a `cta_click` event. No effect unless a vendor adapter has registered
 * itself, except for console output when NEXT_PUBLIC_ANALYTICS_DEBUG=true.
 */
export function AnalyticsBoot() {
  useEffect(() => {
    installCtaListener()
  }, [])
  return null
}
