import { RequestHandler } from 'express';
import { inviteDB, generate6DigitCode, hashIP, maskEmail } from '../lib/invite-db';
import { consumeInvite } from './invites';
import { emailService, EMAIL_RATE_LIMITS, isRateLimited, validateEmailAddress, sanitizeEmail, isDisposableEmail } from '../lib/email-service';
import { z } from 'zod';

// Validation schemas
const RequestEmailCodeSchema = z.object({
  email: z.string().email(),
  invite_code: z.string().optional()
});

const VerifyEmailCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^[0-9]{6}$/),
  invite_code: z.string().optional()
});

// Request email OTP code
export const requestEmailCode: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const result = RequestEmailCodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    let { email, invite_code } = result.data;
    email = sanitizeEmail(email);

    // Validate email format
    if (!validateEmailAddress(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Check for disposable email addresses
    if (isDisposableEmail(email)) {
      return res.status(400).json({ error: 'Disposable email addresses are not allowed' });
    }

    // Get system settings
    const settings = await inviteDB.getSystemSettings();

    // If invite-only mode is enabled, validate invite code
    if (settings.invite_only_mode) {
      if (settings.invite_requirements.must_supply_invite_key && !invite_code) {
        return res.status(400).json({ error: 'Invite code required during invite-only mode' });
      }

      if (invite_code) {
        // Validate the invite code without consuming it
        const inviteValidation = await fetch(`${req.protocol}://${req.get('host')}/api/invites/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: invite_code, email })
        });

        const validationResult = await inviteValidation.json();
        if (!validationResult.valid) {
          return res.status(400).json({ error: validationResult.reason || 'Invalid invite code' });
        }
      } else if (settings.invite_requirements.email_domain_whitelist.length > 0) {
        // Check domain whitelist if no invite code provided
        const domain = email.split('@')[1];
        if (!settings.invite_requirements.email_domain_whitelist.includes(domain)) {
          return res.status(400).json({ error: 'Email domain not allowed' });
        }
      }
    }

    // Get client IP for rate limiting
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const ipHash = hashIP(clientIP);

    // Check rate limits
    const emailAttempts = await inviteDB.getOTPAttemptsInWindow(email, EMAIL_RATE_LIMITS.perEmail.windowMinutes);
    const ipAttempts = await inviteDB.getOTPAttemptsByIP(ipHash, EMAIL_RATE_LIMITS.perIP.windowMinutes);

    if (isRateLimited(emailAttempts, EMAIL_RATE_LIMITS.perEmail)) {
      return res.status(429).json({ 
        error: 'Too many attempts for this email. Please try again later.',
        retry_after: EMAIL_RATE_LIMITS.perEmail.windowMinutes * 60
      });
    }

    if (isRateLimited(ipAttempts, EMAIL_RATE_LIMITS.perIP)) {
      return res.status(429).json({ 
        error: 'Too many attempts from this location. Please try again later.',
        retry_after: EMAIL_RATE_LIMITS.perIP.windowMinutes * 60
      });
    }

    // TODO: Add reCAPTCHA verification here
    // await guardReCaptcha(req, 'signup');

    // Generate 6-digit code
    const code = generate6DigitCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await inviteDB.createEmailOTP({
      email,
      code,
      sent_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      consumed: false,
      ip_hash: ipHash,
      attempts: 0,
      invite_code: invite_code || null
    });

    // Send email
    await emailService.sendEmailCode({ 
      email, 
      code,
      inviteCode: invite_code 
    });

    // Log action (mask email for privacy)
    console.log('Email OTP requested', {
      event_type: 'auth.email.request_code',
      email_masked: maskEmail(email),
      has_invite_code: !!invite_code,
      ip_hash: ipHash,
      timestamp: now.toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Verification code sent to your email',
      expires_in: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Error requesting email code:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

// Verify email OTP code
export const verifyEmailCode: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const result = VerifyEmailCodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    let { email, code, invite_code } = result.data;
    email = sanitizeEmail(email);

    // Get the latest OTP for this email
    const otp = await inviteDB.getLatestEmailOTP(email);
    if (!otp) {
      return res.status(400).json({ error: 'No verification code found for this email' });
    }

    // Check if already consumed
    if (otp.consumed) {
      return res.status(400).json({ error: 'This verification code has already been used' });
    }

    // Check expiration
    if (new Date() > new Date(otp.expires_at)) {
      return res.status(400).json({ error: 'This verification code has expired. Please request a new one.' });
    }

    // Check attempt limit (max 5 attempts per OTP)
    if (otp.attempts >= 5) {
      return res.status(400).json({ error: 'Too many verification attempts. Please request a new code.' });
    }

    // Increment attempt count
    await inviteDB.updateEmailOTP(otp.id, { attempts: otp.attempts + 1 });

    // Verify the code
    if (otp.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Verify invite code matches if provided
    if (invite_code && otp.invite_code !== invite_code) {
      return res.status(400).json({ error: 'Invite code mismatch' });
    }

    // Mark OTP as consumed
    await inviteDB.updateEmailOTP(otp.id, { 
      consumed: true, 
      consumed_at: new Date().toISOString() 
    });

    // TODO: Implement user creation/login logic
    // For now, we'll return a placeholder response
    let user = null; // await User.findByEmail(email);
    
    if (!user) {
      // Create new user
      const settings = await inviteDB.getSystemSettings();
      
      // If invite-only mode and we have an invite code, consume it
      if (settings.invite_only_mode && (invite_code || otp.invite_code)) {
        const inviteResult = await consumeInvite(invite_code || otp.invite_code!, email);
        if (!inviteResult.success) {
          return res.status(400).json({ error: inviteResult.reason });
        }
      }

      // TODO: Create user in database
      user = {
        id: `user_${Date.now()}`,
        email,
        signup_method: 'email_code',
        invited_by_invite_code: invite_code || otp.invite_code || null,
        verification_status: 'pending',
        onboarding_complete: false,
        role: 'user',
        created_at: new Date().toISOString()
      };

      console.log('New user created via email code', {
        event_type: 'auth.user.created',
        user_id: user.id,
        signup_method: 'email_code',
        has_invite_code: !!(invite_code || otp.invite_code),
        email_masked: maskEmail(email),
        timestamp: new Date().toISOString()
      });
    }

    // TODO: Create authentication session
    const session = {
      id: `session_${Date.now()}`,
      user_id: user.id,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    console.log('Email OTP verified successfully', {
      event_type: 'auth.email.verify_code',
      user_id: user.id,
      email_masked: maskEmail(email),
      is_new_user: !user.created_at,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        verification_status: user.verification_status,
        onboarding_complete: user.onboarding_complete
      },
      session: {
        token: session.id, // In production, use proper JWT
        expires_at: session.expires_at
      }
    });
  } catch (error) {
    console.error('Error verifying email code:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
};

// Resend email OTP code
export const resendEmailCode: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !validateEmailAddress(email)) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Get the latest OTP to check if one was recently sent
    const latestOTP = await inviteDB.getLatestEmailOTP(sanitizedEmail);
    if (latestOTP) {
      const timeSinceLastSent = Date.now() - new Date(latestOTP.sent_at).getTime();
      const minInterval = 60 * 1000; // 1 minute minimum between sends
      
      if (timeSinceLastSent < minInterval) {
        const waitTime = Math.ceil((minInterval - timeSinceLastSent) / 1000);
        return res.status(429).json({ 
          error: `Please wait ${waitTime} seconds before requesting a new code`
        });
      }
    }

    // Reuse the requestEmailCode logic
    req.body = { email: sanitizedEmail, invite_code: latestOTP?.invite_code };
    return requestEmailCode(req, res);
  } catch (error) {
    console.error('Error resending email code:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
};

// Cleanup expired OTPs (internal maintenance)
export const cleanupExpiredOTPs = async (): Promise<number> => {
  try {
    const cleaned = await inviteDB.cleanupExpiredOTPs();
    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired OTP records`);
    }
    return cleaned;
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
    return 0;
  }
};

// Start cleanup interval (call this when server starts)
export const startOTPCleanupSchedule = () => {
  // Clean up expired OTPs every 15 minutes
  setInterval(cleanupExpiredOTPs, 15 * 60 * 1000);
  console.log('OTP cleanup schedule started');
};
