import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.nilxnjxn_KV_REST_API_URL || '',
  token: process.env.nilxnjxn_KV_REST_API_TOKEN || '',
});

// Helper to check if email already subscribed
export async function isEmailSubscribed(email: string): Promise<boolean> {
  try {
    const key = `newsletter:subscriber:${email}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (err) {
    console.error('Redis subscription check failed, allowing retry:', err);
    return false; // Fail open (allow submission on Redis error)
  }
}

// Helper to store subscription
export async function recordSubscription(email: string): Promise<void> {
  try {
    const key = `newsletter:subscriber:${email}`;
    // Store with 90-day expiration
    await redis.setex(key, 90 * 24 * 60 * 60, JSON.stringify({ subscribedAt: new Date().toISOString() }));
  } catch (err) {
    console.error('Redis subscription recording failed:', err);
    // Continue anyway; don't break signup on Redis error
  }
}

// Helper for rate limiting (email + IP based)
export async function checkRateLimit(
  identifier: string,
  limitPerHour: number = 1
): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    const key = `ratelimit:${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      // First request this hour
      await redis.expire(key, 3600);
      return { allowed: true };
    }

    if (current > limitPerHour) {
      const ttl = await redis.ttl(key);
      return { allowed: false, retryAfter: ttl };
    }

    return { allowed: true };
  } catch (err) {
    console.error('Redis rate limit check failed, allowing retry:', err);
    return { allowed: true }; // Fail open
  }
}

// Helper for contact form deduplication (24-hour window)
export async function recordContactSubmission(email: string): Promise<void> {
  try {
    const key = `contact:lastsubmit:${email}`;
    await redis.setex(key, 24 * 60 * 60, JSON.stringify({ submittedAt: new Date().toISOString() }));
  } catch (err) {
    console.error('Redis contact recording failed:', err);
  }
}

// Helper to check if contact submission allowed
export async function canSubmitContact(email: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    const key = `contact:lastsubmit:${email}`;
    const exists = await redis.exists(key);

    if (exists === 1) {
      const ttl = await redis.ttl(key);
      return { allowed: false, retryAfter: ttl };
    }

    return { allowed: true };
  } catch (err) {
    console.error('Redis contact check failed, allowing retry:', err);
    return { allowed: true }; // Fail open
  }
}

export { redis };
