import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private searchInput = this.page.locator('#combobox_input');

  async goto() {
    await this.page.goto('/');
    await this.dismissCookieBanner();
  }

  async search(term: string) {
    await this.dismissCookieBanner();
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }
}
