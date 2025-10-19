# Discovery — Risks & Test Strategy

## Mission
Identify product and transactional risks that most harm revenue or user trust for a catalog/commerce site. Primary focus: discovery flows, price correctness, and cart behavior. E2E tests target https://demowebshop.tricentis.com.

## Scope
- Category navigation (discovery stability)  
- Add-to-cart & cart totals (per-line price, subtotal)  
- Pagination (page size, uniqueness)  
- Basic UI stability (notifications, cart count)

## Concrete checks
- Price consistency: list == detail == cart line.  
- Subtotal accuracy: displayed subtotal ≈ sum(linePrice * qty).  
- Pagination: page size ≤ N, page1 ∩ page2 = ∅.

## Top risks & mitigations
- Incorrect cart totals — Why: monetary impact. Mitigation: E2E that parses prices, sums expected subtotal, assert toBeCloseTo UI subtotal.  
- Price mismatch (list/detail/cart) — Why: user confusion/charge disputes. Mitigation: sample product test: list → detail → cart assert.  
- Broken/duplicated pagination — Why: hurts discovery. Mitigation: set page size, compare titles across pages; alert on anomalies.

## Priority test list
- Cart totals smoke (1–3 items, assert per-line and subtotal)  
- Pagination uniqueness (pageSize=4 compare pages)  
- Country/region subtotal stability (if selector exists)  

## Principles & CI
- Keep tests small.  
- Use explicit Playwright assertions and scoped selectors. Read final price after selecting attributes.  
- CI: API tests on PRs; E2E smoke on PRs; full E2E nightly. Block releases on cart/checkout-critical failures.



