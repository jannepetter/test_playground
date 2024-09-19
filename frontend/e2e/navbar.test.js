const { test, expect } = require("@playwright/test");
const { testAuthPath } = require("./setup/helper");

test.describe.configure({ mode: "parallel" });

test.describe("Tests for navbar", () => {
  test.use({ storageState: testAuthPath });

  test("test home link", async ({ page }) => {
    await page.goto("/blogs");
    const navbar = page.getByTestId("navbar");
    await navbar.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL(/.*\/$/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "The app" })).toBeVisible();
  });

  test("test blogs link", async ({ page }) => {
    await page.goto("/");
    const navbar = page.getByTestId("navbar");
    await navbar.getByRole("link", { name: "Blogs" }).click();
    await expect(page).toHaveURL(/.*\/blogs$/, { timeout: 15000 });
  });

  test("test create blog link", async ({ page }) => {
    await page.goto("/");
    const navbar = page.getByTestId("navbar");
    await navbar.getByRole("link", { name: "Create blog" }).click();
    await expect(page).toHaveURL(/.*\/blogs\/create$/, { timeout: 15000 });
  });
});
