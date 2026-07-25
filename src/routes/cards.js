import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const cards = await prisma.card.findMany();
    res.json(cards);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve cards",
    });
  }
});

export default router;
