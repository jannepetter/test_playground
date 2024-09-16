const { test, expect } = require("@playwright/test");
const { startTransaction, rollbackTransaction } = require("./helper");

const testAuthPath = "/test_playground/frontend/e2e/auth.json";

test.describe("Tests for blogs", () => {
  test.beforeAll(async ({ browser }) => {
    // test login and save it for reuse
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

  test.beforeEach(async () => {
    const client = await startTransaction();
    test.client_instance = client;
  });
  test.afterEach(async () => {
    await rollbackTransaction(test.client_instance);
  });

  test("Get blogs", async ({ page }) => {
    await page.goto("/blogs");
    // await page.waitForLoadState("domcontentloaded");
    await page.waitForResponse("http://server:8000/api/blog/", { timeout: 15000 });
    const blogList = await page.getByTestId("blogList").getByRole("link").all();

    console.log("list--", blogList.length);

    // expect(blogList).toHaveText("some title");
    // expect(blogList).toHaveText("another title");
    // expect(blogList).toHaveText("something");
    // expect(blogList).toHaveText("test title");
  });
});
