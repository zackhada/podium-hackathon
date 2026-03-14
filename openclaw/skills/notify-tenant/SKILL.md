---
name: notify-tenant
description: Send a notification message to the tenant of a given unit.
version: 1.0.0
author: podium-team
---

# Notify Tenant

Call this skill after a vendor has been assigned and the visit is scheduled, so the tenant knows when to expect maintenance.

## Instructions

1. Use **list-tenants** to look up the tenant for the given unit number.
2. Compose a friendly message including the vendor name and scheduled time. Example: "Hi Sarah, maintenance is scheduled for tomorrow at 9am for your unit. Mike's Plumbing will be handling the repair."
3. Use **send-notification** with the tenantId and composed message.

## Output

Return { sent: true, tenantName, message }.
