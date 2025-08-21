/**
 * Environment Variable Guard
 * Validates required environment variables and fails boot if any are missing
 */

interface RequiredEnvVars {
  production: string[];
  development: string[];
  all: string[];
}

const REQUIRED_ENV_VARS: RequiredEnvVars = {
  production: [
    "STORAGE_BUCKET_NAME",
    "STORAGE_BUCKET_REGION",
    "STORAGE_ACCESS_KEY",
    "STORAGE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "DATABASE_URL",
    "JWT_SECRET",
    "ENCRYPTION_KEY",
    "SESSION_SECRET",
    "GOOGLE_PLACES_API_KEY",
    "GOOGLE_GEOCODING_API_KEY",
    "SENDGRID_API_KEY",
    "RECAPTCHA_SITE_KEY",
    "RECAPTCHA_SECRET_KEY",
    "FRONTEND_URL",
    "PUSH_NOTIFICATION_SERVER_KEY",
    "SENTRY_DSN",
    "ANALYTICS_API_KEY",
  ],
  development: ["DATABASE_URL", "JWT_SECRET"],
  all: ["NODE_ENV"],
};

interface MissingEnvResult {
  isValid: boolean;
  missing: string[];
  environment: string;
}

/**
 * Validates environment variables based on current NODE_ENV
 */
export function validateEnvironmentVariables(): MissingEnvResult {
  const environment = process.env.NODE_ENV || "development";
  const isProduction = environment === "production";
  const isCI = process.env.CI === "true";

  // Determine which variables to check
  let requiredVars = [...REQUIRED_ENV_VARS.all];

  if (isProduction) {
    requiredVars.push(...REQUIRED_ENV_VARS.production);
  } else {
    requiredVars.push(...REQUIRED_ENV_VARS.development);
  }

  // Check for missing variables
  const missing: string[] = [];

  for (const envVar of requiredVars) {
    const value = process.env[envVar];

    if (!value || value.trim() === "" || value === "__PLACEHOLDER__") {
      missing.push(envVar);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    environment,
  };
}

/**
 * Logs missing environment variables with instructions
 */
function logMissingEnvironmentVariables(
  missing: string[],
  environment: string,
): void {
  console.error("🚨 ENVIRONMENT VALIDATION FAILED");
  console.error("=====================================");
  console.error(`Environment: ${environment}`);
  console.error(`Missing required environment variables:\n`);

  missing.forEach((envVar) => {
    console.error(`  ❌ ${envVar}`);
  });

  console.error("\n📋 Instructions:");
  console.error("1. Check ops/REQUIRED_ENV.md for details");
  console.error("2. Set missing environment variables");
  console.error("3. For development, use DevServerControl tool");
  console.error("4. For production, configure in deployment platform");
  console.error("\n💡 Example:");
  console.error('   export DATABASE_URL="postgresql://..."');
  console.error('   export JWT_SECRET="your-secret-key"');
  console.error("\n🔒 Security: Never commit secrets to version control!");
}

/**
 * Environment guard that fails boot if required variables are missing
 * Call this at application startup
 */
export function enforceEnvironmentVariables(): void {
  const result = validateEnvironmentVariables();

  if (!result.isValid) {
    logMissingEnvironmentVariables(result.missing, result.environment);

    // Fail the build/boot process
    if (process.env.CI === "true") {
      console.error("\n💥 Build failed due to missing environment variables");
      process.exit(1);
    } else {
      console.error(
        "\n⚠️  Application may not function correctly without these variables",
      );
      // In development, we might want to continue with warnings
      // but in production, we should fail hard
      if (result.environment === "production") {
        process.exit(1);
      }
    }
  } else {
    console.log("✅ Environment validation passed");
  }
}

/**
 * Type-safe environment variable getter
 */
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(
      `Required environment variable ${name} is missing. ` +
        `Check ops/REQUIRED_ENV.md for setup instructions.`,
    );
  }

  return value;
}

/**
 * Get optional environment variable with default
 */
export function getOptionalEnvVar(
  name: string,
  defaultValue: string = "",
): string {
  return process.env[name] || defaultValue;
}

/**
 * Validate environment variables required for invite-only mode
 */
export function validateInviteOnlyModeRequirements(): MissingEnvResult {
  const requiredForInviteOnly = [
    "SENDGRID_API_KEY",
    "RECAPTCHA_SITE_KEY",
    "RECAPTCHA_SECRET_KEY",
    "FRONTEND_URL",
  ];

  const missing: string[] = [];

  for (const envVar of requiredForInviteOnly) {
    const value = process.env[envVar];

    if (!value || value.trim() === "" || value === "__PLACEHOLDER__") {
      missing.push(envVar);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    environment: process.env.NODE_ENV || "development",
  };
}

/**
 * Check if invite-only mode can be safely enabled
 */
export function canEnableInviteOnlyMode(): boolean {
  const result = validateInviteOnlyModeRequirements();
  return result.isValid;
}

/**
 * Log warning about missing invite-only mode requirements
 */
export function warnAboutInviteOnlyModeRequirements(): void {
  const result = validateInviteOnlyModeRequirements();

  if (!result.isValid) {
    console.warn("⚠️  INVITE-ONLY MODE REQUIREMENTS MISSING");
    console.warn("==========================================");
    console.warn(
      "The following environment variables are required for invite-only mode:\n",
    );

    result.missing.forEach((envVar) => {
      console.warn(`  ❌ ${envVar}`);
    });

    console.warn(
      "\n📖 See ops/REQUIRED_ENV.md for invite-only mode setup instructions",
    );
    console.warn(
      "💡 Invite-only mode will not function properly without these variables",
    );
  }
}

// Export validation result for runtime checks
export const ENV_VALIDATION_RESULT = validateEnvironmentVariables();
