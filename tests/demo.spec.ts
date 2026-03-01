import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { searchTerms } from '../config/test-data';

// This test intentionally fails to demonstrate the AI failure analysis agent.
// The agent reads the Playwright JSON output and uses a local LLM (llama3.2:3b
// via Ollama) to explain the failure and suggest a fix.
test('demo: AI agent failure analysis', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResults = new SearchResultsPage(page);

  await homePage.goto();
  await homePage.search(searchTerms.searchResults);
  await searchResults.waitForResults();

  const count = await searchResults.getProductCount();
  expect(count).toBe(0);
});
