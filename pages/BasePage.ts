import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async dismissCookieBanner() {
    await this.page.evaluate(() =>
      document.querySelector('#usercentrics-cmp-ui')?.remove()
    );
  }
}
