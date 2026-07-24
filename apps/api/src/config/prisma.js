const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || typeof databaseUrl !== "string") {
  throw new Error("DATABASE_URL is missing or invalid. Check apps/api/.env and restart the API server.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;