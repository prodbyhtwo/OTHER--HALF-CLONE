// src/env/client.ts
import { z } from "zod";

const Raw = {
  MODE: import.meta.env.MODE,
  VITE_PUBLIC_BUILDER_KEY: import.meta.env.VITE_PUBLIC_BUILDER_KEY,
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  VITE_SAFE_MODE: import.meta.env.VITE_SAFE_MODE ?? "true",
  VITE_FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL ?? "http://localhost:8080",
  VITE_RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_ANALYTICS_API_KEY: import.meta.env.VITE_ANALYTICS_API_KEY,
} as const;

const Schema = z.object({
  MODE: z.string(),
  VITE_PUBLIC_BUILDER_KEY: z.string().optional(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_SAFE_MODE: z.preprocess(v => String(v).toLowerCase() === "true", z.boolean()),
  VITE_FRONTEND_URL: z.string().url(),
  VITE_RECAPTCHA_SITE_KEY: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_ANALYTICS_API_KEY: z.string().optional(),
});

const parsed = Schema.safeParse(Raw);

if (!parsed.success) {
  console.error("❌ Client environment validation failed:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  
  // In client-side, we can't exit the process, so we'll use fallback values
  console.warn("⚠️  Using fallback client environment configuration");
}

export const envClient = parsed.success ? parsed.data : {
  MODE: Raw.MODE || "development",
  VITE_PUBLIC_BUILDER_KEY: undefined,
  VITE_STRIPE_PUBLISHABLE_KEY: undefined,
  VITE_SAFE_MODE: true,
  VITE_FRONTEND_URL: "http://localhost:8080",
  VITE_RECAPTCHA_SITE_KEY: undefined,
  VITE_SENTRY_DSN: undefined,
  VITE_ANALYTICS_API_KEY: undefined,
};

// Type helpers for conditional logic
export const isProduction = envClient.MODE === "production";
export const isDevelopment = envClient.MODE === "development";
export const isTest = envClient.MODE === "test";
export const isSafeMode = envClient.VITE_SAFE_MODE;

// Service availability helpers for client-side
export const hasBuilderIO = !!envClient.VITE_PUBLIC_BUILDER_KEY;
export const hasStripePublic = !envClient.VITE_SAFE_MODE && !!envClient.VITE_STRIPE_PUBLISHABLE_KEY;
export const hasRecaptcha = !envClient.VITE_SAFE_MODE && !!envClient.VITE_RECAPTCHA_SITE_KEY;
export const hasSentry = !envClient.VITE_SAFE_MODE && !!envClient.VITE_SENTRY_DSN;
export const hasAnalytics = !envClient.VITE_SAFE_MODE && !!envClient.VITE_ANALYTICS_API_KEY;

// Logging for transparency (client-side)
if (isDevelopment) {
  if (isSafeMode) {
    console.log("🛡️  Client SAFE_MODE enabled - using mocks and stubs");
  } else {
    console.log("🚀 Client production mode - using real integrations");
  }
}
