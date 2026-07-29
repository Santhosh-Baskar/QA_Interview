import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { TransactionSearchPage } from "../pages/TransactionSearchPage";

/**
 * Transaction Search Tests
 *
 * Test Suite: George Banking - Transaction Search
 * Focus: Transaction search and retrieval functionality
 *
 * Prerequisites (Setup Only - Not Tested):
 * - User authentication
 * - Cookie consent acceptance
 * - Language selection
 *
 */

test.describe("George Banking - Transaction Search", () => {
  let loginPage: LoginPage;
  let searchPage: TransactionSearchPage;

  const SEARCH_TERM = "fashion";

  /**
   * Test setup: Login before each test
   */
  test.beforeEach(async ({ page }) => {
    const timestamp = new Date().toLocaleString();
    console.log(`\\n🕐 Test started at: ${timestamp}`);

    loginPage = new LoginPage(page);
    searchPage = new TransactionSearchPage(page);

    console.log("🔧 SETUP: Logging in user (prerequisite)");

    const username = '8963257';
    const password = 'Test@1234';

    if (!username || !password) {
      throw new Error(
        "LOGIN_USERNAME and LOGIN_PASSWORD environment variables are required",
      );
    }

    await loginPage.setupAndLogin(username, password);
    console.log("✅ SETUP COMPLETE: User authenticated and ready");
  });

  /**
   * TC001: Basic Transaction Search
   * Priority: Critical
   * Type: Smoke Test
   *
   * Test Objective:
   * Verify that basic search functionality works with valid search term
   * and returns transaction results with count extraction.
   */
  test("TC001 - should perform basic search and extract transaction count", async () => {
    console.log("📋 TEST START: Basic Transaction Search");

    console.log(`🔍 Searching for "${SEARCH_TERM}"`);
    await searchPage.performSearch(SEARCH_TERM);

    console.log("📊 Extracting transaction count");
    const count = await searchPage.getTransactionCount();

    console.log("✓ Verifying transactions found");
    await searchPage.verifyTransactionsFound();

    expect(count, "Transaction count should be greater than 0").toBeGreaterThan(
      0,
    );
    console.log(`✅ Found ${count} transactions for "${SEARCH_TERM}"`);

    console.log("✅ TEST COMPLETE: Basic search passed");
  });

  /**
   * TC002: Search with Empty Field
   * Priority: High
   * Type: Negative Test
   *
   * Test Objective:
   * Verify that searching with empty field does not return any results.
   */
  test("TC002 - should not find results with empty search field", async () => {
    console.log("📋 TEST START: Empty Field Search");

    console.log("🔍 Submitting search with empty field");
    await searchPage.searchWithEmptyField();

    console.log("📊 Extracting transaction count");
    const count = await searchPage.getTransactionCount();

    console.log("✓ Verifying no results found");
    expect(count, "Empty search should return 0 results").toBe(0);
    console.log(`✅ Empty search returned ${count} transactions as expected`);

    console.log("✅ TEST COMPLETE: Empty field returns no results");
  });

  /**
   * TC003: Search with Invalid/Non-existent Term
   * Priority: Medium
   * Type: Negative Test
   *
   * Test Objective:
   * Verify that searching for a random non-existent term returns no results.
   */
  test("TC003 - should not find results with random invalid term", async () => {
    console.log("📋 TEST START: Invalid Search Term");

    console.log("🔍 Searching with random non-existent term");
    const randomTerm = await searchPage.searchWithRandomInvalidTerm();

    console.log("📊 Extracting transaction count");
    const count = await searchPage.getTransactionCount();

    console.log("✓ Verifying no results found");
    expect(count, "Random term should return 0 results").toBe(0);
    console.log(
      `✅ Random term "${randomTerm}" returned ${count} transactions as expected`,
    );

    console.log("✅ TEST COMPLETE: Invalid term returns no results");
  });

  /**
   * TC004: Case Sensitivity Test
   * Priority: Medium
   * Type: Functional Test
   *
   * Test Objective:
   * Verify that search is case-insensitive and returns same results
   * as TC001 regardless of case variation.
   */
  test("TC004 - should return same results regardless of case", async () => {
    console.log("📋 TEST START: Case Sensitivity Test");

    const searchVariants = ["fashion", "FASHION", "Fashion", "FaShIoN"];
    const results: number[] = [];

    console.log("🔍 Testing multiple case variations");

    for (const variant of searchVariants) {
      console.log(`Testing: "${variant}"`);
      await searchPage.performSearch(variant);
      const count = await searchPage.getTransactionCount();
      results.push(count);
      console.log(`Result for "${variant}": ${count} transactions`);

      // Clear for next iteration
      await searchPage.clearSearch();
    }

    // Verify all results are identical
    const firstCount = results[0];
    const allSame = results.every((count) => count === firstCount);

    expect(allSame, "All case variations should return same count").toBe(true);
    expect(firstCount, "Should return greater than 0").toBeGreaterThan(0);
    console.log(
      `✅ All case variations returned ${firstCount} transactions (consistent)`,
    );

    console.log("✅ TEST COMPLETE: Case-insensitive search validated");
  });

    test("TC005 - should get user details from API", async ({ request }) => {
      const response = await request.get("/api/users/123");
        
      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body.id).toBe(123);
      expect(body.email).toContain("@example.com");
    });
  /**
   * Cleanup after tests
   */
  test.afterEach(async () => {
    console.log("🧹 Cleaning up after test");
  });
});
