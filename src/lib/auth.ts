import { NextRequest } from 'next/server';
import crypto from 'crypto';

/**
 * Validates the Authorization Bearer token against ADMIN_PASSWORD.
 * Uses crypto.timingSafeEqual to prevent timing side-channel attacks.
 */
export function verifyAdminAuth(request: NextRequest): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'nilxnjxn-admin-2026';
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return false;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : authHeader;

  if (!token) {
    return false;
  }

  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedPassword);

  if (tokenBuffer.length !== expectedBuffer.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(tokenBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
