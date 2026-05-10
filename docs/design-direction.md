# Estate Liquidity — Design Direction

## What was wrong (cold-read critique of the prior direction)

The previous public site read as **brutalist editorial / fashion poster**, not as a
private estate-advisory firm.

- **Typography failure.** Barlow Condensed at 800/900 weight, all-caps, oversize
  display set the entire emotional tone. For grieving families, executors,
  trustees, fiduciaries, and attorneys this read as loud, stressful, and
  juvenile — the opposite of quiet authority.
- **Color failure.** Stark white + black + violet (#826DEE) blocks felt
  tech-brutalist. Estate advisory should feel calm, discreet, and warm —
  closer to a family office or a boutique auction house than a SaaS dashboard.
- **Hierarchy failure.** Card grids dominated. The site looked like a
  prototype for a dashboard product instead of a service company.
- **Tone failure on the portal.** "Take Cash", "instant liquidity engine",
  yellow ATM tile — fintech gamification overrode fiduciary care. The
  underlying capability is correct (financial-account-like control of an
  estate); the language was wrong.
- **Emotional failure.** The hero communicated facts, not reassurance. There
  was no acknowledgement that estates often arrive under grief, deadline, or
  legal pressure.

## Design principles for the new direction

1. **Quiet authority over loud branding.** Every typographic decision should
   feel restrained, not promotional.
2. **Editorial serif for headings.** Title and sentence case. Reserve all-caps
   for small eyebrow labels only.
3. **Warm, materials-led palette.** Ivory, parchment, stone, charcoal, brass.
   Brass is used as a small detail — never a slab, never a button background
   for primary actions on most pages.
4. **Documentation, not dashboard.** Visual references are catalog sheets,
   spec rows, condition notes, provenance tags — not gamified metrics.
5. **Fiduciary-careful portal language.** "Cash offer review", "Settlement
   ledger", "Donation routing", "Approve sale path" — never "Take Cash" or
   "instant liquidity".
6. **Reassurance up front.** The home page acknowledges stress, control, and
   documentation before it explains process.
7. **Mobile feels native and calm.** Soft surfaces, larger leading, comfy tap
   targets, no horizontal overflow at 390px.

## Typography

- **Display:** Fraunces (variable axis tuned for "soft"). Title and sentence
  case. Used for H1, H2, key card titles, and editorial flourishes like
  italic numerals.
- **Body / UI:** Inter. 400/500/600 weights. 16px base, 1.65 leading. 16.5px
  on mobile for relaxed reading.
- **Mono:** IBM Plex Mono — used very sparingly for tabular labels.
- **Eyebrow / labels:** Inter 11px, 0.14em letterspacing, all-caps. Small
  enough not to dominate.

## Palette

| Token        | Hex      | Use                                         |
| ------------ | -------- | ------------------------------------------- |
| Ivory        | `#F6F1E8` | Hero / secondary surface                    |
| Parchment    | `#FBF8F1` | Default page surface                        |
| White        | `#FFFFFF` | Cards, form fields                          |
| Stone        | `#E5DECF` | Hairline border                             |
| Stone deep   | `#C9C0AC` | Stronger border / divider                   |
| Charcoal     | `#1E1B17` | Primary ink, dark surface, primary button   |
| Graphite     | `#3A3530` | Body text on light                          |
| Warm gray    | `#706A60` | Secondary text                              |
| Brass        | `#9A7A3C` | Accent rule, links, sample CTA              |
| Brass soft   | `#B89A5A` | Lighter brass for footer / dark surfaces    |
| Olive        | `#343B2F` | Optional deep accent                        |
| Sage         | `#79846F` | Optional muted accent                       |

WCAG AA verified for the body/heading combinations:
- charcoal `#1E1B17` on parchment `#FBF8F1` → ~14.6:1
- graphite `#3A3530` on parchment → ~10.5:1
- warm gray `#706A60` on parchment → ~4.6:1 (AA for text ≥ 18px or bold)
- brass `#9A7A3C` on parchment → ~4.5:1 (AA for normal text)
- ivory `#FBF8F1` on charcoal `#1E1B17` → ~14.6:1

## Components

- **Buttons** — 10px radius, 1px border, no slab fills except `btn-primary`
  (charcoal) and `btn-brass` (used sparingly). `btn-outline` is the most
  common secondary CTA. Focus ring is brass with 3px halo.
- **Cards** (`.card-advisory`) — white surface, stone hairline, 12px radius,
  generous padding. Hover lifts only the border tone — no heavy shadow.
- **Brass rule** (`.brass-rule`) — 28×1.5px line. Used as an accent at the
  start of section eyebrows, before card titles, and in step numerals.
- **Sample tag** (`.sample-tag`) — discreet ribbon used on portal previews
  to mark "Sample preview" without screaming "DEMO".
- **Documentation desk** (`.doc-desk`) — premium CSS-rendered visual evoking
  a catalog sheet. Replaces the hero's prior "tech card" with an estate-file
  motif.

## Page-by-page audit & redesign actions

### Home `/`
- **Critique:** All-caps display H1 dominated; purple CTA banner; portal
  preview felt fintech. No emotional reassurance.
- **Redesign:** Serif H1 in sentence case ("A quiet, careful path for the
  things a family must let go of."). Documentation desk replaces tech card.
  New "We know this is stressful / You stay in control / We document
  everything" reassurance section. Portal preview now shows fiduciary-careful
  action chips. Final CTA on warm charcoal, not purple.

### How it works `/how-it-works`
- **Critique:** Title-case condensed display, six dense rows.
- **Redesign:** Six steps in a calm grid; italic brass numerals; sentence-case
  serif step titles; brass rules instead of dot bullets.

### Services `/services`
- **Critique:** Colored bars (#FFDB15, #F94500, #FF99DC) read as marketing
  swatches.
- **Redesign:** Colored bars removed. Brass rule + serif title. Card layout
  preserved structure but tone is now consultative.

### Authentication `/authentication`
- **Critique:** Black slab section read brutalist.
- **Redesign:** Same charcoal surface but warmer ink, brass rules, soft
  internal cards with translucent ivory fills.

### Scenarios `/scenarios`
- **Critique:** Two-column colored-bar grid.
- **Redesign:** Single editorial table-like card with row-by-row scenarios.
  Outcome highlighted in brass serif numerals.

### Pricing `/pricing`
- **Critique:** Dense monochrome grid.
- **Redesign:** Calm card grid with brass rules, ivory subsection, and a
  separate "Request a fee review" callout in soft surface.

### FAQ `/faq`
- **Critique:** Plus icons in violet, condensed numerals.
- **Redesign:** Italic brass numeral, serif question, muted-brass plus toggle.

### Partners `/partners`
- **Critique:** Card grid + violet bullets.
- **Redesign:** Eight audience cards with brass rules; Two-up program section
  on ivory.

### Request walkthrough `/request-walkthrough`
- **Critique:** Form felt like SaaS signup.
- **Redesign:** Concierge intake panel — soft hairline border, parchment
  header strip "Confidential · no obligation" in brass, generous field padding,
  brass focus ring, primary CTA reads "Submit private estate review."

### Legal pages `/legal/*`
- **Critique:** Placeholder felt unfinished.
- **Redesign:** Refined placeholder note (left brass border, ivory fill);
  serif section headings; calm right rail TOC.

### Client portal `/portal/*`
- **Critique:** "Take Cash" yellow tile, Barlow display balance figure, "Manage
  your estate like a financial account" line read as gamified.
- **Redesign:** Action labels softened ("Settlement ledger", "Cash offer
  review", "Donation routing", "Speak to advisor"). Mobile bottom bar primary
  is brass with "Review offer". Page header uses sentence-case serif title and
  brass rule. Balance card numbers retained for at-a-glance utility but tone
  framing now reads "Available settlement" instead of "Cash now".
- **Pending:** Some inner portal screens still inherit the legacy display font
  for very large numerics. This is intentional in scope — the headline brand
  reset prioritized the public-facing experience and portal language. Visual
  parity for inner portal numerics is a follow-up sprint.

### Partner portal `/partner/*`
- **Critique:** Risked looking like fake SaaS dashboard.
- **Redesign:** Sample anonymization is preserved; copy already used
  archetypes ("Sample Family Estate"). New global typography softens the tone
  without code changes.

## Mobile rhythm

- Body bumped to 16.5px / 1.7 leading on phones.
- All inputs ≥ 48px tall.
- Primary CTAs ≥ 52px on mobile, full-width.
- Focus rings 3px brass halo.
- No horizontal overflow at 390px (verified via Playwright header-overlap
  spec).

## What this is not

- It is not a logo redesign. Logotype is now a small monogram + serif wordmark
  + brass advisory subline rather than a tracked-mono "ESTATE | LIQUIDITY"
  label, but the brand name is unchanged.
- It is not a content rewrite. The information architecture, page list, and
  required disclosures from prior PRs are preserved.
- It is not a portal feature change. Capabilities are unchanged; only labels
  and surface treatment have shifted from fintech to fiduciary.

## Acceptance probe — "would a probate attorney trust this?"

A probate attorney's cold-read should pick up:
- A calm serif H1 (not a poster).
- A "Confidential · no obligation" mark on the intake form.
- Itemized settlement language, not "instant liquidity".
- Warm ivory surfaces, not stark white/black blocks.
- Refined CTAs ("Request a private estate review") instead of marketing copy
  ("Book Free Evaluation →").
- Pre-launch placeholder notices on legal pages — discreet but present.

This site should now read as an estate-advisory firm an attorney can refer
to a grieving family without hesitation.
