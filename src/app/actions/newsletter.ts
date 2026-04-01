'use server';

import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Simple in-memory store for basic duplicate prevention (in production, use Redis)
const recentSubscriptions = new Map<string, number>();

function isRateLimited(email: string): boolean {
  const lastSubmission = recentSubscriptions.get(email);
  if (!lastSubmission) return false;

  const now = Date.now();
  const timeSinceLastSubmission = now - lastSubmission;
  const oneHourInMs = 60 * 60 * 1000;

  return timeSinceLastSubmission < oneHourInMs;
}

function recordSubscription(email: string): void {
  recentSubscriptions.set(email, Date.now());
}

export async function subscribeNewsletter(formData: NewsletterFormData) {
  const result = newsletterSchema.safeParse(formData);

  if (!result.success) {
    return { error: 'Invalid email address' };
  }

  const { email } = result.data;

  if (isRateLimited(email)) {
    return { error: 'You already subscribed recently. Please try again later.' };
  }

  try {
    recordSubscription(email);

    const { error } = await resend.emails.send({
      from: 'NILXNJXN Updates <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to NILXNJXN Updates',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #000 0%, #111 100%); padding: 40px 24px; text-align: center; border-radius: 12px; margin-bottom: 24px;">
            <h1 style="color: #fff; font-size: 28px; margin: 0; font-weight: 600; letter-spacing: 2px;">NILXNJXN</h1>
            <p style="color: #22d3ee; font-size: 12px; margin: 8px 0 0; letter-spacing: 4px; text-transform: uppercase;">Stay Connected</p>
          </div>
          <div style="color: #ccc; line-height: 1.6;">
            <p style="font-size: 14px;">You've joined the inner circle. Get exclusive updates on secret releases, private events, and behind-the-scenes content.</p>
            <div style="background: #0a0a0a; padding: 20px; border-left: 3px solid #22d3ee; border-radius: 4px; margin: 20px 0; font-size: 13px; color: #999;">
              <p style="margin: 0;">Expect rare releases, production notes, and direct updates only shared with this community.</p>
            </div>
            <p style="font-size: 12px; color: #666;">Questions? Reply to this email or reach out on social.</p>
          </div>
          <div style="border-top: 1px solid #222; padding-top: 24px; margin-top: 24px; text-align: center; color: #666; font-size: 11px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} NILXNJXN. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Newsletter Error:', error);
      return { error: 'Failed to subscribe. Please try again later.' };
    }

    console.log('Newsletter subscription successful:', email);
    return { success: true };
  } catch (err) {
    console.error('Newsletter Server Action Error:', err);
    return { error: 'An unexpected error occurred.' };
  }
}
