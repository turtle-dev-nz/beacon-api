const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const cardsRouter = require("./routes/cards");

const { sqlTestHandler } = require("./routes/sql-test");

const app = express();
const port = Number.parseInt(process.env.PORT || "4000", 10);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "api", message: "API is running" });
});

app.get("/api/sql-test", sqlTestHandler);

app.use("/api/cards", cardsRouter);

app.listen(port, () => {
  // Keep startup output simple for local development.
  console.log(`API server running on http://localhost:${port}`);
});
