import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginLocators } from '../locators/LoginLocators';

/**
 * Login Page Object
 * Handles authentication flow for the banking application
 */
export class LoginPage extends BasePage {
  readonly loginLocators = new LoginLocators();

  constructor(page: Page) {
    super(page);
  }

  /**
   * Visit the login page
   */
  async visitLoginPage(): Promise<void> {
    const baseUrl = process.env.BASE_URL || 'https://example.com';
    await this.log(`Navigating to login page: ${baseUrl}`);
    await this.goto(baseUrl);
  }

  /**
   * Wait for login page redirect
   */
  async waitForLoginRedirect(timeout = 10000): Promise<void> {
    await this.log('Waiting for login page redirect');
    await this.page.waitForURL('**/login**', { timeout });
  }

  /**
   * Accept cookie consent
   */
  async acceptCookies(): Promise<void> {
    await this.log('Accepting cookie consent');
    await this.waitForElement(this.loginLocators.COOKIE_ACCEPT_BUTTON);
    await this.click(this.loginLocators.COOKIE_ACCEPT_BUTTON);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch language to English
   */
  async switchToEnglish(): Promise<void> {
    await this.log('Switching language to English');
    await this.waitForElement(this.loginLocators.LANGUAGE_EN_FLAG);
    await this.click(this.loginLocators.LANGUAGE_EN_FLAG);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.log(`Entering username: [REDACTED]`);
    await this.waitForElement(this.loginLocators.USERNAME_FIELD);
    await this.fillInput(this.loginLocators.USERNAME_FIELD, username);
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.log('Clicking submit button');
    await this.click(this.loginLocators.SUBMIT_BUTTON);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify secret password field is visible (second auth step)
   */
  async verifySecretPasswordFieldVisible(timeout = 10000): Promise<void> {
    await this.log('Verifying secret password field is visible');
    await this.waitForElement(this.loginLocators.SECRET_PASSWORD_FIELD, timeout);
  }

  /**
   * Enter secret password
   */
  async enterSecretPassword(password: string): Promise<void> {
    await this.log('Entering secret password: [REDACTED]');
    await this.fillInput(this.loginLocators.SECRET_PASSWORD_FIELD, password);
  }

  /**
   * Complete full login flow
   */
  async login(username: string, password: string): Promise<void> {
    await this.log('Starting complete login flow');
    
    // Step 1: Enter username
    await this.enterUsername(username);
    await this.clickSubmit();
    
    // Step 2: Verify secret field and enter password
    await this.verifySecretPasswordFieldVisible();
    await this.enterSecretPassword(password);
    await this.clickSubmit();
    
    // Wait for successful login
    await this.page.waitForLoadState('networkidle');
    await this.log('Login completed successfully');
  }

  /**
   * Setup and login (complete workflow)
   */
  async setupAndLogin(username: string, password: string): Promise<void> {
    await this.visitLoginPage();
    await this.waitForLoginRedirect();
    await this.acceptCookies();
    await this.switchToEnglish();
    await this.login(username, password);
  }
}
