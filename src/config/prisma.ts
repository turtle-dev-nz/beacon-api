import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "./env.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || typeof databaseUrl !== "string") {
  throw new Error("DATABASE_URL is missing or invalid. Check api/.env and restart the API server.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
