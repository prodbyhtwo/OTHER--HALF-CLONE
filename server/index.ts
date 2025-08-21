import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import stripeRoutes from "./routes/stripe";
import adminRoutes from "./routes/admin";
import auditRoutes from "./routes/audit";
import authRoutes from "./routes/auth";
import matchesRoutes from "./routes/matches";
import {
  getSystemSettings,
  setInviteOnlyMode,
  updateInviteRequirements,
  checkInviteOnlyMode,
} from "./routes/system-settings";
import inviteRoutes from "./routes/invites-router";
import emailOTPRoutes from "./routes/email-otp-router";
import { startOTPCleanupSchedule } from "./routes/email-otp";
import { enforceEnvironmentVariables } from "../src/lib/env-guard";

export function createServer() {
  // Validate environment variables before starting server
  enforceEnvironmentVariables();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "1mb" })); // Limit JSON payload size
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.use("/api/auth", authRoutes);

  // Matches routes
  app.use("/api/matches", matchesRoutes);
  app.use("/api/discovery", matchesRoutes);

  // Stripe routes
  app.use("/api/stripe", stripeRoutes);

  // Admin routes
  app.use("/api/admin", adminRoutes);

  // Audit and analytics routes
  app.use("/api/audit", auditRoutes);
  app.use("/api/analytics", auditRoutes);

  // System settings routes
  app.get("/api/settings", getSystemSettings);
  app.post("/api/settings/invite-only-mode", setInviteOnlyMode);
  app.post("/api/settings/invite-requirements", updateInviteRequirements);
  app.get("/api/settings/invite-only-mode", checkInviteOnlyMode);

  // Invite management routes
  app.use("/api/invites", inviteRoutes);

  // Email OTP routes
  app.use("/api/auth/email", emailOTPRoutes);

  // Start OTP cleanup schedule
  startOTPCleanupSchedule();

  return app;
}
