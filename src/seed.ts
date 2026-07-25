import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "./config/env.js";
import prisma from "./config/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const firebaseUid = "dev-local";
  const email = "dev@local.test";

  let user = await prisma.user.findUnique({ where: { firebaseUid } });

  if (!user) {
    user = await prisma.user.create({ data: { firebaseUid, email } });
    console.log("Created dev user:", user.id);
  } else {
    console.log("Dev user already exists:", user.id);
  }

  // Write DEV_USER_ID back into .env
  const envPath = path.resolve(__dirname, "../.env");
  let envContent = fs.readFileSync(envPath, "utf8");

  if (envContent.includes("DEV_USER_ID=")) {
    envContent = envContent.replace(/DEV_USER_ID=.*/, `DEV_USER_ID=${user.id}`);
  } else {
    envContent += `\nDEV_USER_ID=${user.id}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(".env updated with DEV_USER_ID");

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
