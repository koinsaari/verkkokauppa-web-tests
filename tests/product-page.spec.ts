import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { searchTerms } from '../config/test-data';

test('product page displays title, price and add to cart option', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);
  const productPage = new ProductPage(page);

  await homePage.goto();
  await homePage.search(searchTerms.productPage);
  await searchResults.waitForResults();
  await searchResults.clickProduct(0);

  await expect(productPage.title).toBeVisible();
  await expect(productPage.price).toBeVisible();
  await expect(productPage.addToCartButton).toBeVisible();
});
