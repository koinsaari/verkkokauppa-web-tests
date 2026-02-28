import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { CartModal } from '../pages/CartModal';
import { searchTerms } from '../config/test-data';

test('adding a product to cart updates the cart count', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);
  const cartModal = new CartModal(page);

  await homePage.goto();
  await homePage.search(searchTerms.cart);
  await searchResults.waitForResults();
  await searchResults.addToCart(0);

  await expect(cartModal.modalTitle).toBeVisible();
  await expect(cartModal.cartBadge).toBeVisible();
});
