# Verkkokauppa.com Test Automation

Playwright end-to-end tests for verkkokauppa.com.

## Setup

```bash
npm install
npx playwright install
```

## Running tests

```bash
npx playwright test                    # all browsers
npx playwright test --project=chromium # chromium only
```

## Test scenarios

### 1. Search and product page journey (`search-and-product.spec.ts`)

Searches for "iPhone", verifies the results are relevant (count > 0, first result contains the search term), clicks into the first product, checks the product page has a title, price and add-to-cart button, then adds the product to cart and verifies the cart modal and badge appear.

**Why:** This is the core shopping flow that every user goes through. A regression here directly blocks purchases. The journey crosses multiple pages and involves async state updates (cart badge), which makes it tedious and error-prone to verify manually every release.

### 2. Cart journey (`cart-journey.spec.ts`)

Adds a product to cart from search results, navigates to the cart page, verifies the product is listed, removes it and verifies the cart shows an empty state.

**Why:** Cart logic is stateful and touches multiple backend services (inventory, pricing, session). Adding and removing items is a repetitive verification that needs to work across every deploy. Manual testing easily misses edge cases like stale cart state after removal.

### 3. Browsing and edge cases (`browsing.spec.ts`)

Two tests: one navigates a category (Tietotekniikka) through to its product listing and verifies products load. The other searches for a nonsense string and verifies zero results are returned.

**Why:** Category navigation relies on correct routing and data loading, if a category link breaks, users can't browse. The no-results test guards the search fallback path that's easy to overlook but important for UX. Both are fast to automate and catch regressions that manual testers rarely prioritize.

## Project structure

```
pages/           Page objects (BasePage, HomePage, SearchResultsPage, ProductPage, CartModal, CartPage)
tests/           Test specs
config/          Search terms and expected values
```

Tests run Chromium only because cookie consent overlay caused flaky clicks on WebKit/Firefox. Tests run sequentially with retries to avoid rate limiting the live site.
