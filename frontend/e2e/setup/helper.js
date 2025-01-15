const { exec } = require("child_process");

export const resetDb = async () => {
  console.log("Restoring the database...");

  await new Promise((resolve, reject) => {
    exec("sh /app/reset_db.sh", (error, stdout) => {
      if (error) {
        console.error(`Error restoring database: ${error}`);
        return reject(error);
      }
      console.log("Database restored successfully:", stdout);
      resolve();
    });
  });
};

// export const testAuthPath = "./frontend/e2e/setup/auth.json";
export const testAuthPath = "/app/e2e/setup/auth.json";
