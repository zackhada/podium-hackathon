// Vendor assignment service.
// Given a maintenance ticket description, determine the required trade and find an available vendor.
// TODO: Add smarter keyword matching or ask LLM to classify trade.

/**
 * Determine the trade category from a ticket description.
 * Examples: "toilet" → "plumbing", "outlet" → "electrical", else → "general"
 */
export function inferTrade(description: string): string {
  // TODO: Implement keyword matching
  // const lower = description.toLowerCase();
  // if (lower.match(/toilet|pipe|leak|water|drain|faucet|plumb/)) return "plumbing";
  // if (lower.match(/outlet|electric|power|circuit|light|breaker/)) return "electrical";
  // return "general";
  return "general";
}

/**
 * Find the first available vendor for a given trade.
 * TODO: In a real system this would check vendor schedules; for demo just pick first.
 */
export async function findVendorForTrade(trade: string): Promise<{ id: string; name: string; phone: string } | null> {
  // TODO: const vendor = await prisma.vendor.findFirst({ where: { trade } });
  // TODO: return vendor;
  return null;
}
