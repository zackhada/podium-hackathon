// Maintenance ticket CRUD.
// GET  /maintenance        — list all tickets with unit + vendor info
// POST /maintenance        — create new ticket { unitId, description }
// PATCH /maintenance/:id   — update ticket { status, vendorId, scheduledAt }
// TODO: Broadcast updates via WebSocket after POST/PATCH.

import { Router } from "express";

const router = Router();

// GET /maintenance
router.get("/", async (_req, res) => {
  // TODO: const tickets = await prisma.maintenanceTicket.findMany({ include: { unit: { include: { property: true } }, vendor: true } });
  // TODO: return res.json(tickets);
  res.json({ message: "TODO: implement GET /maintenance" });
});

// POST /maintenance
// Body: { unitId: string, description: string }
router.post("/", async (req, res) => {
  // TODO: Validate body with zod
  // TODO: const ticket = await prisma.maintenanceTicket.create({ data: { unitId, description, status: "open" } });
  // TODO: Broadcast ticket to WebSocket clients
  // TODO: return res.status(201).json(ticket);
  res.json({ message: "TODO: implement POST /maintenance" });
});

// PATCH /maintenance/:id
// Body: { status?, vendorId?, scheduledAt? }
router.patch("/:id", async (req, res) => {
  // TODO: const ticket = await prisma.maintenanceTicket.update({ where: { id: req.params.id }, data: req.body });
  // TODO: Broadcast updated ticket to WebSocket clients
  // TODO: return res.json(ticket);
  res.json({ message: "TODO: implement PATCH /maintenance/:id" });
});

export default router;
