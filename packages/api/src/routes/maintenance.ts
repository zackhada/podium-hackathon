import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { broadcast } from "../ws";
import { inferTrade, findVendorForTrade } from "../services/vendorAssignment";

const router = Router();

const CreateSchema = z.object({
  unitId: z.string(),
  description: z.string().min(1),
});

const UpdateSchema = z.object({
  status: z.enum(["open", "scheduled", "resolved"]).optional(),
  vendorId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

router.get("/", async (_req, res) => {
  const tickets = await prisma.maintenanceTicket.findMany({
    include: {
      unit: { include: { property: true } },
      vendor: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(tickets);
});

router.post("/", async (req, res) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { unitId, description } = parsed.data;
  const trade = inferTrade(description);
  const vendor = await findVendorForTrade(trade);

  const ticket = await prisma.maintenanceTicket.create({
    data: {
      unitId,
      description,
      status: "open",
      ...(vendor ? { vendorId: vendor.id } : {}),
    },
    include: { unit: { include: { property: true } }, vendor: true },
  });

  broadcast({
    type: "action",
    id: ticket.id,
    propertyId: ticket.unit.propertyId,
    category: "repair",
    title: "Ticket Created",
    description: `${description}${vendor ? ` — assigned to ${vendor.name}` : ""}`,
    timestamp: new Date().toISOString(),
    status: "in-progress",
  });

  return res.status(201).json(ticket);
});

router.patch("/:id", async (req, res) => {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const ticket = await prisma.maintenanceTicket.update({
    where: { id: req.params.id },
    data: {
      ...parsed.data,
      ...(parsed.data.scheduledAt
        ? { scheduledAt: new Date(parsed.data.scheduledAt) }
        : {}),
    },
    include: { unit: { include: { property: true } }, vendor: true },
  });

  broadcast({
    type: "action",
    id: ticket.id,
    propertyId: ticket.unit.propertyId,
    category: "repair",
    title: "Ticket Updated",
    description: `Status: ${ticket.status}${ticket.vendor ? ` — ${ticket.vendor.name}` : ""}`,
    timestamp: new Date().toISOString(),
    status: ticket.status === "resolved" ? "completed" : "in-progress",
  });

  return res.json(ticket);
});

export default router;
