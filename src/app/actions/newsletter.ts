'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { normalizeEmail, validateEmail } from '@/lib/emailUtils';
import { isEmailSubscribed, recordSubscription, checkRateLimit } from '@/lib/redis';
import { generateNewsletterWelcomeEmail } from '@/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export async function subscribeNewsletter(
  formData: NewsletterFormData,
  ipAddress?: string
) {
  const result = newsletterSchema.safeParse(formData);

  if (!result.success) {
    return { error: 'Invalid email address' };
  }

  const normalizedEmail = normalizeEmail(result.data.email);

  // Validate email quality
  const emailValidation = validateEmail(normalizedEmail);
  if (!emailValidation.valid) {
    return { error: emailValidation.error || 'Invalid email address' };
  }

  // 1. Check if already subscribed (idempotency)
  const alreadySubscribed = await isEmailSubscribed(normalizedEmail);
  if (alreadySubscribed) {
    return { error: 'duplicate', message: "You're already part of the circle." };
  }

  // 2. Rate limiting (email + optional IP)
  const rateLimitKey = ipAddress
    ? `newsletter:ratelimit:${normalizedEmail}:${ipAddress}`
    : `newsletter:ratelimit:${normalizedEmail}`;

  const rateLimitCheck = await checkRateLimit(rateLimitKey, 1);
  if (!rateLimitCheck.allowed) {
    return {
      error: 'ratelimit',
      message: 'Please wait before trying again.',
      retryAfter: rateLimitCheck.retryAfter,
    };
  }

  try {
    // 3. Send welcome email via Resend (with idempotency key)
    const idempotencyKey = `newsletter:${normalizedEmail}:${Date.now()}`;
    const { error } = await resend.emails.send(
      {
        from: 'NILXNJXN Updates <no-reply@nilxnjxn.com>',
        to: [normalizedEmail],
        subject: 'Welcome to NILXNJXN Updates',
        html: generateNewsletterWelcomeEmail(),
      },
      { idempotencyKey }
    );

    if (error) {
      console.error('Resend Newsletter Error:', error);
      return { error: 'send', message: 'Failed to subscribe. Please try again later.' };
    }

    // 4. Record subscription in database
    await recordSubscription(normalizedEmail);

    console.log('Newsletter subscription successful:', normalizedEmail);
    return { success: true, message: "You're in. Welcome to the inner circle." };
  } catch (err) {
    console.error('Newsletter Server Action Error:', err);
    return { error: 'server', message: 'An unexpected error occurred.' };
  }
}
