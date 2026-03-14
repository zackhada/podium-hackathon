import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { broadcast } from "../ws";

const router = Router();

const NotifySchema = z.object({
  tenantId: z.string(),
  message: z.string().min(1),
});

router.post("/", async (req, res) => {
  const parsed = NotifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { tenantId, message } = parsed.data;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { unit: { include: { property: true } } },
  });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  console.log(`[SMS] To: ${tenant.phone} (${tenant.name}) — ${message}`);

  broadcast({
    type: "action",
    id: `notify-${Date.now()}`,
    propertyId: tenant.unit?.property.id ?? "",
    category: "messaging",
    title: "Tenant Notified",
    description: `SMS to ${tenant.name}: ${message.slice(0, 80)}`,
    timestamp: new Date().toISOString(),
    status: "completed",
  });

  return res.json({ sent: true, tenant: { name: tenant.name, phone: tenant.phone } });
});

export default router;
