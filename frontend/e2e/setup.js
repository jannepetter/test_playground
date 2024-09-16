import { resetDb } from "./helper";

async function globalSetup() {
  console.log("Running playwright test setup...");
  await resetDb();
}

export default globalSetup;
