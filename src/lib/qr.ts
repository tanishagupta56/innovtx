import crypto from 'crypto';

const SECRET = process.env.QR_SIGNING_SECRET || 'techneeds-default-dev-signing-secret-key-32chars';

/**
 * Creates an HMAC-signed token from a random buffer.
 * Format: `<randomHex>.<hmacSignature>`
 */
export function generateSignedQRToken(): string {
  const randomPart = crypto.randomBytes(24).toString('hex');
  const hmac = crypto.createHmac('sha256', SECRET).update(randomPart).digest('hex');
  return `${randomPart}.${hmac}`;
}

/**
 * Validates HMAC signature of the QR token.
 */
export function verifyQRTokenSignature(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  const [randomPart, signature] = token.split('.');
  if (!randomPart || !signature) return false;

  const expectedHmac = crypto.createHmac('sha256', SECRET).update(randomPart).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedHmac, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Hashes the token for storage in the database (SHA-256).
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}
