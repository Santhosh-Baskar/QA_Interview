/**
 * Login Page Locators
 * Centralized DOM selectors for login page
 */
export class LoginLocators {
  // Cookie Banner
  readonly COOKIE_ACCEPT_BUTTON = '#cookiebutton';

  // Language Selection
  readonly LANGUAGE_EN_FLAG = '#langFlagEN';

  // Login Form - First Step (Username)
  readonly USERNAME_FIELD = '#user';
  readonly SUBMIT_BUTTON = '#submitButton';

  // Login Form - Second Step (Password)
  readonly SECRET_PASSWORD_FIELD = '#secret';

  // Form Elements
  readonly LOGIN_FORM = 'form';

  // Expected Values
  readonly USERNAME_PLACEHOLDER_EN = 'User number/Username';
}
