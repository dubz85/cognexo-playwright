# Cognexo — SDET Take-home

This repository contains Playwright-based E2E tests and API tests used for the take‑home assignment.

**Important:**  
- E2E tests run against `https://demowebshop.tricentis.com` (site chosen because it exposes a visible cart).  
- API tests run against `https://countries.trevorblades.com` (GraphQL demo API).

## Requirements
- Node.js 18+ (LTS recommended)  
- npm

## Install
```bash
npm install
npx playwright install
```

## Run tests (examples)
- Run all Playwright tests:
```bash
npx playwright test
```
- Run a folder:
```
npx playwright test tests/e2e
npx playwright test tests/api
```

## Rationale

1- Why these tests were chosen:
- Focused automation on the highest-risk user journeys — areas that directly affect revenue and user trust.
- Add-to-cart and subtotal validation: verifies UI and calculation consistency for cart totals.
- Pagination and product uniqueness: ensures catalog discoverability and prevents duplicates/missing items.
- GraphQL API contract checks: validate backend schema and error handling.

2- What was intentionally not automated (and why):
- Full checkout and payment: the demo site does not process real transactions; adding payment flow would be brittle and low value for this exercise.
- Visual regression and accessibility audits: valuable, but secondary until functional coverage is solid.
- Minor form/field-level negatives: better investigated manually first and automated only if repetitive.

3- Planned next steps (given more time):
- Quantity-change and remove-item flows to confirm totals update correctly.
- Cross‑browser coverage (Firefox, WebKit) for broader confidence.
- Lightweight visual regression on key pages (catalog, cart).
- Negative flows (add items out of stock, entering invalid address or payment details)
- Capture traces/screenshots on failure.  

## CI/CD strategy (overview)
- Pull requests: run API happy/negative paths and a small E2E smoke set (cart totals, pagination) for fast feedback.
- Nightly regression: run full cross‑browser E2E suite with traces/screenshots enabled.
- Release gating: block only on critical cart/checkout flows; non‑critical failures file tickets but do not block delivery.

## Implementation guidelines
- Use Playwright parallel workers to keep runtimes short.
- Allow two retries only in CI to reduce flakiness noise.
- Tag tests by risk so PRs run only “smoke” tests while nightly runs execute the complete suite.
