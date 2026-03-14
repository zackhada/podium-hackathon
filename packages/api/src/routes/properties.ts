// GET /properties — Return all properties with their units and occupancy status.
// TODO: Import PrismaClient, query Property with units and tenant relations.

import { Router } from "express";

const router = Router();

// GET /properties
// Returns: Property[] with nested units (unit number, tenant name if occupied)
router.get("/", async (_req, res) => {
  // TODO: const properties = await prisma.property.findMany({ include: { units: { include: { tenant: true, tickets: { where: { status: { not: "resolved" } } } } } } });
  // TODO: return res.json(properties);
  res.json({ message: "TODO: implement GET /properties" });
});

export default router;
