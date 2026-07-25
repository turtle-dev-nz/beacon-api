import express, { type Request, type Response } from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const cards = await prisma.profileCard.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(cards);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve cards",
    });
  }
});

export default router;
