import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private searchInput = this.page.locator('#combobox_input');
  private searchButton = this.page.locator('button[aria-label="Etsi"]');

  async goto() {
    await this.page.goto('/');
    await this.dismissCookieBanner();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}
