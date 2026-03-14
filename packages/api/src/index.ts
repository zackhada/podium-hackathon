// Entry point for the Express API server.
// TODO: Initialize Express app, register routes, start HTTP + WebSocket server.

import express from "express";
import cors from "cors";
import { createServer } from "http";
// import { WebSocketServer } from "ws";
// import propertiesRouter from "./routes/properties";
// import maintenanceRouter from "./routes/maintenance";
// import paymentsRouter from "./routes/payments";
// import tenantsRouter from "./routes/tenants";
// import notifyRouter from "./routes/notify";
// import vendorsRouter from "./routes/vendors";

const app = express();
app.use(cors());
app.use(express.json());

// TODO: Register routers
// app.use("/properties", propertiesRouter);
// app.use("/maintenance", maintenanceRouter);
// app.use("/payments", paymentsRouter);
// app.use("/tenants", tenantsRouter);
// app.use("/notify", notifyRouter);
// app.use("/vendors", vendorsRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT ?? 3001;
const server = createServer(app);

// TODO: Attach WebSocket server for live dashboard feed
// const wss = new WebSocketServer({ server });
// wss.on("connection", (ws) => { ... });

server.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
