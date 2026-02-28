import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly title = this.page.locator('h1');
  readonly price = this.page.locator('data[data-price="current"]').first();
  readonly addToCartButton = this.page.locator('button[data-id]').first();
}
