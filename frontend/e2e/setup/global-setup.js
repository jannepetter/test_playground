const { chromium, expect } = require("@playwright/test");
import { resetDb, testAuthPath } from "./helper";

async function globalSetup(config, testInfo) {
  const baseUrl = config.projects[0].use.baseURL;
  console.log("Running playwright test setup...");
  await resetDb();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(baseUrl + "/login");
  await expect(async () => {
    const loginTitle = page.locator("h1");
    await expect(loginTitle).toHaveText("Login");
  }).toPass({ timeout: 15000 });

  await page.getByPlaceholder("username").fill("testuser");
  await page.getByPlaceholder("password").fill("testuser");

  await expect(async () => {
    await page.getByRole("button", { name: "Submit" }).click();
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Blogs");
  }).toPass({ timeout: 30000 });

  await page.context().storageState({ path: testAuthPath });
  await browser.close();
}

export default globalSetup;
