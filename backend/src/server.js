import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import navigateRouter from "./routes/navigate.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:8000";

app.use(
  cors({
    origin: frontendOrigin,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "mentorcliq-nav-assistant" });
});

app.use("/api/navigate", navigateRouter);

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: "Something went wrong while processing the request.",
  });
});

app.listen(port, () => {
  console.log(`Mentorcliq navigation backend running on http://localhost:${port}`);
});
