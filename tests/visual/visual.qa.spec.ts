/**
 * Visual QA harness for the estate liquidity platform.
 *
 * What this checks (per route × viewport):
 *   - page renders (no 5xx, no crash)
 *   - no horizontal overflow (documentElement.scrollWidth ≤ viewport + slack)
 *   - no severe console errors (filtered: hydration warnings ignored)
 *   - sticky bottom nav/action bars don't hide content (heuristic: page can
 *     be scrolled to within `safe-area`-equivalent of bottom)
 *   - tap targets on mobile viewports (heuristic: <button>/<a>/<input> with
 *     bounding box height < 36px on mobile flagged but not failed)
 *
 * Output:
 *   - Full-page screenshots → tests/visual/output/screens/<route>-<vp>.png
 *   - Findings summary       → tests/visual/output/findings.json
 *
 * Demo mode:
 *   - The harness boots `next start` without Supabase env. Routes must
 *     render with sample data so QA does not require a live DB.
 */

import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'

const ROUTES = [
  '/',
  '/portal',
  '/portal/inventory',
  '/portal/offers',
  '/portal/ledger',
  '/portal/donations',
  '/portal/appraisal',
  '/portal/experts',
  '/portal/capture',
  '/portal/channels',
  '/portal/compliance',
  '/portal/statements',
  '/portal/receipts',
  '/portal/items/ITM-1041',
] as const

// Internal-console routes that must redirect anonymous visitors to the
// sign-in page. We assert the redirect rather than screenshotting the
// console — exposing internal surfaces to the QA harness would defeat the
// gating itself. /admin is included so we have a stable regression check
// alongside /ops and /qa.
const INTERNAL_GATED_ROUTES = ['/admin', '/ops', '/ops/command', '/qa'] as const

const VIEWPORTS = [
  { name: 'mobile-narrow', width: 375, height: 812 },
  { name: 'mobile-standard', width: 390, height: 844 },
  { name: 'mobile-large', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const OUT_DIR = path.resolve(__dirname, 'output')
const SCREENS_DIR = path.join(OUT_DIR, 'screens')
const FINDINGS_PATH = path.join(OUT_DIR, 'findings.json')

interface Finding {
  route: string
  viewport: string
  severity: 'error' | 'warn'
  kind: string
  detail: string
}

const findings: Finding[] = []

test.beforeAll(() => {
  fs.mkdirSync(SCREENS_DIR, { recursive: true })
  if (fs.existsSync(FINDINGS_PATH)) fs.unlinkSync(FINDINGS_PATH)
})

test.afterAll(() => {
  fs.writeFileSync(FINDINGS_PATH, JSON.stringify({ findings }, null, 2))
})

function isIgnorableConsole(msg: ConsoleMessage): boolean {
  const t = msg.text()
  // Next.js dev hydration warnings, fast-refresh chatter, expected demo
  // messages. Keep this list tight — anything else is a real failure.
  return (
    /hydration|Fast Refresh|\[Fast Refresh\]/i.test(t) ||
    /downloading the React DevTools/i.test(t) ||
    /Download the React DevTools/i.test(t)
  )
}

async function checkOverflow(page: Page, route: string, vp: string, vpWidth: number) {
  const docWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  // Allow a small slack for vertical scrollbar reservation.
  if (docWidth > vpWidth + 4) {
    findings.push({
      route,
      viewport: vp,
      severity: 'error',
      kind: 'horizontal-overflow',
      detail: `scrollWidth=${docWidth}px exceeds viewport ${vpWidth}px`,
    })
  }
}

async function checkTapTargets(page: Page, route: string, vp: string) {
  const small = await page.evaluate(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('button, a[href], input, [role="button"]'),
    )
    const offenders: Array<{ tag: string; w: number; h: number; text: string }> = []
    for (const el of els) {
      const r = el.getBoundingClientRect()
      // Skip invisible/zero-sized.
      if (r.width === 0 || r.height === 0) continue
      // Skip pure decorative icons inside larger buttons (they are not the
      // interactive target — the parent <button> is).
      if (el.tagName === 'svg') continue
      if (r.height < 32 || r.width < 32) {
        offenders.push({
          tag: el.tagName,
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: (el.textContent ?? '').trim().slice(0, 40),
        })
      }
    }
    return offenders.slice(0, 10)
  })
  for (const o of small) {
    findings.push({
      route,
      viewport: vp,
      severity: 'warn',
      kind: 'tap-target-small',
      detail: `${o.tag} ${o.w}×${o.h}px "${o.text}"`,
    })
  }
}

async function checkBottomBarObstruction(page: Page, route: string, vp: string) {
  // Heuristic: if a fixed/bottom element exists, ensure the page has
  // bottom padding ≥ the bar height so the last interactive element is not
  // hidden behind it.
  const issue = await page.evaluate(() => {
    const stickyBars = Array.from(document.querySelectorAll<HTMLElement>('*')).filter((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      const isFixed = cs.position === 'fixed' || cs.position === 'sticky'
      const atBottom = Math.abs(r.bottom - window.innerHeight) < 4
      return isFixed && atBottom && r.height >= 40 && r.height <= 200
    })
    if (!stickyBars.length) return null
    const bar = stickyBars[0]
    const barH = Math.round(bar.getBoundingClientRect().height)
    const bodyPb = parseFloat(getComputedStyle(document.body).paddingBottom) || 0
    const main = document.querySelector('main')
    const mainPb = main ? parseFloat(getComputedStyle(main).paddingBottom) || 0 : 0
    if (Math.max(bodyPb, mainPb) + 4 < barH) {
      return { barH, bodyPb: Math.round(bodyPb), mainPb: Math.round(mainPb) }
    }
    return null
  })
  if (issue) {
    findings.push({
      route,
      viewport: vp,
      severity: 'warn',
      kind: 'sticky-bottom-obstruction',
      detail: `bar=${issue.barH}px main padding-bottom=${issue.mainPb}px body=${issue.bodyPb}px`,
    })
  }
}

for (const vp of VIEWPORTS) {
  test.describe(`viewport ${vp.name} ${vp.width}x${vp.height}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    for (const route of ROUTES) {
      test(`${route}`, async ({ page }) => {
        const consoleErrors: string[] = []
        const failedRequests: string[] = []
        page.on('console', (msg) => {
          if (msg.type() === 'error' && !isIgnorableConsole(msg)) {
            consoleErrors.push(msg.text())
          }
        })
        page.on('pageerror', (err) => {
          consoleErrors.push(`pageerror: ${err.message}`)
        })
        page.on('response', (resp) => {
          if (resp.status() === 404) {
            failedRequests.push(`${resp.status()} ${resp.url()}`)
          }
        })

        const resp = await page.goto(route, { waitUntil: 'domcontentloaded' })
        const status = resp?.status() ?? 0
        if (status >= 500) {
          findings.push({
            route,
            viewport: vp.name,
            severity: 'error',
            kind: 'server-error',
            detail: `HTTP ${status}`,
          })
        }

        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

        await checkOverflow(page, route, vp.name, vp.width)
        if (vp.width <= 430) {
          await checkTapTargets(page, route, vp.name)
          await checkBottomBarObstruction(page, route, vp.name)
        }

        if (consoleErrors.length) {
          findings.push({
            route,
            viewport: vp.name,
            severity: 'error',
            kind: 'console-error',
            detail: consoleErrors.slice(0, 3).join(' | '),
          })
        }
        if (failedRequests.length) {
          findings.push({
            route,
            viewport: vp.name,
            severity: 'warn',
            kind: 'failed-request',
            detail: failedRequests.slice(0, 5).join(' | '),
          })
        }

        // Always capture a screenshot for visual diffing later.
        const slug = route.replace(/[\/]/g, '_').replace(/^_+|_+$/g, '') || 'root'
        await page
          .screenshot({
            path: path.join(SCREENS_DIR, `${vp.name}__${slug}.png`),
            fullPage: true,
          })
          .catch(() => {})

        // Hard-fail only on errors. Warnings are recorded but don't fail
        // the suite — they're surfaced for manual review.
        const errs = findings.filter(
          (f) => f.route === route && f.viewport === vp.name && f.severity === 'error',
        )
        expect(errs, `errors on ${route} @ ${vp.name}: ${JSON.stringify(errs)}`).toEqual([])
      })
    }
  })
}

test.describe('internal consoles gate anonymous visitors', () => {
  for (const route of INTERNAL_GATED_ROUTES) {
    test(`${route} redirects to /auth/login`, async ({ page }) => {
      const resp = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(resp, `no response for ${route}`).not.toBeNull()
      const finalUrl = new URL(page.url())
      expect(finalUrl.pathname, `expected redirect for ${route}`).toBe('/auth/login')
      expect(finalUrl.searchParams.get('redirect')).toBe(route)
    })
  }
})
