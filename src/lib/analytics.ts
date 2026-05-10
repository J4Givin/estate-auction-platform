/**
 * Vendor-neutral analytics shim.
 *
 * Why this exists:
 * - We don't have a real analytics vendor key yet (see
 *   docs/real-launch-readiness.md → "Analytics / conversion readiness").
 * - We DO want every CTA click and form submission to be observable from
 *   day one, so when a vendor (GA4 / PostHog / Plausible / Segment) is
 *   added later, every event already has a stable name and shape.
 *
 * Add a vendor:
 *   1. Set NEXT_PUBLIC_<vendor>_KEY in Vercel env.
 *   2. In the vendor's `init`, listen for `window.estateAnalytics?.send`
 *      or replace the `dispatch` function below.
 *   3. No event call sites need to change.
 *
 * Debug locally:
 *   NEXT_PUBLIC_ANALYTICS_DEBUG=true npm run dev
 *   → every event is console.logged with shape `[analytics] name {props}`.
 */

export type AnalyticsEvent =
  | "cta_click"
  | "lead_submitted"
  | "lead_submit_failed"
  | "walkthrough_form_started"
  | "page_view"

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

type Dispatcher = (event: AnalyticsEvent, props?: AnalyticsProps) => void

declare global {
  interface Window {
    estateAnalytics?: {
      send: Dispatcher
    }
  }
}

const debugEnabled = (): boolean => {
  if (typeof process === "undefined") return false
  return process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true"
}

const dispatch: Dispatcher = (event, props) => {
  if (typeof window === "undefined") return

  // Vendor hook — if a vendor adapter has registered itself on window,
  // delegate to it. Otherwise this is a noop-with-debug.
  if (window.estateAnalytics?.send && window.estateAnalytics.send !== dispatch) {
    try {
      window.estateAnalytics.send(event, props)
    } catch {
      // Vendor failures must never break the page.
    }
  }

  if (debugEnabled()) {
    console.log(`[analytics] ${event}`, props ?? {})
  }
}

if (typeof window !== "undefined") {
  // Expose so a vendor adapter loaded later can read the most recent
  // dispatcher and so other modules can call through `window` as a
  // backstop.
  window.estateAnalytics = window.estateAnalytics ?? { send: dispatch }
}

/**
 * Track an event by name. Safe to call from server components — it will
 * noop on the server.
 */
export function trackEvent(event: AnalyticsEvent, props?: AnalyticsProps) {
  dispatch(event, props)
}

/**
 * Install the delegated CTA listener. Mount once at the app root.
 *
 * Looks for `data-cta="..."` on any clicked element (or its ancestor
 * `<a>` / `<button>`) and emits `cta_click` with `{ id, href }`.
 */
export function installCtaListener() {
  if (typeof window === "undefined") return
  if ((window as unknown as { __estateCtaListenerInstalled?: boolean }).__estateCtaListenerInstalled) return
  ;(window as unknown as { __estateCtaListenerInstalled?: boolean }).__estateCtaListenerInstalled = true

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null
      if (!target) return
      const el = target.closest<HTMLElement>("[data-cta]")
      if (!el) return
      const id = el.getAttribute("data-cta") ?? ""
      const href = (el as HTMLAnchorElement).href ?? null
      trackEvent("cta_click", { id, href })
    },
    { capture: true, passive: true }
  )
}
