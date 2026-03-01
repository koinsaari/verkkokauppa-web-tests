import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { CartModal } from '../pages/CartModal';
import { CartPage } from '../pages/CartPage';
import { searchTerms } from '../config/test-data';

test('add to cart, verify cart page, then remove item', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);
  const cartModal = new CartModal(page);
  const cartPage = new CartPage(page);

  await homePage.goto();
  await homePage.search(searchTerms.cart);
  await searchResults.waitForResults();
  await searchResults.addToCart(0);

  await expect(cartModal.modalTitle).toBeVisible();
  await expect(cartModal.cartBadge).toBeVisible();

  await cartPage.goto();
  await expect(cartPage.heading).toBeVisible();
  await expect(page.locator('a[href*="/fi/product/"]').first()).toBeVisible();
  await expect(cartPage.emptyMessage).not.toBeVisible();

  await cartPage.removeFirstItem();
  await expect(cartPage.emptyMessage).toBeVisible();
});
