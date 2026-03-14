---
name: get-rent-summary
description: Summarize rent payment status for the current month — who has paid, who hasn't, and totals.
version: 1.0.0
author: podium-team
---

# Get Rent Summary

Trigger when the owner asks about rent status, unpaid rent, overdue payments, or monthly payment summary.

## Instructions

1. Use **list-payments** to fetch all payments.
2. Group payments by status: paid, pending, overdue.
3. Return names, amounts, and totals for each group.

## Output

Example: "3 tenants have not paid: John Smith ($2,000 pending), Lisa Park ($1,800 pending), Tom Wu ($2,000 overdue). Total outstanding: $5,800."
