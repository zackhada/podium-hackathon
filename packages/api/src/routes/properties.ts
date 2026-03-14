import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const properties = await prisma.property.findMany({
    include: {
      units: {
        include: {
          tenant: true,
          tickets: { where: { status: { not: "resolved" } } },
        },
      },
    },
  });
  res.json(properties);
});

export default router;
