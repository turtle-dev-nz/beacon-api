const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const cards = await prisma.card.findMany();

    res.json(["RETURNING CARDS ENDPOINT"]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve cards" + error,
    });
  }
});

module.exports = router;
