const { test, expect } = require("@playwright/test");
const { testAuthPath } = require("./setup/helper");

test.describe("Tests for blogs", () => {
  test.use({ storageState: testAuthPath }); // use the logged in user defined in global-setup

  test("Get users", async ({ page }) => {
    await page.goto("/users");
    let userList;
    await expect(async () => {
      const title = page.locator("h1");
      await expect(title).toHaveText("Users");
      userList = await page.getByRole("listitem").all();
      expect(userList.length).toBe(2);
    }).toPass({ timeout: 15000 });
  });
});
