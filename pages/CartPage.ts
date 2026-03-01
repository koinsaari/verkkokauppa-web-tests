import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly heading = this.page.locator('h1');
  readonly emptyMessage = this.page.locator('.NotificationTitle');
  readonly cartItems = this.page.locator('article[data-product-id]');

  async goto() {
    await this.page.goto('/fi/cart');
    await this.dismissCookieBanner();
  }

  async removeFirstItem() {
    await this.dismissCookieBanner();
    await this.page.locator('button:has([data-icon="trash-can"])').first().click();
  }
}
