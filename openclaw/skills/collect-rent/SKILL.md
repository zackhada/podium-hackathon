---
name: collect-rent
description: Collect rent from a specific tenant by triggering a Stripe test charge.
version: 1.0.0
author: podium-team
---

# Collect Rent

Trigger when the owner says something like "collect rent from [tenant]", "charge [tenant]", or "send payment request to [tenant]".

## Instructions

1. Use **list-tenants** to look up the tenant by name and find the tenantId.
2. Use **collect-payment** with the tenantId to trigger a Stripe test charge.
3. Return the updated payment status.

## Output

Return { success: true, tenantName, amount, status: "paid" }.
