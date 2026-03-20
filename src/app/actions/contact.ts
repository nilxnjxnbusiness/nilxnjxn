'use server';

import { Resend } from 'resend';
import { z } from 'zod';

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

  try {
    const { data, error } = await resend.emails.send({
      from: 'NILXNJXN Contact <onboarding@resend.dev>',
      to: ['hello@nilxnjxn.com'],
      subject: `New Message from ${formData.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            ${formData.message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { error: 'Failed to send message. Please try again later.' };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true };
  } catch (err) {
    console.error('Server Action Error:', err);
    return { error: 'An unexpected error occurred.' };
  }
}
