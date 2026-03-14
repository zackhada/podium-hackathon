---
name: get-property-status
description: Get an overview of all properties — occupancy, open tickets, and unit status.
version: 1.0.0
author: podium-team
---

# Get Property Status

Trigger when the owner asks about property status, portfolio overview, or issues across properties.

## Instructions

1. Use **list-properties** to fetch all properties (includes units, tenants, and open tickets).
2. Compute: total units, occupied count, vacant count, and open ticket count per property.
3. Return a structured summary with per-property stats and portfolio totals.

## Output

Example: "You have 12 units across 3 properties. 10 occupied (83%), 2 vacant. 2 open maintenance tickets."
