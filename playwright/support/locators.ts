/**
 * Login Page Locators
 * Centralized DOM selectors following Page Object Model (POM) standards
 * No hardcoded URLs - use environment variables instead
 */

export class LoginLocators {
  // Cookie Banner
  static readonly COOKIE_ACCEPT_BUTTON = '#cookiebutton';

  // Language Selection
  static readonly LANGUAGE_EN_FLAG = '#langFlagEN';

  // Login Form - First Step (Username)
  static readonly USERNAME_FIELD = '#user';
  static readonly SUBMIT_BUTTON = '#submitButton';

  // Login Form - Second Step (Password)
  static readonly SECRET_PASSWORD_FIELD = '#secret';

  // Form Elements
  static readonly LOGIN_FORM = 'form';

  // Expected Values
  static readonly USERNAME_PLACEHOLDER_EN = 'User number/Username';

  // Timeouts
  static readonly LOGIN_TIMEOUT = 10000;
  static readonly COOKIE_TIMEOUT = 5000;
}

/**
 * Search Page Locators
 * Centralized DOM selectors for search functionality
 */
export class SearchLocators {
  // Search Elements
  static readonly SEARCH_INPUT = '[data-cy="search-keyword"]';
  static readonly SEARCH_BUTTON = 'button[type="submit"]';

  // Search Results
  static readonly TRANSACTION_ITEM = '[data-cy="transaction-item"]';
  static readonly TRANSACTION_COUNT_TEXT = 'outgoing transactions';
  static readonly TRANSACTION_COUNT_REGEX = /(\d+)\s+outgoing transactions/;
  static readonly NO_RESULTS_MESSAGE = '[data-cy="no-results"]';

  // Timeouts
  static readonly SEARCH_BAR_TIMEOUT = 30000;
  static readonly RESULTS_TIMEOUT = 30000;
  static readonly DEFAULT_TIMEOUT = 5000;
}
