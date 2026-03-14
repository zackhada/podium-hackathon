// GET /tenants — list all tenants with their unit, lease, and payment info.

import { Router } from "express";

const router = Router();

// GET /tenants
router.get("/", async (_req, res) => {
  // TODO: const tenants = await prisma.tenant.findMany({ include: { unit: { include: { property: true } }, leases: true, payments: { orderBy: { dueDate: "desc" }, take: 1 } } });
  // TODO: return res.json(tenants);
  res.json({ message: "TODO: implement GET /tenants" });
});

export default router;
