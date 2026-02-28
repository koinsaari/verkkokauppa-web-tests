import { test, expect } from '@playwright/test';
import { dismissCookieBanner, searchFor } from '../utils/helpers';

test('product page displays title, price and add to cart option', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);
  await searchFor(page, 'iPhone');

  const productCards = page.locator('article[data-product-id]');
  await productCards.first().waitFor({ state: 'visible' });
  await dismissCookieBanner(page);
  await productCards.first().locator('h3 a').click();

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('data[data-price="current"]').first()).toBeVisible();
  await expect(page.locator('button[data-id]').first()).toBeVisible();
});
