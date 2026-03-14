import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ── Properties ──────────────────────────────────────────────────────────────
  const [prop1, prop2, prop3] = await Promise.all([
    prisma.property.upsert({
      where: { id: "prop-1" },
      update: {},
      create: { id: "prop-1", address: "123 Main St" },
    }),
    prisma.property.upsert({
      where: { id: "prop-2" },
      update: {},
      create: { id: "prop-2", address: "456 Oak Ave" },
    }),
    prisma.property.upsert({
      where: { id: "prop-3" },
      update: {},
      create: { id: "prop-3", address: "789 Pine Blvd" },
    }),
  ]);
  console.log("✓ Properties:", prop1.address, prop2.address, prop3.address);

  // ── Units ────────────────────────────────────────────────────────────────────
  const unitDefs = [
    { id: "unit-1-1A", number: "1A", propertyId: "prop-1" },
    { id: "unit-1-1B", number: "1B", propertyId: "prop-1" },
    { id: "unit-1-2A", number: "2A", propertyId: "prop-1" },
    { id: "unit-1-2B", number: "2B", propertyId: "prop-1" },
    { id: "unit-2-1A", number: "1A", propertyId: "prop-2" },
    { id: "unit-2-1B", number: "1B", propertyId: "prop-2" },
    { id: "unit-2-2A", number: "2A", propertyId: "prop-2" },
    { id: "unit-2-2B", number: "2B", propertyId: "prop-2" },
    { id: "unit-3-1A", number: "1A", propertyId: "prop-3" },
    { id: "unit-3-1B", number: "1B", propertyId: "prop-3" },
    { id: "unit-3-2A", number: "2A", propertyId: "prop-3" }, // vacant
    { id: "unit-3-2B", number: "2B", propertyId: "prop-3" }, // vacant
  ];
  await Promise.all(
    unitDefs.map((u) =>
      prisma.unit.upsert({ where: { id: u.id }, update: {}, create: u })
    )
  );
  console.log("✓ Units:", unitDefs.length);

  // ── Vendors ──────────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.vendor.upsert({
      where: { id: "vendor-1" },
      update: {},
      create: { id: "vendor-1", name: "Mike's Plumbing", trade: "plumbing", phone: "(555) 100-0001" },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-2" },
      update: {},
      create: { id: "vendor-2", name: "Bright Electrical", trade: "electrical", phone: "(555) 100-0002" },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-3" },
      update: {},
      create: { id: "vendor-3", name: "General Fix-It Co.", trade: "general", phone: "(555) 100-0003" },
    }),
  ]);
  console.log("✓ Vendors: 3");

  // ── Tenants + Leases ─────────────────────────────────────────────────────────
  const tenantDefs = [
    { id: "tenant-1",  name: "Alice Johnson",   email: "alice.johnson@example.com",   phone: "(555) 000-0001", unitId: "unit-1-1A", rent: 1500 },
    { id: "tenant-2",  name: "Bob Martinez",    email: "bob.martinez@example.com",    phone: "(555) 000-0002", unitId: "unit-1-1B", rent: 1600 },
    { id: "tenant-3",  name: "Carol Lee",       email: "carol.lee@example.com",       phone: "(555) 000-0003", unitId: "unit-1-2A", rent: 1700 },
    { id: "tenant-4",  name: "David Kim",       email: "david.kim@example.com",       phone: "(555) 000-0004", unitId: "unit-1-2B", rent: 1800 },
    { id: "tenant-5",  name: "Emily Chen",      email: "emily.chen@example.com",      phone: "(555) 000-0005", unitId: "unit-2-1A", rent: 1900 },
    { id: "tenant-6",  name: "Frank Rivera",    email: "frank.rivera@example.com",    phone: "(555) 000-0006", unitId: "unit-2-1B", rent: 2000 },
    { id: "tenant-7",  name: "Grace Wu",        email: "grace.wu@example.com",        phone: "(555) 000-0007", unitId: "unit-2-2A", rent: 2100 },
    { id: "tenant-8",  name: "Henry Park",      email: "henry.park@example.com",      phone: "(555) 000-0008", unitId: "unit-2-2B", rent: 2200 },
    { id: "tenant-9",  name: "Isabella Torres", email: "isabella.torres@example.com", phone: "(555) 000-0009", unitId: "unit-3-1A", rent: 2300 },
    { id: "tenant-10", name: "Sarah Chen",      email: "sarah.chen@example.com",      phone: "(555) 000-0010", unitId: "unit-3-1B", rent: 2400 },
  ];

  const leaseStart = new Date("2025-01-01");
  const leaseEnd   = new Date("2025-12-31");

  for (const t of tenantDefs) {
    await prisma.tenant.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, name: t.name, email: t.email, phone: t.phone, unitId: t.unitId },
    });
    await prisma.lease.upsert({
      where: { id: `lease-${t.id}` },
      update: {},
      create: {
        id: `lease-${t.id}`,
        tenantId: t.id,
        startDate: leaseStart,
        endDate: leaseEnd,
        rentAmount: t.rent,
      },
    });
  }
  console.log("✓ Tenants + Leases:", tenantDefs.length);

  // ── Payments ─────────────────────────────────────────────────────────────────
  // March 2026: 7 paid (tenants 1–7), 3 pending (tenants 8–10)
  // February 2026: 2 overdue (tenants 9–10 — they also missed last month)
  const marchDue = new Date("2026-03-01");
  const febDue   = new Date("2026-02-01");
  const marchPaid = new Date("2026-03-03");

  const paymentDefs = [
    { id: "pay-1",      tenantId: "tenant-1",  amount: 1500, status: "paid",    dueDate: marchDue, paidAt: marchPaid },
    { id: "pay-2",      tenantId: "tenant-2",  amount: 1600, status: "paid",    dueDate: marchDue, paidAt: marchPaid },
    { id: "pay-3",      tenantId: "tenant-3",  amount: 1700, status: "paid",    dueDate: marchDue, paidAt: marchPaid },
    { id: "pay-4",      tenantId: "tenant-4",  amount: 1800, status: "paid",    dueDate: marchDue, paidAt: marchPaid },
    { id: "pay-5",      tenantId: "tenant-5",  amount: 1900, status: "paid",    dueDate: marchDue, paidAt: marchPaid },
    { id: "pay-6",      tenantId: "tenant-6",  amount: 2000, status: "paid",    dueDate: marchDue, paidAt: marchPaid },
    { id: "pay-7",      tenantId: "tenant-7",  amount: 2100, status: "paid",    dueDate: marchDue, paidAt: marchPaid },
    { id: "pay-8",      tenantId: "tenant-8",  amount: 2200, status: "pending", dueDate: marchDue, paidAt: null },
    { id: "pay-9",      tenantId: "tenant-9",  amount: 2300, status: "pending", dueDate: marchDue, paidAt: null },
    { id: "pay-10",     tenantId: "tenant-10", amount: 2400, status: "pending", dueDate: marchDue, paidAt: null },
    { id: "pay-9-feb",  tenantId: "tenant-9",  amount: 2300, status: "overdue", dueDate: febDue,   paidAt: null },
    { id: "pay-10-feb", tenantId: "tenant-10", amount: 2400, status: "overdue", dueDate: febDue,   paidAt: null },
  ];

  await Promise.all(
    paymentDefs.map((p) =>
      prisma.payment.upsert({
        where: { id: p.id },
        update: {},
        create: p,
      })
    )
  );
  console.log("✓ Payments: 12 (7 paid, 3 pending, 2 overdue)");

  // ── Maintenance Tickets ───────────────────────────────────────────────────────
  const ticketDefs = [
    // 123 Main St
    {
      id: "ticket-1",
      unitId: "unit-1-2A",
      description: "HVAC making loud grinding noise",
      status: "open",
      vendorId: null,
      scheduledAt: null,
      createdAt: new Date("2026-03-10T09:15:00Z"),
    },
    {
      id: "ticket-2",
      unitId: "unit-1-1B",
      description: "Leaky faucet in kitchen sink",
      status: "in_progress",
      vendorId: "vendor-1",
      scheduledAt: new Date("2026-03-15T10:00:00Z"),
      createdAt: new Date("2026-03-11T14:30:00Z"),
    },
    {
      id: "ticket-3",
      unitId: "unit-1-2B",
      description: "Bathroom outlet not working",
      status: "open",
      vendorId: "vendor-2",
      scheduledAt: new Date("2026-03-16T13:00:00Z"),
      createdAt: new Date("2026-03-12T08:00:00Z"),
    },
    {
      id: "ticket-4",
      unitId: "unit-1-1A",
      description: "Broken window latch in bedroom",
      status: "resolved",
      vendorId: "vendor-3",
      scheduledAt: new Date("2026-03-08T11:00:00Z"),
      createdAt: new Date("2026-03-07T16:45:00Z"),
    },
    // 456 Oak Ave
    {
      id: "ticket-5",
      unitId: "unit-2-2A",
      description: "Water heater not producing hot water",
      status: "open",
      vendorId: "vendor-1",
      scheduledAt: new Date("2026-03-15T09:00:00Z"),
      createdAt: new Date("2026-03-13T07:30:00Z"),
    },
    {
      id: "ticket-6",
      unitId: "unit-2-1A",
      description: "Ceiling light fixture flickering",
      status: "in_progress",
      vendorId: "vendor-2",
      scheduledAt: new Date("2026-03-14T14:00:00Z"),
      createdAt: new Date("2026-03-12T11:20:00Z"),
    },
    {
      id: "ticket-7",
      unitId: "unit-2-1B",
      description: "Front door deadbolt sticking",
      status: "resolved",
      vendorId: "vendor-3",
      scheduledAt: null,
      createdAt: new Date("2026-03-06T10:00:00Z"),
    },
    {
      id: "ticket-8",
      unitId: "unit-2-2B",
      description: "Dishwasher leaking from bottom",
      status: "open",
      vendorId: null,
      scheduledAt: null,
      createdAt: new Date("2026-03-14T06:50:00Z"),
    },
    // 789 Pine Blvd
    {
      id: "ticket-9",
      unitId: "unit-3-1A",
      description: "Dryer not heating — clothes stay wet",
      status: "open",
      vendorId: "vendor-3",
      scheduledAt: new Date("2026-03-16T10:00:00Z"),
      createdAt: new Date("2026-03-13T15:00:00Z"),
    },
    {
      id: "ticket-10",
      unitId: "unit-3-1B",
      description: "Cracked bathroom tile causing leak into unit below",
      status: "in_progress",
      vendorId: "vendor-1",
      scheduledAt: new Date("2026-03-15T08:00:00Z"),
      createdAt: new Date("2026-03-11T09:10:00Z"),
    },
    {
      id: "ticket-11",
      unitId: "unit-3-1A",
      description: "Smoke detector chirping — battery replacement needed",
      status: "resolved",
      vendorId: "vendor-3",
      scheduledAt: null,
      createdAt: new Date("2026-03-05T13:00:00Z"),
    },
    {
      id: "ticket-12",
      unitId: "unit-3-1B",
      description: "Balcony sliding door off track",
      status: "open",
      vendorId: null,
      scheduledAt: null,
      createdAt: new Date("2026-03-14T17:00:00Z"),
    },
  ];

  await Promise.all(
    ticketDefs.map((t) =>
      prisma.maintenanceTicket.upsert({
        where: { id: t.id },
        update: {},
        create: t,
      })
    )
  );
  console.log(`✓ Maintenance tickets: ${ticketDefs.length} (across all 3 properties)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
