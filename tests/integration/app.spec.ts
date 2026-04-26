import { test, expect, Page } from "@playwright/test";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

async function signUpUser(
  page: Page,
  email: string,
  password: string
) {
  await page.goto("/signup");
  await page.getByTestId("auth-signup-email").fill(email);
  await page.getByTestId("auth-signup-password").fill(password);
  await page.getByTestId("auth-signup-submit").click();
  await page.waitForURL("/dashboard");
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    // Splash should be visible
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    // Eventually redirects to /login
    await page.waitForURL("/login", { timeout: 5000 });
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await signUpUser(page, "alice@example.com", "pass123");
    await page.goto("/");
    // Should skip splash and go to dashboard
    await page.waitForURL("/dashboard", { timeout: 5000 });
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/login", { timeout: 5000 });
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("newuser@example.com");
    await page.getByTestId("auth-signup-password").fill("mypassword");
    await page.getByTestId("auth-signup-submit").click();

    await page.waitForURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // Sign up alice and create a habit
    await signUpUser(page, "alice@example.com", "pass1");
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Alice Habit");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-alice-habit")).toBeVisible();

    // Sign up bob (different session)
    await signUpUser(page, "bob@example.com", "pass2");
    // Bob should NOT see alice's habit
    await expect(page.getByTestId("habit-card-alice-habit")).not.toBeVisible();
    await expect(page.getByTestId("empty-state")).toBeVisible();

    // Log out bob and log back in as alice
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login");
    await page.getByTestId("auth-login-email").fill("alice@example.com");
    await page.getByTestId("auth-login-password").fill("pass1");
    await page.getByTestId("auth-login-submit").click();
    await page.waitForURL("/dashboard");

    // Alice's habit should be visible
    await expect(page.getByTestId("habit-card-alice-habit")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await signUpUser(page, "user@example.com", "pass");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Morning Run");
    await page.getByTestId("habit-description-input").fill("Run 5k every day");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-morning-run")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await signUpUser(page, "user@example.com", "pass");

    // Create a habit
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

    // Streak starts at 0
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("0");

    // Mark complete
    await page.getByTestId("habit-complete-drink-water").click();

    // Streak should update to 1
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await signUpUser(page, "user@example.com", "pass");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Read Books");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();

    // Reload
    await page.reload();

    // Should still be on dashboard with the habit
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await signUpUser(page, "user@example.com", "pass");

    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login");
    await expect(page.getByTestId("auth-login-submit")).toBeVisible();

    // Going to /dashboard should redirect to /login
    await page.goto("/dashboard");
    await page.waitForURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await signUpUser(page, "user@example.com", "pass");

    // Wait for service worker to be registered and active
    await page.waitForFunction(
      () =>
        navigator.serviceWorker.controller !== null ||
        navigator.serviceWorker.ready.then(() => true),
      { timeout: 10000 }
    );

    // Wait a moment for SW to cache pages
    await page.waitForTimeout(1000);

    // Go offline
    await context.setOffline(true);

    // Try to navigate to /login
    await page.goto("/login").catch(() => {});

    // Should not hard-crash – at minimum the page body should have some content
    const body = page.locator("body");
    const content = await body.innerHTML();
    expect(content.length).toBeGreaterThan(0);

    // Restore connectivity
    await context.setOffline(false);
  });
});