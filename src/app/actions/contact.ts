'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import {
  generateContactNotificationEmail,
  generateContactConfirmationEmail,
} from '@/lib/emailTemplates';

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
  const idempotencyKey = `contact-form/${email}/${Date.now()}`;

  try {
    // Send notification to admin
    const { error: notificationError } = await resend.emails.send(
      {
        from: 'NILXNJXN Contact <onboarding@resend.dev>',
        to: [process.env.NEXT_PUBLIC_CONTACT_EMAIL as string],
        subject: `New Message from ${name}`,
        html: generateContactNotificationEmail({ name, email, message }),
      },
      { idempotencyKey: `${idempotencyKey}/admin` }
    );

    if (notificationError) {
      console.error('Admin notification error:', notificationError);
      return { error: 'Failed to send message. Please try again later.' };
    }

    // Send confirmation to user
    const { error: confirmationError } = await resend.emails.send(
      {
        from: 'NILXNJXN <onboarding@resend.dev>',
        to: [email],
        subject: 'We Got Your Message',
        html: generateContactConfirmationEmail(name),
      },
      { idempotencyKey: `${idempotencyKey}/user` }
    );

    if (confirmationError) {
      console.error('Confirmation email error:', confirmationError);
      // Still return success since admin got the message
    }

    console.log('Contact form emails sent successfully');
    return { success: true };
  } catch (err) {
    console.error('Contact Server Action Error:', err);
    return { error: 'An unexpected error occurred.' };
  }
}
