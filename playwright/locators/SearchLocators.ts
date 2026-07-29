/**
 * Search Page Locators
 * Centralized DOM selectors for transaction search page
 */
export class SearchLocators {
  // Search Elements
  readonly SEARCH_INPUT = '[data-cy="search-keyword"]';

  // Search Results
  readonly TRANSACTION_COUNT_TEXT = 'outgoing transactions';
  readonly TRANSACTION_COUNT_REGEX = /(\\d+)\\s+outgoing transactions/;

  // No Results Message
  readonly NO_RESULTS_MESSAGE = 'text=/[Nn]o results|[Nn]o transactions/';

  // Timeouts (in milliseconds)
  readonly SEARCH_BAR_TIMEOUT = 30000;
  readonly RESULTS_TIMEOUT = 30000;
}
