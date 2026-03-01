# Verkkokauppa.com Test Automation

Playwright end-to-end tests for verkkokauppa.com.

## Setup

```bash
npm install
npx playwright install
```

Set `BASE_URL` in a `.env` file to override the target site (see `.env.example`). Defaults to `https://www.verkkokauppa.com`.

## Running tests

```bash
npx playwright test
```

Tests run on Chromium only. Firefox and WebKit had flaky interactions with the site's cookie consent overlay. Tests run sequentially with retries to avoid rate limiting the live site.

## Test scenarios

### 1. Search and product page journey (`search-and-product.spec.ts`)

Searches for "iPhone", verifies the results are relevant (count > 0, first result contains the search term), clicks into the first product, checks the product page has a title, price and add-to-cart button, then adds the product to cart and verifies the cart modal and badge appear.

**Why:** This is the core shopping flow every user goes through. A regression here directly blocks purchases. The journey crosses multiple pages and involves async state updates (cart badge), which makes it tedious and error-prone to verify manually every release.

### 2. Cart journey (`cart-journey.spec.ts`)

Adds a product to cart from search results, navigates to the cart page, verifies the product is listed, removes it and verifies the cart shows an empty state.

**Why:** Cart logic is stateful and touches multiple backend services. Adding and removing items is repetitive to verify manually and stale cart state after removal is a class of bug that's easy to miss.

### 3. Browsing and edge cases (`browsing.spec.ts`)

Two tests: one navigates a category (Tietotekniikka) through to its product listing and verifies products load. The other searches for a nonsense string and verifies zero results are returned.

**Why:** Category navigation relies on correct routing and data loading. The no-results path is easy to overlook but matters for UX. Both are fast to automate and catch regressions that manual testers rarely prioritize.

## AI agent

### Failure analysis agent (`agents/failure-summary.mjs`)

**Problem:** When tests fail in CI you end up staring at stack traces trying to figure out if it's a broken selector, a live data change, or an actual regression. It takes time and context that not everyone on the team has.

**How it works:** After the test run the agent reads the Playwright JSON results, pulls out the failures with their error messages, and sends them to a local LLM for a plain-English explanation of what went wrong and what to check. Ollama was chosen over cloud LLMs to keep it free and avoid sending test output to external APIs. In CI the analysis is written to the GitHub Actions job summary so it shows up directly on the workflow run page.

**Running locally:**

```bash
# start Ollama (needs llama3.2:3b pulled)
ollama serve

# run tests then analyze
npx playwright test
node agents/failure-summary.mjs
```

**Demo:** A dedicated workflow can be triggered manually from GitHub Actions → "AI Agent Demo". It runs `tests/demo.spec.ts`, which intentionally asserts that a search for "iPhone" returns 0 results. The agent then picks up the failure and produces an analysis like:

```
❌ 1 test(s) failed. Asking llama3.2:3b for analysis...

=== AI Failure Analysis ===

Test: demo: AI agent failure analysis
Likely cause: The assertion expects 0 results but the search returns
products — the expected value is wrong, not the test logic.
Fix: Update the assertion to expect count > 0, or change the search
term to one that returns no results.
```

## Project structure

```
agents/          AI agent scripts
pages/           Page objects (BasePage, HomePage, SearchResultsPage, ProductPage, CartModal, CartPage)
tests/           Test specs
config/          Search terms and expected values
.github/
  workflows/
    playwright.yml      Runs on every push (normal tests)
    ai-agent-demo.yml   Manual trigger for AI agent demo
```
