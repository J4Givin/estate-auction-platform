/**
 * Hero / fixed-header overlap verification.
 *
 * For each route × viewport, this measures:
 *   - the fixed header bottom edge (getBoundingClientRect)
 *   - the first visible h1 top edge
 *   - documentElement scrollWidth (horizontal overflow)
 *
 * Pass criteria:
 *   - no horizontal overflow (scrollWidth <= viewport + 4)
 *   - if a fixed/sticky header exists at top, h1Top >= headerBottom + 8
 */
import { expect, test, type Page } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'

const ROUTES = ['/', '/request-walkthrough', '/portal'] as const

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1024', width: 1024, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const

const OUT_DIR = path.resolve(__dirname, 'output')
const SCREENS_DIR = path.join(OUT_DIR, 'header-overlap')
const REPORT_PATH = path.join(OUT_DIR, 'header-overlap.json')

type Measurement = {
  route: string
  viewport: string
  width: number
  height: number
  scrollWidth: number
  headerBottom: number | null
  h1Top: number | null
  h1Text: string | null
  pass: boolean
  reason?: string
}

const results: Measurement[] = []

test.beforeAll(() => {
  fs.mkdirSync(SCREENS_DIR, { recursive: true })
})

test.afterAll(() => {
  fs.writeFileSync(REPORT_PATH, JSON.stringify({ results }, null, 2))
})

async function measure(page: Page) {
  return await page.evaluate(() => {
    const scrollWidth = document.documentElement.scrollWidth
    // Find the topmost fixed/sticky element acting as a header
    const candidates = Array.from(document.querySelectorAll<HTMLElement>('header, [role="banner"]'))
    let headerBottom: number | null = null
    for (const el of candidates) {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      if ((cs.position === 'fixed' || cs.position === 'sticky') && r.top <= 4 && r.height > 0) {
        headerBottom = r.bottom
        break
      }
    }
    // First visible h1
    const h1s = Array.from(document.querySelectorAll<HTMLElement>('h1'))
    let h1Top: number | null = null
    let h1Text: string | null = null
    for (const h of h1s) {
      const r = h.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        h1Top = r.top
        h1Text = (h.textContent ?? '').trim().slice(0, 80)
        break
      }
    }
    return { scrollWidth, headerBottom, h1Top, h1Text }
  })
}

for (const vp of VIEWPORTS) {
  test.describe(`viewport ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    for (const route of ROUTES) {
      test(`${route}`, async ({ page }) => {
        const resp = await page.goto(route, { waitUntil: 'domcontentloaded' })
        expect(resp?.ok() || resp?.status() === 304, `nav ok ${route}`).toBeTruthy()
        await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
        // Allow fonts/layout to settle for a stable getBoundingClientRect.
        await page.waitForTimeout(300)
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(50)

        const m = await measure(page)
        const slug = route.replace(/[\/]/g, '_').replace(/^_+|_+$/g, '') || 'root'
        await page.screenshot({
          path: path.join(SCREENS_DIR, `${vp.name}__${slug}.png`),
          fullPage: false,
        })

        const reasons: string[] = []
        const noHorizontalOverflow = m.scrollWidth <= vp.width + 4
        if (!noHorizontalOverflow) reasons.push(`scrollWidth=${m.scrollWidth} > ${vp.width}`)

        let headerOk = true
        if (m.headerBottom != null) {
          if (m.h1Top == null) {
            // No h1 on portal page — that's fine if the page uses a different shell.
          } else if (m.h1Top < m.headerBottom + 8) {
            headerOk = false
            reasons.push(`h1Top=${m.h1Top} < headerBottom+8 (${m.headerBottom + 8})`)
          }
        }

        const pass = noHorizontalOverflow && headerOk
        results.push({
          route,
          viewport: vp.name,
          width: vp.width,
          height: vp.height,
          scrollWidth: m.scrollWidth,
          headerBottom: m.headerBottom,
          h1Top: m.h1Top,
          h1Text: m.h1Text,
          pass,
          reason: reasons.length ? reasons.join('; ') : undefined,
        })

        expect(noHorizontalOverflow, `horizontal overflow ${route} @ ${vp.name}: scrollWidth=${m.scrollWidth} viewport=${vp.width}`).toBeTruthy()
        expect(headerOk, `header overlap ${route} @ ${vp.name}: headerBottom=${m.headerBottom} h1Top=${m.h1Top}`).toBeTruthy()
      })
    }
  })
}
