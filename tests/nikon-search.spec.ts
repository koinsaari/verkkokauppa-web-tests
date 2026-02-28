import { test, expect } from '@playwright/test';
import { dismissCookieBanner, searchFor } from '../utils/helpers';
import { searchTerms, expectedValues } from '../config/test-data';

test('search Nikon, sort by highest price, and verify second product', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);

  await searchFor(page, searchTerms.nikonSearch);

  const sortDropdown = page.locator('#sort_select');
  await sortDropdown.waitFor({ state: 'visible' });
  await sortDropdown.selectOption(expectedValues.sortByPriceDesc);

  const productCards = page.locator('article[data-product-id]');
  await productCards.nth(1).waitFor({ state: 'visible' });
  await dismissCookieBanner(page);

  await productCards.nth(1).locator('h3 a').click();

  await expect(page.locator('h1')).toContainText(expectedValues.nikonProductTitle);
});
