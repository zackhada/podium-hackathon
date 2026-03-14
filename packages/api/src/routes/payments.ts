// Payment routes.
// GET  /payments                    — list all payments with tenant info
// POST /payments/collect/:tenantId  — trigger Stripe test charge for tenant's current-month payment

import { Router } from "express";

const router = Router();

// GET /payments
router.get("/", async (_req, res) => {
  // TODO: const payments = await prisma.payment.findMany({ include: { tenant: { include: { unit: { include: { property: true } } } } }, orderBy: { dueDate: "desc" } });
  // TODO: return res.json(payments);
  res.json({ message: "TODO: implement GET /payments" });
});

// POST /payments/collect/:tenantId
// Triggers a Stripe test charge for the tenant's most recent pending/overdue payment.
router.post("/collect/:tenantId", async (req, res) => {
  // TODO: Find pending/overdue payment for tenant
  // TODO: Call stripeService.charge(amount, tenantEmail)
  // TODO: Update payment status to "paid", set paidAt
  // TODO: return res.json({ success: true, payment })
  res.json({ message: "TODO: implement POST /payments/collect/:tenantId" });
});

export default router;
