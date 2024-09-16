const { exec } = require("child_process");
import { Client } from "pg";

export const resetDb = async () => {
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

export const startTransaction = async () => {
  console.log("starting transaction");
  const testDbUrl = "postgresql://postgres:postgres@db:5432/postgres";
  const client = new Client({
    connectionString: testDbUrl,
  });
  await client.connect();
  await client.query("BEGIN");
  return client;
};

export const rollbackTransaction = async (client) => {
  console.log("rolling back");
  await client.query("ROLLBACK");
  await client.end();
};
