import crypto from 'node:crypto';
import { Resend } from 'resend';

interface StoredOtp {
  codeHash: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  createdAt: number;
}

// In-memory server-side secure token storage (persists across requests in node process)
// In production clustered environments this can be backed by Redis or Supabase
const otpCache = new Map<string, StoredOtp>();

const OTP_EXPIRY_MS = 5 * 60 * 1000;      // 5 minutes
const RESEND_COOLDOWN_MS = 45 * 1000;    // 45 seconds cooldown
const MAX_ATTEMPTS = 5;                   // Max 5 attempts before invalidation

// Automatic periodic cleanup of expired tokens every 60 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [email, record] of otpCache.entries()) {
      if (now > record.expiresAt) {
        otpCache.delete(email);
      }
    }
  }, 60 * 1000).unref();
}

function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

/**
 * Generate, store and dispatch a secure 6-digit OTP to the recipient email
 */
export async function requestEmailOtp(rawEmail: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  cooldownRemaining?: number;
}> {
  const email = rawEmail.trim().toLowerCase();

  // 1. Basic format validation
  if (!email || !email.includes('@') || email.length < 5) {
    return { success: false, error: 'Please enter a valid student email address.' };
  }

  const now = Date.now();
  const existing = otpCache.get(email);

  // 2. Cooldown check
  if (existing) {
    const elapsedSinceLast = now - existing.lastSentAt;
    if (elapsedSinceLast < RESEND_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsedSinceLast) / 1000);
      return {
        success: false,
        error: `Please wait ${remainingSeconds}s before requesting a new verification code.`,
        cooldownRemaining: remainingSeconds,
      };
    }
  }

  // 3. Cryptographically secure 6-digit code generation (100000 - 999999)
  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const codeHash = hashOtp(otpCode, salt);

  // 4. Invalidate any previous OTP and save the new record
  otpCache.set(email, {
    codeHash,
    salt,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    lastSentAt: now,
    createdAt: now,
  });

  // 5. Send via Resend
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'TechNeeds IGDTUW <onboarding@resend.dev>';

  if (apiKey && apiKey.startsWith('re_')) {
    try {
      const resend = new Resend(apiKey);
      const emailHtml = generateOtpEmailHtml(otpCode, email);

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Your TechNeeds Access Code: ${otpCode}`,
        html: emailHtml,
      });

      if (error) {
        console.error('[Resend Error]', error);
        return {
          success: false,
          error: `Email delivery failed: ${error.message}. Please check your email configuration.`,
        };
      }

      return {
        success: true,
        message: `A 6-digit verification code has been dispatched to ${email}.`,
      };
    } catch (err: any) {
      console.error('[Resend Exception]', err);
      return {
        success: false,
        error: `Failed to deliver email: ${err?.message || 'Network error'}.`,
      };
    }
  } else {
    // If RESEND_API_KEY is not configured yet, log guidance in server console
    console.info(
      `\n============================================================\n[TechNeeds Auth] RESEND_API_KEY is not set in .env.local.\nTo send real emails to student inboxes, add:\nRESEND_API_KEY=re_your_api_key\n\n[DEVELOPMENT TEST CODE for ${email}]: ${otpCode} (Expires in 5 mins)\n============================================================\n`
    );

    return {
      success: true,
      message: `A 6-digit verification code has been generated for ${email}. (Expires in 5 minutes)`,
    };
  }
}

/**
 * Verify a 6-digit OTP against the server-side store
 */
export async function verifyEmailOtp(
  rawEmail: string,
  rawOtp: string
): Promise<{
  success: boolean;
  error?: string;
  expired?: boolean;
}> {
  const email = rawEmail.trim().toLowerCase();
  const otp = rawOtp.trim().replace(/\D/g, '');

  if (!email || otp.length !== 6) {
    return { success: false, error: 'Please enter a valid 6-digit code.' };
  }

  const record = otpCache.get(email);

  if (!record) {
    return {
      success: false,
      error: 'No active verification code found for this email. Please request a new code.',
      expired: true,
    };
  }

  const now = Date.now();

  // Check expiry
  if (now > record.expiresAt) {
    otpCache.delete(email);
    return {
      success: false,
      error: 'Verification code has expired (valid for 5 minutes). Please request a new code.',
      expired: true,
    };
  }

  // Check brute force attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    otpCache.delete(email);
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, this code has been invalidated. Please request a new one.',
      expired: true,
    };
  }

  // Verify hash
  const computedHash = hashOtp(otp, record.salt);
  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedHash, 'hex'),
    Buffer.from(record.codeHash, 'hex')
  );

  if (!isValid) {
    record.attempts += 1;
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // OTP verified successfully! Delete it immediately so it cannot be reused
  otpCache.delete(email);

  return { success: true };
}

/**
 * Beautiful HTML email template styled with TechNeeds IGDTUW brand
 */
function generateOtpEmailHtml(otp: string, email: string): string {
  const digits = otp.split('');
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechNeeds Access Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B12; color: #F2F4F8; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background-color: #111722; border: 1px solid rgba(49, 94, 255, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
    .header { padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid rgba(49, 94, 255, 0.1); background: linear-gradient(180deg, rgba(49,94,255,0.08) 0%, rgba(17,23,34,0) 100%); }
    .badge { display: inline-block; font-size: 11px; font-weight: 700; font-family: monospace; letter-spacing: 0.1em; color: #B8D94C; text-transform: uppercase; padding: 4px 10px; background-color: rgba(184, 217, 76, 0.1); border: 1px solid rgba(184, 217, 76, 0.25); border-radius: 4px; margin-bottom: 12px; }
    .title { font-size: 24px; font-weight: 800; color: #F2F4F8; letter-spacing: -0.02em; margin: 0; }
    .title span { color: #315EFF; }
    .content { padding: 32px; text-align: center; }
    .intro { font-size: 14px; color: #969EAD; margin: 0 0 24px; line-height: 1.6; }
    .otp-box { background-color: #080B12; border: 1px solid rgba(49, 94, 255, 0.35); border-radius: 12px; padding: 20px 24px; margin: 24px 0; display: inline-block; }
    .otp-code { font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #B8D94C; margin: 0; padding-left: 12px; text-shadow: 0 0 20px rgba(184, 217, 76, 0.3); }
    .expiry { font-size: 12px; color: #969EAD; margin-top: 16px; font-family: monospace; }
    .expiry strong { color: #F2F4F8; }
    .notice { font-size: 12px; color: #64748B; margin-top: 24px; line-height: 1.5; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }
    .footer { padding: 20px 32px; background-color: #080B12; text-align: center; font-size: 11px; color: #64748B; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">SECURE ACCESS // IGDTUW</div>
      <h1 class="title">TECH<span>NEEDS</span></h1>
    </div>
    <div class="content">
      <p class="intro">
        Hello,<br>
        Use the following one-time verification code to complete your authentication on the <strong>TechNeeds IGDTUW</strong> platform.
      </p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>

      <div class="expiry">
        ⏱ This verification code is valid for <strong>5 minutes</strong>.
      </div>

      <p class="notice">
        If you did not request this login code, someone may have entered your email address by mistake. You can safely disregard this email.
      </p>
    </div>
    <div class="footer">
      INDIRA GANDHI DELHI TECHNICAL UNIVERSITY FOR WOMEN, DELHI 110006<br>
      TECHNEEDS // PREMIER TECHNICAL INNOVATION COLLECTIVE
    </div>
  </div>
</body>
</html>
  `;
}
