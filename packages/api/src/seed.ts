// Seed script — populates the database with demo data.
// Run with: npm run seed (ts-node src/seed.ts)
// TODO: Import PrismaClient and insert all records.

// Data shape:
// - 3 properties: "123 Main St", "456 Oak Ave", "789 Pine Blvd"
// - 12 units total (mix of 1BR/2BR labels in unit number)
//   - 123 Main St:  1A, 1B, 2A, 2B
//   - 456 Oak Ave:  1A, 1B, 2A, 2B
//   - 789 Pine Blvd: 1A, 1B, 2A (vacant), 2B (vacant)
// - 10 tenants occupying 10 of the 12 units
//   Names: Alice Johnson, Bob Martinez, Carol Lee, David Kim, Emily Chen,
//          Frank Rivera, Grace Wu, Henry Park, Isabella Torres, Sarah Chen (unit 4B)
//   Emails: firstname.lastname@example.com
//   Phones: (555) 000-0001 through (555) 000-0010
//   Each has one active Lease, rentAmount $1,500–$2,500
// - 3 vendors:
//   Mike's Plumbing  (trade: "plumbing",    phone: "(555) 100-0001")
//   Bright Electrical (trade: "electrical", phone: "(555) 100-0002")
//   General Fix-It Co.(trade: "general",    phone: "(555) 100-0003")
// - 12 payments (one per tenant for current month):
//   7 paid, 3 pending, 2 overdue
// - 1 pre-existing open ticket: "HVAC making noise" on unit 2A at 123 Main St

// TODO: const prisma = new PrismaClient();
// TODO: async function main() { ... }
// TODO: main().catch(console.error).finally(() => prisma.$disconnect());

console.log("TODO: implement seed.ts");
