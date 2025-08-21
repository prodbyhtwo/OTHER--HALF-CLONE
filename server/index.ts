import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import demoSafeModeRoutes from "./routes/demo-safe-mode";
import userProfileRoutes from "./routes/user-profile";
import userSettingsRoutes from "./routes/user-settings";
import builderApiRoutes from "./routes/builder-api";
import locationApiRoutes from "./routes/location-api";
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
import { env, isSafeMode } from "../src/env/server";
import {
  configureSecurityMiddleware,
  securityErrorHandler,
} from "../src/middleware/security";

export function createServer() {
  // Environment is automatically validated in ../src/env/server.ts
  console.log(
    `🚀 Starting server in ${env.NODE_ENV} mode (SAFE_MODE: ${isSafeMode})`,
  );

  const app = express();

  // Security middleware (must be first)
  configureSecurityMiddleware(app);

  // CORS middleware
  app.use(
    cors({
      origin:
        env.NODE_ENV === "production"
          ? [env.FRONTEND_URL] // Restrict to your domain in production
          : true, // Allow all origins in development
      credentials: true,
    }),
  );

  // Body parsing middleware with security limits
  app.use(
    express.json({
      limit: "1mb",
      verify: (req: any, res, buf) => {
        // Store raw body for webhook verification
        if (req.path.includes("/webhook")) {
          req.rawBody = buf;
        }
      },
    }),
  );
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = env.PING_MESSAGE ?? "ping";
    res.json({
      message: ping,
      safeMode: isSafeMode,
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/demo", handleDemo);

  // SAFE_MODE demo routes
  app.use("/api/demo", demoSafeModeRoutes);

  // Auth routes
  app.use("/api/auth", authRoutes);

  // User profile and settings routes
  app.use("/api", userProfileRoutes);
  app.use("/api", userSettingsRoutes);

  // Builder-specific API routes
  app.use("/api", builderApiRoutes);

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

  // Service status endpoint for diagnostics
  app.get("/api/status", (req, res) => {
    const { getServiceStatus } = require("../src/services/factory");
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      safeMode: isSafeMode,
      services: getServiceStatus(),
      version: process.env.npm_package_version || "unknown",
    });
  });

  // Mock checkout completion endpoint for SAFE_MODE
  if (isSafeMode) {
    app.get("/checkout/mock", (req, res) => {
      const sessionId = req.query.session as string;
      if (!sessionId) {
        return res.status(400).send("Missing session parameter");
      }

      // In a real app, you'd render a success page
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Payment Complete (Mock)</title></head>
        <body style="font-family: system-ui; max-width: 600px; margin: 2rem auto; padding: 2rem;">
          <h1>✅ Payment Successful (Mock)</h1>
          <p>This is a mock payment confirmation page for development.</p>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p>In SAFE_MODE, no real charges are made.</p>
          <a href="${env.FRONTEND_URL}" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">Return to App</a>
        </body>
        </html>
      `);
    });

    // Mock mailbox viewer for development
    app.get("/__mailbox", async (req, res) => {
      try {
        const { MockMailer } = require("../src/services/mailer");
        const mailer = new MockMailer();
        const emails = await mailer.listEmails();

        let html = `
          <!DOCTYPE html>
          <html>
          <head><title>Mock Mailbox</title></head>
          <body style="font-family: system-ui; max-width: 800px; margin: 2rem auto; padding: 2rem;">
            <h1>📧 Mock Mailbox</h1>
            <p>Emails sent in SAFE_MODE are stored here.</p>
        `;

        if (emails.length === 0) {
          html += "<p>No emails found.</p>";
        } else {
          html += "<ul>";
          for (const email of emails) {
            html += `<li><a href="/__mailbox/${email}" target="_blank">${email}</a></li>`;
          }
          html += "</ul>";
        }

        html += "</body></html>";
        res.send(html);
      } catch (error) {
        res.status(500).send("Error reading mailbox");
      }
    });

    app.get("/__mailbox/:filename", async (req, res) => {
      try {
        const { MockMailer } = require("../src/services/mailer");
        const mailer = new MockMailer();
        const content = await mailer.readEmail(req.params.filename);

        if (!content) {
          return res.status(404).send("Email not found");
        }

        res.type("text/plain").send(content);
      } catch (error) {
        res.status(500).send("Error reading email");
      }
    });
  }

  // Start OTP cleanup schedule
  startOTPCleanupSchedule();

  // Security error handler (must be last)
  app.use(securityErrorHandler);

  return app;
}
