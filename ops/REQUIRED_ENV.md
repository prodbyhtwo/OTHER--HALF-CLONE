# Required Environment Variables

This document lists all environment variables required for the application to function properly.

## Production Keys (Required)

### Storage & File Upload
- `STORAGE_BUCKET_NAME` - Primary storage bucket for user uploads
- `STORAGE_BUCKET_REGION` - AWS S3 or equivalent region
- `STORAGE_ACCESS_KEY` - Access key for storage service
- `STORAGE_SECRET_KEY` - Secret key for storage service

### Stripe Payments
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key for frontend
- `STRIPE_SECRET_KEY` - Stripe secret key for backend
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint secret for verification

### Database
- `DATABASE_URL` - Primary database connection string
- `DATABASE_READ_REPLICA_URL` - Read replica for scaling (optional)

### Authentication & Security
- `JWT_SECRET` - Secret for JWT token signing
- `ENCRYPTION_KEY` - Key for encrypting sensitive data
- `SESSION_SECRET` - Session cookie signing secret

### External APIs
- `GOOGLE_PLACES_API_KEY` - For church location services
- `GOOGLE_GEOCODING_API_KEY` - For address resolution
- `SENDGRID_API_KEY` - Email service provider
- `PUSH_NOTIFICATION_SERVER_KEY` - For push notifications

### Monitoring & Observability
- `SENTRY_DSN` - Error tracking and monitoring
- `ANALYTICS_API_KEY` - User analytics service

## Development Override
- `NODE_ENV` - Environment mode (development/staging/production)
- `LOG_LEVEL` - Logging verbosity (debug/info/warn/error)
- `CI` - Set to "true" in CI/CD environments

## Validation

The application will fail to start if any required production environment variables are missing. Check `src/lib/env-guard.ts` for runtime validation.

## Setup Instructions

1. Copy `.env.example` to `.env.local`
2. Fill in all required values
3. For production, set environment variables in your deployment platform
4. Use `DevServerControl` tool to set sensitive variables during development

## Security Notes

- Never commit actual secrets to version control
- Use secure credential management in production
- Rotate keys regularly
- Monitor for exposed credentials in logs
