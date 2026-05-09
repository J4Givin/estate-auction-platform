# Responsive QA — Customer Portal & Ops Console

This is the QA checklist used after each portal/ops UI change. The platform
targets a **native-app feel** on mobile and a **command-center feel** on
desktop.

## Viewport targets

| Class | Size | Notes |
|---|---|---|
| Mobile narrow | 375 × 812 | iPhone SE / 13 mini |
| Mobile small | 390 × 844 | iPhone 13/14 |
| Mobile large | 430 × 932 | iPhone 14/15 Pro Max |
| Tablet | 768 × 1024 | iPad portrait |
| Desktop | 1440 × 900 | MacBook Pro 14" baseline |

## Mobile-native quality bar

- [ ] No horizontal overflow (`body { overflow-x: hidden; }` is a backstop, not a fix).
- [ ] All interactive targets ≥ 44 × 44 px (`.tap-target` utility, plus the
      global mobile `min-height: 44px` for inputs/selects/buttons).
- [ ] iOS auto-zoom disabled — inputs use ≥ 16 px font size on phone widths
      (enforced via global CSS).
- [ ] Sticky bottom action bar respects `env(safe-area-inset-bottom)` and
      the main content has matching bottom padding so CTAs aren't hidden.
- [ ] Edge padding 16–20 px on mobile (`px-5 sm:px-8 …` on `AppShell`).
- [ ] Display headlines clamp down to ≤ 2.0 rem at 375 w so they don't
      cause horizontal pressure (`clamp(2rem, 7vw, 6rem)` in PageHeader).
- [ ] Tables → cards/timelines/segmented controls on phone widths
      (audit, offers, ledger, statements, inventory all do this).
- [ ] Modals/sheets feel like sheets, not desktop dialogs squeezed onto a phone.

## Desktop quality bar

- [ ] Clear command-center hierarchy on `/ops`, `/ops/command`, `/ops/insights`,
      `/ops/audit`.
- [ ] Tables/grids aligned; no mixed font tracking on the same column.
- [ ] Filters stay anchored without floating awkwardly when content scrolls.
- [ ] Page max-width clamped to 1440 px; padding scales up at `xl:px-20`.
- [ ] No clipped content above sticky headers; `pt-14` on `<main>` matches
      the 56 px top rail.

## Routes & status

The static review below was performed on the working tree at the time the
idempotency / mobile-polish phase shipped. UI tests are not yet wired into
CI; this checklist runs by hand or via the headless-browser harness when
that is set up.

### Customer portal

| Route | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|
| `/portal` | ✅ | ✅ | ✅ | Bank-style balance card; ATM action row scales 4-up. |
| `/portal/inventory` | ✅ | ✅ | ✅ | Single-column rows on mobile, 12-col grid on desktop. Filters wrap. |
| `/portal/items/[itemId]` | ✅ | ✅ | ✅ | Decision sheet uses Vaul drawer on mobile. |
| `/portal/offers` | ✅ | ✅ | ✅ | Offer cards stack vertically on mobile, 3-up on desktop. |
| `/portal/ledger` | ✅ | ✅ | ✅ | Filter chips, mobile-friendly transaction rows. |
| `/portal/donations` | ✅ | ✅ | ✅ | Charity selection chips, full-width on phone. |
| `/portal/appraisal` | ✅ | ✅ | ✅ | Pipeline component is horizontal-scroll-aware on phone. |
| `/portal/experts` | ✅ | ✅ | ✅ | Card grid 1/2/3 columns at sm/md/lg. |
| `/portal/capture` | ✅ | ✅ | ✅ | Room tabs scroll horizontally on phone; checklist toggles ≥ 44 px. |
| `/portal/channels` | ✅ | ✅ | ✅ | Channel matrix uses `overflow-x-auto` for wide tables. |
| `/portal/compliance` | ✅ | ✅ | ✅ | Strip layout collapses to stack on mobile. |
| `/portal/statements` | ✅ | ✅ | ✅ | Two-column grid on mobile (period+id / status). Hidden header row on phone. |
| `/portal/receipts` | ✅ | ✅ | ✅ | TrustReceipt cards stack 1-up on mobile. |

### Ops/admin

| Route | Mobile | Tablet | Desktop | Notes |
|---|---|---|---|---|
| `/ops` | ✅ | ✅ | ✅ | Stat tiles 2-col → 4-col. |
| `/ops/command` | ✅ | ✅ | ✅ | Timeline scrolls vertically. |
| `/ops/insights` | ✅ | ✅ | ✅ | Charts scale; legends wrap. |
| `/ops/audit` | ✅ | ✅ | ✅ | Stat tiles `grid-cols-2 lg:grid-cols-4`; filter row `grid-cols-1 sm:grid-cols-2 lg:grid-cols-6`. |

## Headless-browser limitation

The current sandbox does not have Playwright/Chromium available so the
visual sweep is a **layout/code review** plus a successful production
build. When the screenshot harness is wired up (`npm run qa:screens` is
the planned alias) a visual diff per viewport will replace the static
checkmarks above.

## Mobile bottom-tab navigation

Customer portal mobile sessions now mount a four-tab bottom nav at the
physical bottom of the viewport:

| Tab | Route | Active rule |
|---|---|---|
| Overview  | `/portal`           | exact match |
| Inventory | `/portal/inventory` | exact + nested |
| Offers    | `/portal/offers`    | exact + nested |
| Ledger    | `/portal/ledger`    | exact + nested |

Implementation: `src/components/portal/MobileBottomTabs.tsx`. Mounted by
`AppShell` only when `role === 'customer'` *and* the route starts with
`/portal`, so marketing, ops, admin and partner consoles are unaffected.

Quality bar:

- 60 px tab height + safe-area-inset-bottom.
- 44 px tap targets (the entire grid cell is the link).
- Inline SVG icons (no extra runtime cost) plus a 9 px mono label.
- Active tab uses customer accent `#826DEE` plus an inset top rail and
  bold weight, with `aria-current="page"`.
- Pure links — no JS state — so route prefetch works and SSR is correct.
- Coexists with `MobileBottomBar` / `MobileActionBar`: AppShell sets
  `--portal-bar-bottom` and `--portal-bar-pb` CSS vars on its root so
  those bars stack directly above the tab strip and main content adds
  matching bottom padding, never hiding CTAs.

## Pull-to-refresh

`PullToRefresh` wraps the customer portal content tree on the routes
listed below. It is installed once in `AppShell`, so individual pages
do not have to opt in.

- `/portal`, `/portal/inventory`, `/portal/offers`, `/portal/ledger`
- `/portal/donations`, `/portal/appraisal`, `/portal/experts`
- `/portal/capture`, `/portal/channels`, `/portal/compliance`
- `/portal/statements`, `/portal/receipts`

Behaviour:

- Engages only when the document is scrolled to the top (`window.scrollY === 0`).
- Requires the gesture to be primarily vertical (`|dy| / |dx| ≥ 1.4`)
  so it does not fight the horizontal segmented controls / channel
  matrix / appraisal pipeline rails.
- Applies a 0.55 resistance curve and clamps at 110 px — the page never
  feels "rubber-band-stuck".
- Trigger threshold: 72 px. Indicator copy steps through
  *Pull to refresh → Release to refresh → Refreshing estate ledger…*.
- Default action calls `router.refresh()` which re-runs server reads
  (live Supabase mode) or re-pulls demo fixtures.
- Honours `prefers-reduced-motion` — no transform animation, just the
  status indicator.
- Mobile-only: indicator is `md:hidden`, transform is harmless on
  desktop where touch events do not fire.
- `passive: true` listeners — never blocks normal scroll.

## Native-feel improvements landed this phase

- Headline clamp tightened to `clamp(2rem, 7vw, 6rem)` so 375-wide
  devices don't get horizontal pressure.
- `SectionCard` heading clamp tightened to `clamp(1.25rem, 4vw, 2.8rem)`
  and the title row now wraps when actions are present.
- `AppShell` content padding bumped from `px-4` → `px-5` on mobile and
  `py-8` → `py-10` so the page feels less cramped against the sticky top
  rail and bottom bar.
- Global mobile control sizing: inputs/selects/textareas/buttons are
  forced to ≥ 44 px tall and 16 px font on phone widths.
- `MobileBottomBar` was already safe-area-aware; verified
  `paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)'` on `<main>`
  matches the 64 px bar + 16 px breathing room so CTAs are not obscured.
