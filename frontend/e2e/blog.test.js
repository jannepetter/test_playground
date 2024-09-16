const { test, expect } = require("@playwright/test");
const { exec } = require("child_process");

const testAuthPath = "/test_playground/frontend/e2e/auth.json";

const resetDb = async () => {
  console.log("Restoring the database...");

  await new Promise((resolve, reject) => {
    exec("sh /test_playground/frontend/reset_db.sh", (error, stdout) => {
      if (error) {
        console.error(`Error restoring database: ${error}`);
        return reject(error);
      }
      console.log("Database restored successfully:", stdout);
      resolve();
    });
  });
};

test.describe("Tests for blogs", () => {
  test.beforeAll(async ({ browser }) => {
    // test login and save it for reuse
    // await resetDb();
    const context = await browser.newContext({ storageState: testAuthPath });
    const page = await context.newPage();
    await page.goto("/login");
    await page.getByPlaceholder("username").fill("testuser");
    await page.getByPlaceholder("password").fill("testuser");
    await page.getByRole("button", { name: "Submit" }).click();

    // login successful and redirect
    await expect(page).toHaveURL(/.*\/blogs$/, { timeout: 15000 });
    await page.context().storageState({ path: testAuthPath });
    await context.close();
  });

  test.use({ storageState: testAuthPath });

  test("Get blogs", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page).toHaveTitle("Frontend");
  });
});
