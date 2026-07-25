import cors from "cors";
import express, { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import "./config/env.js";

import cardsRouter from "./routes/cards.js";
import contactsRouter from "./routes/contacts.js";
import scanRouter from "./routes/scan.js";
import { sqlTestHandler } from "./routes/sql-test.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number.parseInt(process.env.PORT || "4000", 10);

app.use(cors());
app.use(express.json());

// Serve uploaded card images
const uploadsDir = path.resolve(__dirname, "../", process.env.UPLOADS_DIR || "uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "api", message: "API is running" });
});

app.get("/api/sql-test", sqlTestHandler);

app.use("/api/cards", cardsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/scan", scanRouter);

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
