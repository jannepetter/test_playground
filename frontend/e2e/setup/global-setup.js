const { chromium, expect } = require("@playwright/test");
import { resetDb, testAuthPath } from "./helper";

async function globalSetup(config) {
  const baseUrl = config.projects[0].use.baseURL;
  console.log("Running playwright test setup...");
  await resetDb();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseUrl + "/login");
  await page.getByPlaceholder("username").fill("testuser");
  await page.getByPlaceholder("password").fill("testuser");
  await page.getByRole("button", { name: "Submit" }).click();

  // login successful and redirect
  await expect(page).toHaveURL(/.*\/blogs$/, { timeout: 15000 });
  await page.context().storageState({ path: testAuthPath });
  await browser.close();
}

export default globalSetup;
