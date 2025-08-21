import { Router } from 'express';
import { requestEmailCode, verifyEmailCode, resendEmailCode } from './email-otp';

const router = Router();

// Request email verification code
router.post('/request-code', requestEmailCode);

// Verify email verification code
router.post('/verify-code', verifyEmailCode);

// Resend email verification code
router.post('/resend-code', resendEmailCode);

export default router;
