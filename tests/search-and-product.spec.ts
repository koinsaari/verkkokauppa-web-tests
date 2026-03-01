import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartModal } from '../pages/CartModal';
import { searchTerms } from '../config/test-data';

test('search, verify results, open product and add to cart', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);
  const productPage = new ProductPage(page);
  const cartModal = new CartModal(page);

  await homePage.goto();
  await homePage.search(searchTerms.searchResults);
  await searchResults.waitForResults();

  const count = await searchResults.getProductCount();
  expect(count).toBeGreaterThan(0);

  const firstTitle = await searchResults.getProductTitle(0);
  expect(firstTitle.toLowerCase()).toContain(searchTerms.searchResults.toLowerCase());

  await searchResults.clickProduct(0);

  await expect(productPage.title).toBeVisible();
  await expect(productPage.price).toBeVisible();
  await expect(productPage.addToCartButton).toBeVisible();

  await productPage.dismissCookieBanner();
  await productPage.addToCartButton.click();

  await expect(cartModal.modalTitle).toBeVisible();
  await expect(cartModal.cartBadge).toBeVisible();
  await expect(cartModal.cartBadge).toHaveText('1');
});
