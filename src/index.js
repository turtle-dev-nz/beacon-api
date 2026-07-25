const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const cardsRouter = require("./routes/cards");
const contactsRouter = require("./routes/contacts");
const scanRouter = require("./routes/scan");
const { sqlTestHandler } = require("./routes/sql-test");

const app = express();
const port = Number.parseInt(process.env.PORT || "4000", 10);

app.use(cors());
app.use(express.json());

// Serve uploaded card images
const uploadsDir = path.resolve(__dirname, "../", process.env.UPLOADS_DIR || "uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "api", message: "API is running" });
});

app.get("/api/sql-test", sqlTestHandler);

app.use("/api/cards", cardsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/scan", scanRouter);

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
