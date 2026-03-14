import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const tenants = await prisma.tenant.findMany({
    include: {
      unit: { include: { property: true } },
      leases: true,
      payments: { orderBy: { dueDate: "desc" }, take: 1 },
    },
  });
  res.json(tenants);
});

export default router;
