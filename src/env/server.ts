// src/env/server.ts
import { z } from "zod";

const Raw = {
  NODE_ENV: process.env.NODE_ENV,
  SAFE_MODE: process.env.SAFE_MODE ?? "true",
  PORT: process.env.PORT ?? "8080",

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Authentication & Security
  JWT_SECRET: process.env.JWT_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  SESSION_SECRET: process.env.SESSION_SECRET,

  // External services
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PLUS_MONTHLY_PRICE_ID: process.env.STRIPE_PLUS_MONTHLY_PRICE_ID,
  STRIPE_PLUS_YEARLY_PRICE_ID: process.env.STRIPE_PLUS_YEARLY_PRICE_ID,
  STRIPE_PRO_MONTHLY_PRICE_ID: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  STRIPE_PRO_YEARLY_PRICE_ID: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  STRIPE_PREMIUM_MONTHLY_PRICE_ID: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  STRIPE_PREMIUM_YEARLY_PRICE_ID: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,

  // Email & Communication
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME,

  // External APIs
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
  GOOGLE_GEOCODING_API_KEY: process.env.GOOGLE_GEOCODING_API_KEY,
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,

  // Storage
  STORAGE_BUCKET_NAME: process.env.STORAGE_BUCKET_NAME,
  STORAGE_BUCKET_REGION: process.env.STORAGE_BUCKET_REGION,
  STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY,
  STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY,

  // Monitoring & Analytics
  SENTRY_DSN: process.env.SENTRY_DSN,
  ANALYTICS_API_KEY: process.env.ANALYTICS_API_KEY,
  PUSH_NOTIFICATION_SERVER_KEY: process.env.PUSH_NOTIFICATION_SERVER_KEY,

  // URLs & Config
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:8080",
  PING_MESSAGE: process.env.PING_MESSAGE,

  // CI/CD
  CI: process.env.CI,
  LOG_LEVEL: process.env.LOG_LEVEL,
} as const;

const Schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SAFE_MODE: z.preprocess(v => String(v).toLowerCase() === "true", z.boolean()),
  PORT: z.string().regex(/^\d+$/).transform(Number),

  // Database
  DATABASE_URL: z.string().optional(),

  // Authentication & Security
  JWT_SECRET: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  SESSION_SECRET: z.string().optional(),

  // External services
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PLUS_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_PLUS_YEARLY_PRICE_ID: z.string().optional(),
  STRIPE_PRO_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_PRO_YEARLY_PRICE_ID: z.string().optional(),
  STRIPE_PREMIUM_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_PREMIUM_YEARLY_PRICE_ID: z.string().optional(),

  // Email & Communication
  SENDGRID_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  FROM_NAME: z.string().optional(),

  // External APIs
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_GEOCODING_API_KEY: z.string().optional(),
  RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),

  // Storage
  STORAGE_BUCKET_NAME: z.string().optional(),
  STORAGE_BUCKET_REGION: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),

  // Monitoring & Analytics
  SENTRY_DSN: z.string().optional(),
  ANALYTICS_API_KEY: z.string().optional(),
  PUSH_NOTIFICATION_SERVER_KEY: z.string().optional(),

  // URLs & Config
  FRONTEND_URL: z.string().url(),
  PING_MESSAGE: z.string().optional(),

  // CI/CD
  CI: z.string().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
});

// Helper to check if we have required secrets for production mode
function hasRequiredSecrets(data: any): boolean {
  const requiredForProduction = [
    'DATABASE_URL',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'SENDGRID_API_KEY',
    'FROM_EMAIL'
  ];
  
  return requiredForProduction.every(key => data[key] && data[key].trim() !== '');
}

// Parse and validate
const parsed = Schema.safeParse(Raw);

if (!parsed.success) {
  const wantedReal = String(Raw.SAFE_MODE).toLowerCase() === "false";
  
  if (wantedReal) {
    console.error("❌ Environment validation failed:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
  }
  
  // In SAFE_MODE, provide reasonable defaults
  console.log("⚠️  Environment validation failed, falling back to SAFE_MODE");
}

// Determine final configuration
let finalData: z.infer<typeof Schema>;

if (parsed.success) {
  finalData = parsed.data;
  
  // Auto-enable SAFE_MODE if critical secrets are missing
  if (!finalData.SAFE_MODE && !hasRequiredSecrets(finalData)) {
    console.log("🔒 Missing critical secrets, auto-enabling SAFE_MODE");
    finalData.SAFE_MODE = true;
  }
} else {
  // SAFE_MODE fallback with defaults
  finalData = {
    NODE_ENV: Raw.NODE_ENV as any || "development",
    SAFE_MODE: true,
    PORT: 8080,
    FRONTEND_URL: Raw.FRONTEND_URL ?? "http://localhost:8080",
    DATABASE_URL: undefined,
    JWT_SECRET: undefined,
    ENCRYPTION_KEY: undefined,
    SESSION_SECRET: undefined,
    STRIPE_SECRET_KEY: undefined,
    STRIPE_WEBHOOK_SECRET: undefined,
    STRIPE_PLUS_MONTHLY_PRICE_ID: undefined,
    STRIPE_PLUS_YEARLY_PRICE_ID: undefined,
    STRIPE_PRO_MONTHLY_PRICE_ID: undefined,
    STRIPE_PRO_YEARLY_PRICE_ID: undefined,
    STRIPE_PREMIUM_MONTHLY_PRICE_ID: undefined,
    STRIPE_PREMIUM_YEARLY_PRICE_ID: undefined,
    SENDGRID_API_KEY: undefined,
    FROM_EMAIL: undefined,
    FROM_NAME: undefined,
    GOOGLE_PLACES_API_KEY: undefined,
    GOOGLE_GEOCODING_API_KEY: undefined,
    RECAPTCHA_SITE_KEY: undefined,
    RECAPTCHA_SECRET_KEY: undefined,
    STORAGE_BUCKET_NAME: undefined,
    STORAGE_BUCKET_REGION: undefined,
    STORAGE_ACCESS_KEY: undefined,
    STORAGE_SECRET_KEY: undefined,
    SENTRY_DSN: undefined,
    ANALYTICS_API_KEY: undefined,
    PUSH_NOTIFICATION_SERVER_KEY: undefined,
    PING_MESSAGE: undefined,
    CI: undefined,
    LOG_LEVEL: undefined,
  };
}

// Generate ephemeral dev secrets in SAFE_MODE for security testing
if (finalData.SAFE_MODE) {
  if (!finalData.JWT_SECRET) {
    finalData.JWT_SECRET = `dev-jwt-${Date.now()}-${Math.random().toString(36)}`;
  }
  if (!finalData.SESSION_SECRET) {
    finalData.SESSION_SECRET = `dev-session-${Date.now()}-${Math.random().toString(36)}`;
  }
  if (!finalData.DATABASE_URL) {
    finalData.DATABASE_URL = "postgresql://dev:dev@localhost:5432/devdb";
  }
  if (!finalData.FROM_EMAIL) {
    finalData.FROM_EMAIL = "dev@localhost";
  }
  if (!finalData.FROM_NAME) {
    finalData.FROM_NAME = "Development App";
  }
}

export const env = finalData;

// Logging for transparency
if (env.SAFE_MODE) {
  console.log("🛡️  SAFE_MODE enabled - using mocks and development secrets");
} else {
  console.log("🚀 Production mode - using real integrations");
}

// Type helpers for conditional logic
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";
export const isSafeMode = env.SAFE_MODE;
export const isCI = env.CI === "true";

// Service availability helpers
export const hasStripe = !env.SAFE_MODE && !!env.STRIPE_SECRET_KEY;
export const hasEmail = !env.SAFE_MODE && !!env.SENDGRID_API_KEY;
export const hasStorage = !env.SAFE_MODE && !!env.STORAGE_BUCKET_NAME && !!env.STORAGE_ACCESS_KEY;
export const hasDatabase = !!env.DATABASE_URL;
export const hasAuth = !!env.JWT_SECRET;
