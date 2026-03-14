import { Router } from "express";
import { prisma } from "../lib/prisma";
import { broadcast } from "../ws";
import { chargeTestCard } from "../services/stripe";

const router = Router();

router.get("/", async (_req, res) => {
  const payments = await prisma.payment.findMany({
    include: { tenant: { include: { unit: { include: { property: true } } } } },
    orderBy: { dueDate: "desc" },
  });
  res.json(payments);
});

router.post("/collect/:tenantId", async (req, res) => {
  const { tenantId } = req.params;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { unit: { include: { property: true } } },
  });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  const payment = await prisma.payment.findFirst({
    where: { tenantId, status: { in: ["pending", "overdue"] } },
    orderBy: { dueDate: "desc" },
  });
  if (!payment) return res.status(404).json({ error: "No outstanding payment found" });

  const { success, chargeId } = await chargeTestCard(payment.amount, tenant.email);
  if (!success) return res.status(500).json({ error: "Charge failed" });

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "paid", paidAt: new Date() },
    include: { tenant: true },
  });

  broadcast({
    type: "action",
    id: updated.id,
    propertyId: tenant.unit?.property.id ?? "",
    category: "messaging",
    title: "Rent Collected",
    description: `$${payment.amount} collected from ${tenant.name} (${chargeId})`,
    timestamp: new Date().toISOString(),
    status: "completed",
    cost: payment.amount,
  });

  return res.json({ success: true, payment: updated });
});

export default router;
