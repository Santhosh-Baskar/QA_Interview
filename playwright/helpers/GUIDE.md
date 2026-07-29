# QA Interview Evaluation Guide

**Assessment:** Mid-Level QA Engineer — Code Review  
**File to Review:** `playwright/pages/TransactionSearchPage.ts`  
**Time:** 15–20 min review + 5–10 min discussion  

---

## How to Run the Interview

1. Share `TransactionSearchPage.ts` with the candidate
2. Say: *"Review this page object as if it's a peer's PR. What issues do you see?"*
3. Let them analyze independently — do **not** interrupt or hint
4. Use follow-up questions below if they miss critical issues

---

## Scoring Rubric

| Result | Flaws Found | Behaviour |
|--------|-------------|-----------|
| ⭐⭐⭐⭐⭐ **Exceeds** | 6–7 | Identifies root causes, suggests fixes, discusses architecture |
| ⭐⭐⭐⭐ **Meets** | 4–5 | Catches most issues, explains why they matter |
| ⭐⭐⭐ **Developing** | 2–3 | Misses critical flaws, limited explanation |
| ⭐⭐ **Below** | 0–1 | Does not demonstrate testing fundamentals |

---

## The 7 Flaws — Answer Key

### 🔴 Flaw 1 — Hardcoded Values
**Where:** Lines 15–16 (class properties) and `searchViaAPI()` method

**What it is:**
```typescript
private readonly HARDCODED_API_URL = 'https://api.example.com/v1';
private readonly HARDCODED_TIMEOUT = 30000;
```

**Why it's wrong:** URLs and paths are hardcoded — breaks in different environments (dev, staging, prod). If it's a real URL, it's a security risk in version control.

**Correct fix:**
```typescript
const url = process.env.API_BASE_URL;
const timeout = parseInt(process.env.TIMEOUT || '30000', 10);
```

**Follow-up:** *"How would you handle this code running in 3 different environments?"*

---

### 🔴 Flaw 2 — Errors Swallowed Instead of Thrown
**Where:** `getTransactionCount()` — both the `if (!countText)` guard and the `catch` block

**What it is:**
```typescript
if (!countText) {
  this.transactionCount = 0;
  return 0; // silent — missing element treated as "0 results"
}

} catch (error) {
  await this.log(`Error: ${error}`);
  return 0; // silent — exception also treated as "0 results"
}
```

**Why it's wrong:** Both paths swallow failures. Whether the element is missing or an exception is thrown, the method returns `0` and the test carries on — possibly passing when it should fail. Also hides the difference between "no results found" and "page didn't load".

**Correct fix:**
```typescript
if (!countText) {
  throw new Error('Count element not found — page may not have loaded correctly');
}
// ...
} catch (error) {
  await this.log(`Error: ${error}`);
  throw error;
}
```

**Follow-up:** *"How do you distinguish between '0 results found' and 'element not found'? What's the impact of swallowing errors in a test helper?"*

---

### 🔴 Flaw 3 — Hardcoded Sleeps / Race Condition
**Where:** `submitSearch()` and `searchWithEmptyField()`

**What it is:**
```typescript
await this.page.locator(searchInput).press('Enter');
await this.page.waitForTimeout(2000); // submitSearch

await this.page.waitForTimeout(3000); // searchWithEmptyField
```

**Why it's wrong:** Hardcoded sleeps don't wait for the actual UI/network response — they guess. On slow networks results may not have loaded; on fast ones you waste seconds every run. This is the root cause of flaky, environment-dependent tests.

**Correct fix:**
```typescript
await this.page.locator(searchInput).press('Enter');
await this.page.waitForLoadState('networkidle');
// OR
await this.page.waitForSelector('[data-testid="results"]');
```

**Follow-up:** *"What's the difference between `waitForTimeout` and `waitForLoadState`? What happens when this runs in CI vs locally?"*

---

### 🟠 Flaw 4 — Weak Assertions
**Where:** `verifyTransactionsFound()`

**What it is:**
```typescript
expect(
  this.transactionCount,
  `Transaction count should be greater than 0, but got: ${this.transactionCount}`
).toBeGreaterThan(0);
```


**Why it's wrong:** Count > 0 proves something is on screen — not that it's correct. Data could be malformed, amounts could be missing, descriptions could be empty.

**Correct fix:**
```typescript
const results = await this.page.locator('[data-testid="result-item"]').all();
for (const result of results) {
  await expect(result.locator('[data-testid="amount"]')).toContainText(/\d+\.\d{2}/);
  await expect(result.locator('[data-testid="date"]')).not.toBeEmpty();
  await expect(result.locator('[data-testid="description"]')).not.toBeEmpty();
}
```

**Follow-up:** *"What could be wrong with the results that your assertion would miss?"*

---

### 🟡 Flaw 5 — Shallow Validation
**Where:** `validateResultStructure()` and `searchViaAPI()`

**What it is:**
```typescript
async validateResultStructure(): Promise<void> {
  const results = await this.page.locator('[data-testid="result-item"]').all();
  expect(results.length).toBeGreaterThan(0); // ❌ Only counts, no schema check
}
```

**Why it's wrong:** Confirms results rendered, but doesn't check field types, formats, or required fields. API could return `{ name: null, amount: undefined }` and this passes.

**Correct fix:** Iterate results and assert each required field (`name`, `amount`, `date`, `description`) is present, non-null, and in the expected format.

**Follow-up:** *"What does a complete API response validation look like?"*

---

### 🟡 Flaw 6 — Unnecessary If-Else
**Where:** `searchWithRandomInvalidTerm()`

**What it is:**
```typescript
let shouldFilter: boolean;
if (randomTerm.length > 5) {
  shouldFilter = true;
} else {
  shouldFilter = false;
}
```

**Why it's wrong:** Assigns a boolean based on a boolean expression — verbose and adds noise.

**Correct fix:**
```typescript
const shouldFilter = randomTerm.length > 5;
```

**Follow-up:** *"Are there other places in this file you'd simplify while reviewing?"*

---

### 🟡 Flaw 7 — Weak API Assertion
**Where:** `tests/transactionSearch.spec.ts` in `User API` → `TC005 - should get user details from API`

**What it is:**
```typescript
expect(response.ok()).toBeTruthy();
```

**Why it's wrong:** `response.ok()` only tells you the status was somewhere in the 2xx range. It hides the exact status code and makes the assertion less precise. For an interview exercise, this is weaker than asserting the specific expected HTTP status and then validating the response body fields.

**Correct fix:**
```typescript
expect(response.status()).toBe(200);

const body = await response.json();
expect(body.id).toBe(123);
expect(body.email).toContain('@example.com');
```

**Follow-up:** *"Why is `response.status()` a stronger assertion than `response.ok()` here? What kinds of bugs can a broad 2xx check hide?"*

---

## Strong Candidate Answer (What to Listen For)

> *"I'd flag several things. The hardcoded URLs need to move to environment variables — that's a security risk. The `waitForTimeout` calls should be replaced with explicit waits like `waitForLoadState` to remove flakiness. The error handling is concerning — catching exceptions and returning `0` means tests can silently pass when they should fail. I'd also strengthen the assertions to validate actual field content, not just count. And `validateResultStructure` only checks that results exist, not that the data is valid."*

---

## Tips During the Interview

- **Don't hint** — observe natural thought process
- **Ask "Why?"** — differentiate those who spot issues from those who understand them
- **Watch terminology** — do they say "flakiness", "race condition", "test isolation"?
- **Note priorities** — does the candidate rank flaws by severity?
- **Check solutions** — can they suggest a concrete fix, not just identify the problem?
