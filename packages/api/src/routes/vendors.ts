// GET /vendors — list vendors, optionally filtered by trade.
// Query param: ?trade=plumbing|electrical|general

import { Router } from "express";

const router = Router();

// GET /vendors?trade=plumbing
router.get("/", async (req, res) => {
  // TODO: const { trade } = req.query;
  // TODO: const vendors = await prisma.vendor.findMany({ where: trade ? { trade: String(trade) } : undefined });
  // TODO: return res.json(vendors);
  res.json({ message: "TODO: implement GET /vendors" });
});

export default router;
