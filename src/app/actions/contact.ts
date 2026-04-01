'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import {
  generateContactNotificationEmail,
  generateContactConfirmationEmail,
} from '@/lib/emailTemplates';
import { canSubmitContact, recordContactSubmission } from '@/lib/redis';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function sendContactEmail(formData: ContactFormData) {
  const result = contactSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { name, email, message } = result.data;
  const normalizedEmail = email.toLowerCase().trim();

  // Check if already submitted recently (24-hour cooldown)
  const canSubmit = await canSubmitContact(normalizedEmail);
  if (!canSubmit.allowed) {
    return {
      error: 'ratelimit',
      message: 'You already submitted a message. Please wait 24 hours.',
    };
  }

  const idempotencyKey = `contact-form/${normalizedEmail}/${Date.now()}`;

  try {
    // Send notification to admin
    const { error: notificationError } = await resend.emails.send(
      {
        from: 'NILXNJXN Contact <no-reply@nilxnjxn.com>',
        to: [process.env.NEXT_PUBLIC_CONTACT_EMAIL as string],
        subject: `New Message from ${name}`,
        html: generateContactNotificationEmail({ name, email: normalizedEmail, message }),
      },
      { idempotencyKey: `${idempotencyKey}/admin` }
    );

    if (notificationError) {
      console.error('Admin notification error:', notificationError);
      return { error: 'send', message: 'Failed to send message. Please try again later.' };
    }

    // Send confirmation to user
    const { error: confirmationError } = await resend.emails.send(
      {
        from: 'NILXNJXN <no-reply@nilxnjxn.com>',
        to: [normalizedEmail],
        subject: 'We Got Your Message',
        html: generateContactConfirmationEmail(name),
      },
      { idempotencyKey: `${idempotencyKey}/user` }
    );

    if (confirmationError) {
      console.error('Confirmation email error:', confirmationError);
      // Still return success since admin got the message
    }

    // Record submission for cooldown
    await recordContactSubmission(normalizedEmail);

    console.log('Contact form emails sent successfully');
    return { success: true, message: 'Message sent! We got it and will get back to you soon.' };
  } catch (err) {
    console.error('Contact Server Action Error:', err);
    return { error: 'server', message: 'An unexpected error occurred.' };
  }
}
