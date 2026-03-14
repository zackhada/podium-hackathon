// POST /notify — Log a notification to the tenant (simulates SMS).
// Body: { tenantId: string, message: string }
// In demo mode this just logs to console + stores in a Notification table (or logs to stdout).
// TODO: Optionally add a Notification model to Prisma schema and persist messages.

import { Router } from "express";

const router = Router();

// POST /notify
router.post("/", async (req, res) => {
  // TODO: Validate body: { tenantId, message }
  // TODO: Look up tenant name/phone
  // TODO: console.log(`[SMS] To: ${tenant.phone} — ${message}`)
  // TODO: Optionally persist to Notification table
  // TODO: return res.json({ sent: true })
  res.json({ message: "TODO: implement POST /notify" });
});

export default router;
