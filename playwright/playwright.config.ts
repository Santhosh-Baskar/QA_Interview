import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Playwright Test Configuration
 * Configures test runners, browsers, and reporting for transaction search tests
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time a test can take to complete (ms)
  timeout: 30000,
  
  // Global timeout for all assertions (ms)
  expect: {
    timeout: 5000,
  },
  
  // Maximum number of parallel workers
  workers: process.env.CI ? 1 : 3,
  
  // Report test results
  reporter: [
    ['html', { outputFolder: 'test-results' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  
  // Global test configuration
  use: {
    // Base URL for all requests
    baseURL: process.env.BASE_URL || 'https://example.com/',
    
    // Enable tracing for debugging failed tests
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: process.env.SCREENSHOTS_ON_FAILURE === 'true' ? 'only-on-failure' : 'off',
    
    // Video recording
    video: 'retain-on-failure',
    
    // Action timeout
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },
  
  // Project configurations (browsers to test)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // Web server configuration (if needed for local testing)
  webServer: {
    command: 'npm run dev',
    url: process.env.BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
