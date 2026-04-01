// Simple list of common disposable email domains (can be expanded)
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'yopmail.com',
  'fake-mail.com',
];

/**
 * Normalize email: lowercase + trim whitespace
 * Prevents duplicate subscriptions with different casing
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate email format and check against disposable domains
 * Returns { valid: boolean, error?: string }
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const normalized = normalizeEmail(email);

  // Basic RFC 5321 constraints
  if (normalized.length < 5 || normalized.length > 254) {
    return { valid: false, error: 'Email must be between 5 and 254 characters' };
  }

  // Simple regex for email format (not RFC compliant but sufficient for most cases)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check for disposable email domains
  const domainParts = normalized.split('@');
  const domain = domainParts[1];

  if (domain && DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Disposable emails not allowed' };
  }

  return { valid: true };
}

/**
 * Extract domain from email for rate limiting
 */
export function getEmailDomain(email: string): string {
  const normalized = normalizeEmail(email);
  const domainParts = normalized.split('@');
  return domainParts[1] || '';
}
