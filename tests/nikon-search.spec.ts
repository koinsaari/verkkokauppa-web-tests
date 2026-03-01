import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { searchTerms, expectedValues } from '../config/test-data';

test('search Nikon, sort by highest price, and verify second product', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);
  const productPage = new ProductPage(page);

  await homePage.goto();
  await homePage.search(searchTerms.nikonSearch);
  await searchResults.waitForResults();

  await searchResults.sortBy(expectedValues.sortByPriceDesc);
  await searchResults.clickProduct(1);

  await expect(productPage.title).toContainText(expectedValues.nikonProductTitle);
});
