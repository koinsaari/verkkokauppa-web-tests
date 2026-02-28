import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly productCards = this.page.locator('article[data-product-id]');
  readonly sortDropdown = this.page.locator('#sort_select');

  private productLink(index: number): Locator {
    return this.productCards.nth(index).locator('h3 a');
  }

  async waitForResults() {
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async sortBy(value: string) {
    await this.sortDropdown.waitFor({ state: 'visible' });
    await this.sortDropdown.selectOption(value);
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async getProductTitle(index: number): Promise<string> {
    return (await this.productLink(index).textContent()) ?? '';
  }

  async clickProduct(index: number) {
    await this.dismissCookieBanner();
    await this.productLink(index).click();
  }

  async addToCart(index: number) {
    await this.dismissCookieBanner();
    await this.productCards.nth(index).locator('button[data-id]').click();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
