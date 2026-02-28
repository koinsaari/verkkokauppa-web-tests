import { test, expect, Page } from '@playwright/test';

const dismissCookieBanner = (page: Page) =>
  page.evaluate(() => document.querySelector('#usercentrics-cmp-ui')?.remove());

test('search Nikon, sort by highest price, and verify second product', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);

  await page.locator('#combobox_input').fill('Nikon');
  await page.locator('button[aria-label="Etsi"]').click();

  const sortDropdown = page.locator('#sort_select');
  await sortDropdown.waitFor({ state: 'visible' });
  await sortDropdown.selectOption('price:desc');

  const productCards = page.locator('article[data-product-id]');
  await productCards.nth(1).waitFor({ state: 'visible' });
  await dismissCookieBanner(page);

  await productCards.nth(1).locator('h3 a').click();

  await expect(page.locator('h1')).toContainText('Nikon Z30');
});
