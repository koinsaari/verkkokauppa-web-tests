import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { searchTerms } from '../config/test-data';

test('search returns relevant results for a known brand', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);

  await homePage.goto();
  await homePage.search(searchTerms.searchResults);
  await searchResults.waitForResults();

  const count = await searchResults.getProductCount();
  expect(count).toBeGreaterThan(0);

  const firstTitle = await searchResults.getProductTitle(0);
  expect(firstTitle.toLowerCase()).toContain(searchTerms.searchResults.toLowerCase());
});
