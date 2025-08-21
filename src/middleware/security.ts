// src/middleware/security.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { env } from "../env/server";
import type { Application, Request, Response, NextFunction } from "express";

// Rate limiting configuration
const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message:
      message || "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });
};

// Slow down middleware for gradual response delay
const createSlowDown = (
  windowMs: number,
  delayAfter: number,
  maxDelayMs: number = 30000,
) => {
  return slowDown({
    windowMs,
    delayAfter,
    maxDelayMs,
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
  });
};

// Main security configuration
export function configureSecurityMiddleware(app: Application): void {
  console.log("🔒 Configuring security middleware...");

  // Trust proxy for proper IP detection (important for rate limiting)
  app.set("trust proxy", true);

  // Helmet for security headers
  app.use(
    helmet({
      // Content Security Policy - customize based on your needs
      contentSecurityPolicy:
        env.NODE_ENV === "production"
          ? {
              directives: {
                defaultSrc: ["'self'"],
                styleSrc: [
                  "'self'",
                  "'unsafe-inline'", // Allow inline styles for rapid development
                  "https://fonts.googleapis.com",
                ],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                scriptSrc: [
                  "'self'",
                  // Add Builder.io domains if using
                  "https://cdn.builder.io",
                  // Add other trusted script sources
                ],
                imgSrc: [
                  "'self'",
                  "data:",
                  "https:",
                  // Add CDN domains
                ],
                connectSrc: [
                  "'self'",
                  // Add API domains
                  "https://api.stripe.com",
                  "https://api.sendgrid.com",
                ],
                frameSrc: [
                  "'self'",
                  // Add iframe sources if needed
                  "https://js.stripe.com",
                ],
                // Allow Builder.io preview mode in development
                ...(env.NODE_ENV === "development" && {
                  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                  styleSrc: ["'self'", "'unsafe-inline'"],
                }),
              },
            }
          : false, // Disable CSP in development for easier debugging

      // Referrer Policy
      referrerPolicy: {
        policy: ["no-referrer", "strict-origin-when-cross-origin"],
      },

      // HTTP Strict Transport Security (HSTS)
      hsts:
        env.NODE_ENV === "production"
          ? {
              maxAge: 31536000, // 1 year
              includeSubDomains: true,
              preload: true,
            }
          : false,

      // X-Frame-Options
      frameguard: { action: "deny" },

      // X-Content-Type-Options
      noSniff: true,

      // X-XSS-Protection
      xssFilter: true,

      // Hide X-Powered-By header
      hidePoweredBy: true,
    }),
  );

  // General API rate limiting
  app.use(
    "/api/",
    createRateLimiter(
      15 * 60 * 1000, // 15 minutes
      120, // Limit each IP to 120 requests per windowMs
      "Too many API requests from this IP, please try again later.",
    ),
  );

  // Strict rate limiting for authentication endpoints
  app.use(
    "/api/auth/",
    createRateLimiter(
      15 * 60 * 1000, // 15 minutes
      10, // Limit each IP to 10 auth requests per windowMs
      "Too many authentication attempts from this IP, please try again later.",
    ),
  );

  // Extra strict rate limiting for password reset
  app.use(
    "/api/auth/reset-password",
    createRateLimiter(
      60 * 60 * 1000, // 1 hour
      3, // Limit each IP to 3 password reset requests per hour
      "Too many password reset attempts from this IP, please try again later.",
    ),
  );

  // Rate limiting for invite creation (admin only but still protect)
  app.use(
    "/api/invites",
    createRateLimiter(
      60 * 60 * 1000, // 1 hour
      50, // Limit each IP to 50 invite operations per hour
      "Too many invite operations from this IP, please try again later.",
    ),
  );

  // Stripe webhook endpoints (more lenient but still protected)
  app.use(
    "/api/stripe/webhook",
    createRateLimiter(
      60 * 1000, // 1 minute
      100, // Allow up to 100 webhook calls per minute
      "Webhook rate limit exceeded.",
    ),
  );

  // Slow down middleware for additional protection
  app.use(
    "/api/auth/",
    createSlowDown(
      15 * 60 * 1000, // 15 minutes
      5, // Start slowing down after 5 requests
      10000, // Max delay of 10 seconds
    ),
  );

  // Custom middleware for additional security checks
  app.use("/api/", securityHeadersMiddleware);
  app.use("/api/", requestValidationMiddleware);

  console.log("✅ Security middleware configured");
}

// Additional security headers middleware
function securityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // XSS Protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Disable DNS prefetching
  res.setHeader("X-DNS-Prefetch-Control", "off");

  // Disable download of potentially harmful content
  res.setHeader("X-Download-Options", "noopen");

  // Prevent MIME type confusion attacks
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

  next();
}

// Request validation middleware
function requestValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Validate Content-Type for POST/PUT/PATCH requests
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.get("Content-Type");

    if (!contentType) {
      return res.status(400).json({
        error: "Content-Type header is required",
      });
    }

    // Allow JSON and form data
    const allowedTypes = [
      "application/json",
      "application/x-www-form-urlencoded",
      "multipart/form-data",
    ];

    const isAllowed = allowedTypes.some((type) => contentType.startsWith(type));

    if (!isAllowed) {
      return res.status(415).json({
        error: "Unsupported Media Type",
      });
    }
  }

  // Validate request size (additional check)
  const contentLength = req.get("Content-Length");
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    // 10MB limit
    return res.status(413).json({
      error: "Request entity too large",
    });
  }

  next();
}

// Security audit logging
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  req?: Request,
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req?.ip,
    userAgent: req?.get("User-Agent"),
    path: req?.path,
    method: req?.method,
    safeMode: env.SAFE_MODE,
  };

  // In production, you'd send this to your logging service
  console.log("🔒 Security Event:", JSON.stringify(logEntry));

  // In SAFE_MODE, also write to local file for debugging
  if (env.SAFE_MODE) {
    // Could write to .security-logs/ directory
  }
}

// Middleware to log authentication events
export function logAuthEvent(event: string, userId?: string, email?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    logSecurityEvent(
      `auth_${event}`,
      {
        userId,
        email,
        success: res.statusCode < 400,
      },
      req,
    );
    next();
  };
}

// Middleware to log payment events
export function logPaymentEvent(event: string, metadata?: Record<string, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    logSecurityEvent(
      `payment_${event}`,
      {
        ...metadata,
        success: res.statusCode < 400,
      },
      req,
    );
    next();
  };
}

// Error handler for security-related errors
export function securityErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Log security-related errors
  if (err.type === "security" || err.code === "EBADCSRFTOKEN") {
    logSecurityEvent(
      "security_error",
      {
        error: err.message,
        code: err.code,
        type: err.type,
      },
      req,
    );
  }

  next(err);
}
