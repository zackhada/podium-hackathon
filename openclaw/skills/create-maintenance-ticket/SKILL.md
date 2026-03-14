---
name: create-maintenance-ticket
description: Create a maintenance ticket when a tenant or owner reports something broken or needing repair.
version: 1.0.0
author: podium-team
---

# Create Maintenance Ticket

Trigger this skill when the message contains words like: broken, leak, not working, stuck, noise, smell, flooding, damage, fix, repair, HVAC, toilet, pipe, outlet, door.

## Instructions

1. Extract the unit number (e.g. "4B") and a concise description of the issue from the message.
2. Use **list-properties** to look up the unit by its number and find the unitId.
3. Use **create-ticket** to create a maintenance ticket with the unitId and description.
4. After the ticket is created, chain to the **assign-vendor** skill with the new ticket ID and description.
5. Then chain to the **notify-tenant** skill to inform the tenant of the scheduled repair.

## Output

Return the created ticket (id, status, unit) so downstream skills can use the ticket ID.
