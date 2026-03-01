import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { searchTerms, expectedValues } from '../config/test-data';

test('navigating a category shows products', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);

  await homePage.goto();
  await homePage.dismissCookieBanner();
  await page.locator(`a[href="${expectedValues.categoryPath}"]`).first().click();

  await expect(page.locator('h1')).toBeVisible();
  await page.evaluate(() =>
    document.querySelector('#usercentrics-cmp-ui')?.remove()
  );
  await page.locator('a[href*="/products"]').first().click();

  await searchResults.waitForResults();
  const count = await searchResults.getProductCount();
  expect(count).toBeGreaterThan(0);
});

test('search with no matching products shows zero results', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);

  await homePage.goto();
  await homePage.search(searchTerms.noResults);

  const count = await searchResults.getProductCount();
  expect(count).toBe(0);
});
