/**
 * Test Utility Functions
 * Helper functions for test data generation, formatting, and common operations
 */

/**
 * Generate random alphanumeric string
 * @param length - Length of random string (default: 9)
 * @returns Random alphanumeric string
 */
export function generateRandomString(length: number = 9): string {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Generate random email address
 * @returns Random email in format: test_<random>@example.com
 */
export function generateRandomEmail(): string {
  const randomStr = generateRandomString(8);
  return `test_${randomStr}@example.com`;
}

/**
 * Generate current ISO timestamp
 * @returns ISO timestamp string with special characters replaced
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Format date for display
 * @param date - Date object to format (default: current date)
 * @param format - Format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function formatDate(date: Date = new Date(), format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Get environment variable with fallback
 * @param key - Environment variable name
 * @param defaultValue - Fallback value if not set
 * @returns Environment variable value or default
 */
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  const value = process.env[key];
  
  if (!value && !defaultValue) {
    throw new Error(`Environment variable "${key}" is not set and no default provided`);
  }
  
  return value || defaultValue;
}

/**
 * Wait for specified milliseconds
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract number from text
 * @param text - Text containing number
 * @param regex - Optional regex pattern to extract number
 * @returns Extracted number
 */
export function extractNumber(text: string, regex?: RegExp): number | null {
  const pattern = regex || /(\d+)/;
  const match = text.match(pattern);
  
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return null;
}

/**
 * Retry async function with exponential backoff
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delayMs - Initial delay in milliseconds (default: 1000)
 * @returns Result of function call
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = delayMs * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1}/${maxRetries} - waiting ${delay}ms`);
      await wait(delay);
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}
