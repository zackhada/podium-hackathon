---
name: assign-vendor
description: Assign an available vendor to an open maintenance ticket and schedule the visit.
version: 1.0.0
author: podium-team
---

# Assign Vendor

Call this skill immediately after create-maintenance-ticket succeeds, or when asked to assign a vendor to an existing ticket.

## Instructions

1. Infer the required trade from the ticket description (plumbing, electrical, or general).
2. Use **list-vendors** with the inferred trade to fetch available vendors.
3. Pick the first available vendor from the results.
4. Schedule the visit for tomorrow at 9 AM.
5. Use **update-maintenance-ticket** to update the ticket with the vendorId, scheduledAt, and status "scheduled".

## Output

Return the updated ticket with vendor name, phone, and scheduled time.
