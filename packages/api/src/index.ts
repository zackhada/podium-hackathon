import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initWSS } from "./ws";
import propertiesRouter from "./routes/properties";
import maintenanceRouter from "./routes/maintenance";
import paymentsRouter from "./routes/payments";
import tenantsRouter from "./routes/tenants";
import notifyRouter from "./routes/notify";
import vendorsRouter from "./routes/vendors";
import chatRouter from "./routes/chat";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/properties", propertiesRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/payments", paymentsRouter);
app.use("/tenants", tenantsRouter);
app.use("/notify", notifyRouter);
app.use("/vendors", vendorsRouter);
app.use("/chat", chatRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT ?? 4000;
const server = createServer(app);

initWSS(server);

server.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
