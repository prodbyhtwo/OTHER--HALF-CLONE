/**
 * Email service for sending OTP codes via SendGrid
 */

interface SendEmailCodeParams {
  email: string;
  code: string;
  inviteCode?: string;
}

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

// Email templates
const OTP_EMAIL_TEMPLATE = (code: string, inviteCode?: string): EmailTemplate => ({
  subject: 'Your OTHER HALF verification code',
  htmlContent: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTHER HALF verification code</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #9610FF 0%, #AB40FF 100%); padding: 40px 20px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; }
        .content { padding: 40px 20px; text-align: center; }
        .code { font-size: 36px; font-weight: bold; color: #9610FF; letter-spacing: 8px; margin: 20px 0; padding: 20px; background-color: #f8f4ff; border-radius: 12px; border: 2px dashed #9610FF; }
        .text { color: #333; line-height: 1.6; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .support-link { color: #9610FF; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">OTHER HALF</h1>
          <p style="color: white; margin: 10px 0 0 0;">Faith-based connections</p>
        </div>
        <div class="content">
          <h2 style="color: #333; margin-bottom: 20px;">Your verification code</h2>
          <div class="code">${code}</div>
          <p class="text">
            Enter this 6-digit code to ${inviteCode ? 'complete your invite signup' : 'sign in to your account'}. 
            This code will expire in 10 minutes.
          </p>
          ${inviteCode ? `<p class="text" style="color: #666; font-size: 14px;">Invite code: ${inviteCode}</p>` : ''}
          <p class="text" style="color: #666; font-size: 14px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
        <div class="footer">
          <p>Need help? <a href="mailto:support@otherhalf.app" class="support-link">Contact Support</a></p>
          <p>© 2024 OTHER HALF. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  textContent: `
OTHER HALF - Your verification code

Your verification code: ${code}

Enter this 6-digit code to ${inviteCode ? 'complete your invite signup' : 'sign in to your account'}. This code will expire in 10 minutes.

${inviteCode ? `Invite code: ${inviteCode}` : ''}

If you didn't request this code, please ignore this email.

Need help? Contact support@otherhalf.app

© 2024 OTHER HALF. All rights reserved.
  `
});

// SendGrid integration
export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@otherhalf.app';
    this.fromName = process.env.FROM_NAME || 'OTHER HALF';
    
    if (!this.apiKey) {
      console.warn('SENDGRID_API_KEY not configured - email sending will be simulated');
    }
  }

  async sendEmailCode({ email, code, inviteCode }: SendEmailCodeParams): Promise<void> {
    const template = OTP_EMAIL_TEMPLATE(code, inviteCode);
    
    if (!this.apiKey) {
      // Development mode - log email instead of sending
      console.log('\n📧 Email Code (Development Mode)');
      console.log('=' .repeat(50));
      console.log(`To: ${email}`);
      console.log(`Code: ${code}`);
      console.log(`Invite Code: ${inviteCode || 'N/A'}`);
      console.log('=' .repeat(50));
      return;
    }

    try {
      // SendGrid API v3 request
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email, name: email.split('@')[0] }],
            subject: template.subject
          }],
          from: {
            email: this.fromEmail,
            name: this.fromName
          },
          content: [
            {
              type: 'text/plain',
              value: template.textContent
            },
            {
              type: 'text/html',
              value: template.htmlContent
            }
          ],
          tracking_settings: {
            click_tracking: { enable: false },
            open_tracking: { enable: false }
          },
          categories: ['otp', 'authentication']
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SendGrid API error: ${response.status} ${errorText}`);
      }

      console.log(`📧 Email sent to ${email.replace(/(.{2}).*@/, '$1***@')}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    // TODO: Implement welcome email template
    console.log(`Would send welcome email to ${email} (${name})`);
  }

  async sendInviteEmail(email: string, inviteCode: string, inviterName?: string): Promise<void> {
    // TODO: Implement invite email template
    console.log(`Would send invite email to ${email} with code ${inviteCode} from ${inviterName || 'someone'}`);
  }
}

// Singleton instance
export const emailService = new EmailService();

// Rate limiting helpers
export interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
}

export const EMAIL_RATE_LIMITS = {
  perEmail: { maxAttempts: 5, windowMinutes: 15 },
  perIP: { maxAttempts: 10, windowMinutes: 60 }
} as const;

export function isRateLimited(attempts: number, config: RateLimitConfig): boolean {
  return attempts >= config.maxAttempts;
}

export function getRateLimitResetTime(windowMinutes: number): Date {
  return new Date(Date.now() + windowMinutes * 60 * 1000);
}

// Input validation and sanitization
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function isDisposableEmail(email: string): boolean {
  // List of common disposable email domains
  const disposableDomains = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 
    'tempmail.org', 'yopmail.com', 'throwaway.email'
  ];
  
  const domain = email.split('@')[1];
  return disposableDomains.includes(domain);
}
