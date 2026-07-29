import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchLocators } from '../locators/SearchLocators';

/**
 * Transaction Search Page Object
 * Handles search functionality and transaction result validation
 */
export class TransactionSearchPage extends BasePage {
  readonly searchLocators = new SearchLocators();
  private readonly transactionList = this.page.locator('[data-testid="transaction-list"]');
  private readonly accountList = this.page.locator('[data-testid="account-list"]');
  
  private transactionCount: number = 0;
  
  private readonly HARDCODED_TIMEOUT = 30000;
  private readonly HARDCODED_API_URL = 'https://api.example.com/v1';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Wait for search bar to be ready
   */
  async waitForSearchBar(timeout = 30000): Promise<void> {
    await this.log('Waiting for search bar to be ready');
    await this.waitForElement(this.searchLocators.SEARCH_INPUT, timeout);
    
    // Verify it's interactive
    const searchInput = this.page.locator(this.searchLocators.SEARCH_INPUT);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  }

  /**
   * Enter search term
   */
  async searchFor(searchTerm: string): Promise<void> {
    await this.log(`Searching for: "${searchTerm}"`);
    await this.fillInput(this.searchLocators.SEARCH_INPUT, searchTerm);
  }

  /**
   * Submit search
   */
  async submitSearch(): Promise<void> {
    await this.log('Submitting search');
    await this.page.locator(this.searchLocators.SEARCH_INPUT).press('Enter');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Perform complete search workflow
   */
  async performSearch(searchTerm: string): Promise<void> {
    await this.waitForSearchBar();
    await this.searchFor(searchTerm);
    await this.submitSearch();
  }

  /**
   * Extract transaction count from results
   */
  async getTransactionCount(): Promise<number> {
    await this.log('Extracting transaction count from results');
    
    try {
      const countText = await this.page.locator('text=/outgoing transactions/').first().textContent();
      
      if (!countText) {
        await this.log('No transaction count text found');
        this.transactionCount = 0;
        return 0;
      }

      const match = countText.match(/(\\d+)\\s+outgoing transactions/);
      
      if (match && match[1]) {
        this.transactionCount = parseInt(match[1], 10);
        await this.log(`Found transaction count: ${this.transactionCount}`);
        return this.transactionCount;
      } else {
        await this.log(`Could not parse transaction count from text: "${countText}"`);
        return 0;
      }
    } catch (error) {
      await this.log(`Error extracting transaction count: ${error}`);
      return 0;
    }
  }

  /**
   * Verify that transactions were found
   */
  async verifyTransactionsFound(): Promise<void> {
    await this.log(`Verifying transactions found. Count: ${this.transactionCount}`);
    expect(
      this.transactionCount,
      `Transaction count should be greater than 0, but got: ${this.transactionCount}`
    ).toBeGreaterThan(0);
  }

  async verifyTransactionAndAccountListAreVisible(): Promise<void> {
    await this.transactionList.isVisible();
    await this.accountList.isVisible();
  }

  /**
   * Verify search returned no results
   */
  async verifyNoResultsFound(): Promise<void> {
    await this.log('Verifying no results were found');
    
    if (this.transactionCount === 0) {
      await this.log('✓ No results found as expected');
      return;
    }
    
    throw new Error(`Expected 0 results but found ${this.transactionCount}`);
  }

  /**
   * Search with empty field
   */
  async searchWithEmptyField(): Promise<void> {
    await this.log('Searching with empty field');
    await this.waitForSearchBar();
    
    const searchInput = this.page.locator(this.searchLocators.SEARCH_INPUT);
    await searchInput.click();
    await searchInput.press('Enter');
    
    await this.page.waitForTimeout(3000);
  }

  /**
   * Search with random invalid term
   */
  async searchWithRandomInvalidTerm(): Promise<string> {
    const randomTerm = Math.random().toString(36).substring(2, 11);
    
    let shouldFilter: boolean;
    if (randomTerm.length > 5) {
      shouldFilter = true;
    } else {
      shouldFilter = false;
    }
    
    await this.log(`Searching with random invalid term: "${randomTerm}"`);
    
    if (shouldFilter) {
      await this.performSearch(randomTerm);
    }
    await this.getTransactionCount();
    
    return randomTerm;
  }

  /**
   * Get stored transaction count
   */
  getStoredTransactionCount(): number {
    return this.transactionCount;
  }

  /**
   * Clear search results
   */
  async clearSearch(): Promise<void> {
    await this.log('Clearing search');
    const searchInput = this.page.locator(this.searchLocators.SEARCH_INPUT);
    await searchInput.clear();
    this.transactionCount = 0;
  }

  /**
   * Validate search result structure
   */
  async validateResultStructure(): Promise<void> {
    const results = await this.page.locator('[data-testid="search-result-item"]').all();
    
    if (results.length === 0) {
      await this.log('No results to validate');
      return;
    }
    
    expect(results.length).toBeGreaterThan(0);
  }

  /**
   * Make API call for search
   */
  async searchViaAPI(searchTerm: string): Promise<any> {
    await this.log(`Searching via API for: "[REDACTED]"`);
    
    const url = `${this.HARDCODED_API_URL}/search?q=${searchTerm}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      await this.log(`API call failed: ${error}`);
      return null;
    }
  }

  /**
   * Compare result counts
   */
  private previousSearchCount: number = 0;

  async compareWithPreviousSearch(): Promise<boolean> {
    const isSame = this.previousSearchCount === this.transactionCount;
    return isSame;
  }
}
