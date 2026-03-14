import { prisma } from "../lib/prisma";

export function inferTrade(description: string): string {
  const lower = description.toLowerCase();
  if (lower.match(/toilet|pipe|leak|water|drain|faucet|plumb/)) return "plumbing";
  if (lower.match(/outlet|electric|power|circuit|light|breaker|wiring/)) return "electrical";
  return "general";
}

export async function findVendorForTrade(
  trade: string
): Promise<{ id: string; name: string; phone: string } | null> {
  const vendor = await prisma.vendor.findFirst({ where: { trade } });
  return vendor;
}
