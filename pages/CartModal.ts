import { BasePage } from './BasePage';

export class CartModal extends BasePage {
  readonly modalTitle = this.page.locator('#cart-modal-title');
  readonly cartBadge = this.page.locator('#header-cart-button [data-qty]');
}
