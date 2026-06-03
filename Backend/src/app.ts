import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import diceRoutes from "./routes/dice.routes";
import { limiter, requireJson, notFound, errorHandler } from "./middlewares";

const app = express();

// ─── Sécurité ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(limiter);

// ─── Logging & Parsing ────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" })); // limite la taille du body
app.use(requireJson);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/dice", diceRoutes);

// ─── Erreurs ──────────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;