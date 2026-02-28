import { test, expect } from '@playwright/test';
import { dismissCookieBanner, searchFor } from '../utils/helpers';
import { searchTerms } from '../config/test-data';

test('search returns relevant results for a known brand', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);
  await searchFor(page, searchTerms.searchResults);

  const productCards = page.locator('article[data-product-id]');
  await productCards.first().waitFor({ state: 'visible' });

  const count = await productCards.count();
  expect(count).toBeGreaterThan(0);

  const firstTitle = await productCards.first().locator('h3 a').textContent();
  expect(firstTitle?.toLowerCase()).toContain(searchTerms.searchResults.toLowerCase());
});
