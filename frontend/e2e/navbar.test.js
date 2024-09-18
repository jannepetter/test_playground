const { test, expect } = require("@playwright/test");
const { testAuthPath } = require("./setup/helper");

test.describe("Tests for navbar", () => {
  test.use({ storageState: testAuthPath });

  test("test some navbar stuff", async ({ page }) => {
    console.log("nav stuff2---");
    await page.goto("/blogs");
    await expect(page).toHaveURL(/.*\/blogs$/, { timeout: 15000 });
  });
  test("test some navbar stuff2", async ({ page }) => {
    console.log("nav stuff3---");
    await page.goto("/blogs");
    await expect(page).toHaveURL(/.*\/blogs$/, { timeout: 15000 });
  });
});
