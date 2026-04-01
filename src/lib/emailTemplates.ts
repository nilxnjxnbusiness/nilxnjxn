export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export function generateContactNotificationEmail(data: ContactEmailData): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #000 0%, #111 100%); padding: 40px 24px; text-align: center; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="color: #fff; font-size: 28px; margin: 0; font-weight: 600; letter-spacing: 2px;">NILXNJXN</h1>
        <p style="color: #22d3ee; font-size: 12px; margin: 8px 0 0; letter-spacing: 4px; text-transform: uppercase;">New Contact Submission</p>
      </div>

      <div style="background: #0a0a0a; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <div style="border-bottom: 1px solid #222; padding-bottom: 16px; margin-bottom: 16px;">
          <p style="color: #999; font-size: 11px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">From</p>
          <p style="color: #fff; font-size: 14px; font-weight: 600; margin: 0;">${data.name}</p>
          <p style="color: #22d3ee; font-size: 12px; margin: 4px 0 0;">${data.email}</p>
        </div>

        <div>
          <p style="color: #999; font-size: 11px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
          <div style="background: #1a1a1a; padding: 16px; border-left: 3px solid #22d3ee; border-radius: 4px; font-size: 13px; line-height: 1.6; color: #ccc; white-space: pre-wrap; word-wrap: break-word;">
${data.message}
          </div>
        </div>
      </div>

      <div style="color: #666; font-size: 11px; text-align: center;">
        <p style="margin: 0;">Reply directly to this email or visit the contact page to respond.</p>
      </div>
    </div>
  `;
}

export function generateContactConfirmationEmail(senderName: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #000 0%, #111 100%); padding: 40px 24px; text-align: center; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="color: #fff; font-size: 28px; margin: 0; font-weight: 600; letter-spacing: 2px;">NILXNJXN</h1>
        <p style="color: #22d3ee; font-size: 12px; margin: 8px 0 0; letter-spacing: 4px; text-transform: uppercase;">Message Received</p>
      </div>

      <div style="color: #ccc; line-height: 1.6; font-size: 14px;">
        <p>Hey ${senderName},</p>

        <p>Thanks for reaching out. Your message has been received and is in the queue.</p>

        <div style="background: #0a0a0a; padding: 20px; border-left: 3px solid #22d3ee; border-radius: 4px; margin: 20px 0; font-size: 13px;">
          <p style="color: #999; margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">What happens next</p>
          <ul style="margin: 0; padding-left: 20px; color: #ccc;">
            <li>We'll review your message</li>
            <li>Response time: 2-5 business days</li>
            <li>You'll hear back at this email address</li>
          </ul>
        </div>

        <p style="font-size: 12px; color: #999;">In the meantime, follow the socials for the latest:</p>
        <div style="text-align: center; margin: 16px 0;">
          <a href="https://instagram.com/nilxnjxn" style="color: #22d3ee; text-decoration: none; font-size: 12px; margin: 0 12px;">Instagram</a>
          <span style="color: #222;">•</span>
          <a href="https://x.com/Realnilxnjxn" style="color: #22d3ee; text-decoration: none; font-size: 12px; margin: 0 12px;">X</a>
          <span style="color: #222;">•</span>
          <a href="https://open.spotify.com/artist/5XzmR1SLHQvl8YE5cEyhz4" style="color: #22d3ee; text-decoration: none; font-size: 12px; margin: 0 12px;">Spotify</a>
        </div>
      </div>

      <div style="border-top: 1px solid #222; padding-top: 24px; margin-top: 24px; text-align: center; color: #666; font-size: 11px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} NILXNJXN. All rights reserved.</p>
      </div>
    </div>
  `;
}

export function generateNewsletterWelcomeEmail(): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #000 0%, #111 100%); padding: 40px 24px; text-align: center; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="color: #fff; font-size: 28px; margin: 0; font-weight: 600; letter-spacing: 2px;">NILXNJXN</h1>
        <p style="color: #22d3ee; font-size: 12px; margin: 8px 0 0; letter-spacing: 4px; text-transform: uppercase;">Stay Connected</p>
      </div>

      <div style="color: #ccc; line-height: 1.6;">
        <p style="font-size: 14px;">You've joined the inner circle.</p>

        <p style="font-size: 14px;">Get exclusive updates on secret releases, private events, and behind-the-scenes content from the studio.</p>

        <div style="background: #0a0a0a; padding: 20px; border-left: 3px solid #22d3ee; border-radius: 4px; margin: 20px 0; font-size: 13px;">
          <p style="color: #999; margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">What to expect</p>
          <ul style="margin: 0; padding-left: 20px; color: #ccc;">
            <li>Rare track drops before public release</li>
            <li>Production notes & creative breakdowns</li>
            <li>Exclusive event invitations</li>
            <li>Direct access & early announcements</li>
          </ul>
        </div>

        <p style="font-size: 12px; color: #999;">Questions? Reply to this email anytime.</p>
      </div>

      <div style="border-top: 1px solid #222; padding-top: 24px; margin-top: 24px; text-align: center; color: #666; font-size: 11px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} NILXNJXN. All rights reserved.</p>
      </div>
    </div>
  `;
}
