const { exec } = require("child_process");

const getScript = () => {
  switch (process.env.NEXT_PUBLIC_APP_ENV) {
    case "CI":
      return "sh /app/reset_db.sh";
    case "ENV":
      return "sh /scripts/aws_reset_db.sh testrunner";
    default:
      return "sh ./frontend/reset_db.sh";
  }
};

export const resetDb = async () => {
  console.log("Restoring the database...");

  await new Promise((resolve, reject) => {
    exec(getScript(), (error, stdout) => {
      if (error) {
        console.error(`Error restoring database: ${error}`);
        return reject(error);
      }
      console.log("Database restored successfully:", stdout);
      resolve();
    });
  });
};

const baseDir = process.env.NEXT_PUBLIC_APP_ENV ? "/app" : "./frontend";
export const testAuthPath = `${baseDir}/e2e/setup/auth.json`;
