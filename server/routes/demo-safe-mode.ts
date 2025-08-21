// server/routes/demo-safe-mode.ts
import { Router, Request, Response } from "express";
import { createServices } from "../../src/services";
import { logSecurityEvent } from "../../src/middleware/security";

const router = Router();

// Demo email endpoint
router.post("/email", async (req: Request, res: Response) => {
  try {
    const { to, subject, html, text } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: to, subject, html"
      });
    }

    const { mailer } = createServices();
    
    const result = await mailer.send({
      to,
      subject,
      html,
      text,
    });

    logSecurityEvent("demo_email_sent", {
      to,
      subject,
      success: result.success,
    }, req);

    res.json({
      success: result.success,
      message: result.success 
        ? "Email sent successfully (check /__mailbox in SAFE_MODE)" 
        : "Failed to send email",
      messageId: result.messageId,
      error: result.error,
    });
  } catch (error: any) {
    console.error("Demo email error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
});

// Demo payment endpoint
router.post("/payment", async (req: Request, res: Response) => {
  try {
    const { priceId, userEmail, userId } = req.body;
    
    if (!priceId || !userEmail || !userId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: priceId, userEmail, userId"
      });
    }

    const { payments } = createServices();
    
    const session = await payments.createCheckoutSession({
      priceId,
      userId,
      userEmail,
      successUrl: `${req.get('origin') || 'http://localhost:8080'}/checkout/success`,
      cancelUrl: `${req.get('origin') || 'http://localhost:8080'}/checkout/cancel`,
      metadata: {
        demo: "true",
        timestamp: new Date().toISOString(),
      },
    });

    logSecurityEvent("demo_payment_created", {
      priceId,
      userId,
      sessionId: session.id,
    }, req);

    res.json({
      success: true,
      message: "Checkout session created successfully",
      sessionId: session.id,
      checkoutUrl: session.url,
      status: session.status,
    });
  } catch (error: any) {
    console.error("Demo payment error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
});

// Demo analytics endpoint
router.post("/analytics", async (req: Request, res: Response) => {
  try {
    const { event, userId, properties } = req.body;
    
    if (!event) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: event"
      });
    }

    const { analytics } = createServices();
    
    await analytics.track({
      name: event,
      userId,
      properties: {
        ...properties,
        demo: true,
        source: "safe_mode_demo",
      },
    });

    logSecurityEvent("demo_analytics_tracked", {
      event,
      userId,
    }, req);

    res.json({
      success: true,
      message: "Analytics event tracked successfully",
      event,
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Demo analytics error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
});

// Demo push notification endpoint
router.post("/notification", async (req: Request, res: Response) => {
  try {
    const { to, title, body, data } = req.body;
    
    if (!to || !title || !body) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: to, title, body"
      });
    }

    const { pushNotifications } = createServices();
    
    const result = await pushNotifications.send({
      to,
      title,
      body,
      data: {
        ...data,
        demo: true,
        source: "safe_mode_demo",
      },
    });

    logSecurityEvent("demo_notification_sent", {
      to,
      title,
      success: result.success,
    }, req);

    res.json({
      success: result.success,
      message: result.success 
        ? "Push notification sent successfully" 
        : "Failed to send notification",
      messageId: result.messageId,
      error: result.error,
    });
  } catch (error: any) {
    console.error("Demo notification error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
});

// Demo storage endpoint
router.post("/storage", async (req: Request, res: Response) => {
  try {
    const { filename, content, contentType = "text/plain" } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: filename, content"
      });
    }

    const { storage } = createServices();
    
    const buffer = Buffer.from(content, 'utf-8');
    const key = `demo/${Date.now()}-${filename}`;
    
    const result = await storage.upload(buffer, key, contentType);

    logSecurityEvent("demo_storage_upload", {
      filename,
      key,
      success: result.success,
    }, req);

    res.json({
      success: result.success,
      message: result.success 
        ? "File uploaded successfully" 
        : "Failed to upload file",
      file: result.file,
      error: result.error,
    });
  } catch (error: any) {
    console.error("Demo storage error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
});

// Get demo service statistics
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const { getServiceStatus } = require("../../src/services/factory");
    const status = getServiceStatus();

    // In a real implementation, you'd gather actual statistics
    const stats = {
      serviceStatus: status,
      mockData: {
        emailsSent: Math.floor(Math.random() * 100),
        paymentsProcessed: Math.floor(Math.random() * 50),
        analyticsEvents: Math.floor(Math.random() * 1000),
        notificationsSent: Math.floor(Math.random() * 200),
        filesStored: Math.floor(Math.random() * 75),
      },
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Demo stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
});

export default router;
