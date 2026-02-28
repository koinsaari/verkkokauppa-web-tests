import { Page } from '@playwright/test';

export const dismissCookieBanner = (page: Page) =>
  page.evaluate(() => document.querySelector('#usercentrics-cmp-ui')?.remove());

export async function searchFor(page: Page, term: string) {
  await page.locator('#combobox_input').fill(term);
  await page.locator('button[aria-label="Etsi"]').click();
}
