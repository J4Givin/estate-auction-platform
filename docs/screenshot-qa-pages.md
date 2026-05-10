# Screenshot / QA pages list

The list of pages that should be screenshotted on every release candidate
to confirm the public site looks right at desktop and mobile widths.

The Playwright visual harness in `tests/visual/` covers most of these
automatically (`npm run qa:visual` against a base URL). This file is the
human-readable tracker for the marketing pages the operator wants to
review by eye.

## Desktop + mobile screenshots required

| Page | Route | Desktop | Mobile | Notes |
| --- | --- | --- | --- | --- |
| Home | `/` | ✅ | ✅ | Hero must clear the fixed header on every viewport. |
| How It Works | `/how-it-works` | ✅ | ✅ | |
| Services | `/services` | ✅ | ✅ | |
| Authentication / Provenance | `/authentication` | ✅ | ✅ | |
| Scenarios | `/scenarios` | ✅ | ✅ | |
| Pricing | `/pricing` | ✅ | ✅ | |
| For Families | `/for/families` | ✅ | ✅ | |
| For Realtors | `/for/realtors` | ✅ | ✅ | |
| For Attorneys | `/for/attorneys` | ✅ | ✅ | |
| Partners | `/partners` | ✅ | ✅ | |
| FAQ | `/faq` | ✅ | ✅ | |
| About | `/about` | ✅ | ✅ | |
| Contact | `/contact` | ✅ | ✅ | |
| Request Walkthrough | `/request-walkthrough` | ✅ | ✅ | Long form — capture both pre-submit and confirmation states. |
| Legal — Terms | `/legal/terms` | ✅ | ✅ | Counsel review required before launch (see real-launch-readiness.md). |
| Legal — Privacy | `/legal/privacy` | ✅ | ✅ | Same. |
| Client Portal sample | `/portal` | ✅ | ✅ | Confirm "sample data" badging is visible. |
| Partner Portal sample | `/partner` | ✅ | ✅ | Confirm anonymized referral names are obvious archetypes. |

## How to capture

```bash
# Run the harness against the deployed preview
QA_BASE_URL=https://auction-repo.vercel.app npm run qa:visual

# Output written to tests/visual/output/ (gitignored).
# Findings JSON at tests/visual/output/findings.json.
```

## Manual sanity check (5 minutes)

Open the deploy on a real phone and walk:

1. `/` → tap **Request a walkthrough** → fill the form → confirm "Thank you" state.
2. `/contact` → tap **Open the request form** → confirm same flow.
3. `/partners` → tap a partner CTA → confirm `/partner` sample portal renders.
4. `/portal` → confirm bottom-tab nav shows on mobile, no horizontal scroll.
5. `/legal/terms` and `/legal/privacy` → confirm counsel-review banner is visible.
