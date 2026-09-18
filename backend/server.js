import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import publicRoutes from "./routes/publicRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json({ limit: "2mb" }));

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow same-origin / server-to-server calls (no Origin header) too
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
  }),
);

const adminEnabled = process.env.ENABLE_ADMIN === "true";

app.get("/api/health", (req, res) => {
  res.json({ ok: true, mode: adminEnabled ? "admin (local)" : "public" });
});

app.use("/api", publicRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", contactRoutes);

// Admin + upload routes are only ever mounted when this instance is running
// in local admin mode. On a public deployment they don't exist at all —
// not just "locked", genuinely absent from the router.
if (adminEnabled) {
  app.use("/api/admin/upload", uploadRoutes);
  app.use("/api/admin", adminRoutes);
  console.log(
    "[server] ADMIN MODE ENABLED — do not run this configuration on a public host.",
  );
} else {
  console.log("[server] Public mode — read-only API + AI chat only.");
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`[server] listening on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  });
