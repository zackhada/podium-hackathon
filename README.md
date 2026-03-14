# PropBot — AI Property Management Demo

A demo AI property management system where **PropBot** (an OpenClaw agent) autonomously manages rental properties — creating maintenance tickets, collecting rent, and notifying tenants — while a live dashboard shows every action in real-time.

```
[Chat with PropBot]
      │
      ▼
OpenClaw (PropBot agent)
      │  REST calls
      ▼
Local API  (Express + Prisma + PostgreSQL)  :4000
      │
      ├── WebSocket broadcasts every action
      ▼
Dashboard (Next.js)  :3000  ← live feed updates automatically
```

---

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** running locally (or via Docker)
- **ngrok** account (free) if you want PropBot on a remote VPS to reach your local API

---

## 1. Clone & install

```bash
git clone <repo-url>
cd podium-hackathon
npm install
```

---

## 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL
DATABASE_URL=postgresql://podium:podium@localhost:5432/podium

# Stripe (test mode) — optional, payments fall back to simulation if missing
STRIPE_SECRET_KEY=sk_test_REPLACE_ME

# Anthropic — required for PropBot to use Claude
ANTHROPIC_API_KEY=sk-ant-REPLACE_ME

# API server port
PORT=4000

# OpenClaw — set to your VPS address when running PropBot remotely
OPENCLAW_URL=http://localhost:18789

# Dashboard env vars (used by Next.js browser client)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_OPENCLAW_URL=http://localhost:18789
```

The dashboard reads `NEXT_PUBLIC_*` variables at build time. Create a separate file for it:

```bash
cp .env.example packages/dashboard/.env.local
```

---

## 3. Database setup

Make sure PostgreSQL is running, then push the schema and seed:

```bash
# Push schema to the database (creates all tables)
cd packages/api
npx prisma db push

# Go back to root and seed with sample data
cd ../..
npm run seed
```

The seed creates:
- 3 properties, 12 units
- 10 tenants with leases
- 12 rent payments (mix of paid / pending / overdue)
- 3 vendors (plumbing, electrical, general)
- 12 maintenance tickets across all properties

---

## 4. Run the app

Open two terminals:

```bash
# Terminal 1 — API (localhost:4000)
npm run dev:api

# Terminal 2 — Dashboard (localhost:3000)
npm run dev:dashboard
```

Open `http://localhost:3000` in your browser.

---

## 5. Expose the API with ngrok (for PropBot on a VPS)

PropBot needs a public URL to call your local API.

```bash
# Install ngrok: https://ngrok.com/download
# Then claim your free static domain at dashboard.ngrok.com → Domains

npm run ngrok
# or: ngrok http --domain=your-domain.ngrok-free.app 4000
```

Copy the public URL (e.g. `https://your-domain.ngrok-free.app`).

---

## 6. Run PropBot (OpenClaw)

On your VPS (or locally), start OpenClaw with your ngrok URL and Anthropic key:

```bash
API_BASE_URL=https://your-domain.ngrok-free.app \
ANTHROPIC_API_KEY=sk-ant-... \
openclaw start --config openclaw/openclaw.json
```

PropBot's chat UI will be available at `http://<vps-ip>:18789`.

Update your `.env` (and `packages/dashboard/.env.local`) to point to PropBot:

```env
NEXT_PUBLIC_OPENCLAW_URL=http://<vps-ip>:18789
OPENCLAW_URL=http://<vps-ip>:18789
```

---

## 7. Demo flow

1. Open the dashboard at `http://localhost:3000`
2. Chat with PropBot: *"There's a leaky faucet in unit 2A"*
3. Watch PropBot:
   - Call `GET /properties` to find the unit
   - Call `POST /maintenance` to create a ticket and auto-assign a plumber
   - Call `POST /notify` to SMS the tenant
4. **Operations tab** updates live as tickets are created
5. **Finances tab** shows real rent payment totals
6. **Recent Activity** on the overview page shows each agent action as it happens

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev:api` | Start API in watch mode on `:4000` |
| `npm run dev:dashboard` | Start Next.js dashboard on `:3000` |
| `npm run seed` | Seed the database with sample data |
| `npm run migrate` | Run Prisma migrations |
| `npm run ngrok` | Start ngrok tunnel to `:4000` |

---

## Docker (optional)

A `docker-compose.yml` is included that runs PostgreSQL, the API, the dashboard, and OpenClaw together.

```bash
# Copy and fill in your secrets
cp .env.example .env

docker compose up --build
```

> **Note:** Update `API_BASE_URL` in `docker-compose.yml` to your ngrok URL if OpenClaw needs to be reachable from outside Docker.

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/properties` | All properties with units and tenants |
| `GET` | `/tenants` | All tenants with lease and payment info |
| `GET` | `/vendors` | Vendors, filterable by `?trade=plumbing` |
| `GET` | `/maintenance` | All maintenance tickets |
| `POST` | `/maintenance` | Create ticket — auto-assigns vendor by trade |
| `PATCH` | `/maintenance/:id` | Update ticket status / vendor / schedule |
| `GET` | `/payments` | All rent payments |
| `POST` | `/payments/collect/:tenantId` | Collect rent via Stripe test charge |
| `POST` | `/notify` | Send SMS notification to tenant (simulated) |
| `POST` | `/chat` | Proxy message to PropBot, fallback to mock |
| `GET` | `/health` | Health check |

WebSocket: `ws://localhost:4000/ws` — streams every agent action as a JSON event to the dashboard.

---

## Viewing the database

```bash
cd packages/api && npx prisma studio
```

Opens a table browser at `http://localhost:5555`.
