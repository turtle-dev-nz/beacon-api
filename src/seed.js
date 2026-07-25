require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const prisma = require("./config/prisma");
const fs = require("fs");
const path = require("path");

async function seed() {
  const email = "dev@local.test";

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({ data: { email } });
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
