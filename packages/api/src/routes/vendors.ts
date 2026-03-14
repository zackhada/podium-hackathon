import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const { trade } = req.query;
  const vendors = await prisma.vendor.findMany({
    where: trade ? { trade: String(trade) } : undefined,
  });
  res.json(vendors);
});

export default router;
