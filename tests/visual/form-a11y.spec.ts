/**
 * Walkthrough form accessibility verification.
 *
 * Validates the request-walkthrough form complies with the brief:
 *   - every input/select/textarea has an id
 *   - every form control has either a label[for=id] or an associated
 *     wrapping <label> (we accept the strict label[for=id] case)
 *   - autocomplete attributes are present on contact fields
 *   - placeholder email "hello@example.com" is not visible on the page
 *   - card-link CTAs (cards) have ≥44px tappable height on mobile
 */
import { expect, test, type Page } from '@playwright/test'

const PAGE = '/request-walkthrough'

test.describe('walkthrough form accessibility', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('every form control has a stable id, name, and associated label', async ({ page }) => {
    await page.goto(PAGE, { waitUntil: 'networkidle' })

    const audit = await page.evaluate(() => {
      const controls = Array.from(
        document.querySelectorAll<HTMLElement>('input, select, textarea')
      )
      const findings: { name: string; id: string; type: string; hasName: boolean; hasLabelFor: boolean; ac: string | null }[] = []
      for (const c of controls) {
        const tag = c.tagName.toLowerCase()
        if (tag === 'input' && (c as HTMLInputElement).type === 'hidden') continue
        const id = c.id
        const name = (c as HTMLInputElement).name || ''
        const ac = c.getAttribute('autocomplete')
        const labelFor = id ? document.querySelector(`label[for="${id}"]`) : null
        findings.push({
          name,
          id,
          type: (c as HTMLInputElement).type || tag,
          hasName: !!name,
          hasLabelFor: !!labelFor,
          ac,
        })
      }
      return findings
    })

    // We expect at least the 11 named form fields from the form
    expect(audit.length).toBeGreaterThanOrEqual(11)

    for (const f of audit) {
      expect(f.id, `control ${f.name || f.type} must have id`).toBeTruthy()
      expect(f.hasName, `control ${f.id} must have name`).toBeTruthy()
      expect(f.hasLabelFor, `control ${f.id} must have label[for=id]`).toBeTruthy()
    }

    // Verify autocomplete attributes on contact-class fields
    const acByName = Object.fromEntries(audit.map(f => [f.name, f.ac]))
    expect(acByName['fullName']).toBe('name')
    expect(acByName['phone']).toBe('tel')
    expect(acByName['email']).toBe('email')
    expect(acByName['cityZip']).toBe('postal-code')
  })

  test('placeholder email hello@example.com is not visible on the page', async ({ page }) => {
    await page.goto(PAGE, { waitUntil: 'networkidle' })
    const text = await page.evaluate(() => document.body.innerText)
    expect(text.toLowerCase()).not.toContain('hello@example.com')
  })

  test('homepage card CTAs are at least 44px tappable on mobile', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const heights = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a.card-link'))
      return links.map(a => Math.round(a.getBoundingClientRect().height))
    })
    expect(heights.length).toBeGreaterThan(0)
    for (const h of heights) {
      expect(h, `card-link height ${h}px should be ≥44`).toBeGreaterThanOrEqual(44)
    }
  })
})
