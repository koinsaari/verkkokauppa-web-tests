import { test, expect } from '@playwright/test';
import { dismissCookieBanner, searchFor } from '../utils/helpers';
import { searchTerms } from '../config/test-data';

test('adding a product to cart updates the cart count', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);
  await searchFor(page, searchTerms.cart);

  const productCards = page.locator('article[data-product-id]');
  await productCards.first().waitFor({ state: 'visible' });
  await dismissCookieBanner(page);

  await productCards.first().locator('button[data-id]').click();

  await expect(page.locator('#cart-modal-title')).toBeVisible();
  await expect(page.locator('#header-cart-button [data-qty]')).toBeVisible();
});
