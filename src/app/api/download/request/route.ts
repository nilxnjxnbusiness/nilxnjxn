import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getPaidOrderByEmailAndTracking } from "@/lib/db/d1-client"
import { generateDownloadLink } from "@/lib/fulfillment/delivery"

const requestLinkSchema = z.object({
  email: z.string().email(),
  trackingCode: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = requestLinkSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email or tracking code format" }, { status: 400 })
    }

    const { email, trackingCode } = result.data

    // 1. Verify existence of at least one paid order for this user via D1
    const order = await getPaidOrderByEmailAndTracking(email, trackingCode)
    
    if (!order || !order.track_id) {
       return NextResponse.json({ error: "No purchases found for this email & tracking code." }, { status: 404 })
    }

    // 2. Generate new pre-signed URL (expires in 2 hours)
    // Note: This relies on ListObjectsV2 to find the correct file type (.wav, .mp3, etc.)
    const downloadLink = await generateDownloadLink(order.track_id)

    // 3. Send email 
    // SECURITY FIX: 5-minute windowed idempotency key to prevent Resend spam
    const timeBucket = Math.floor(Date.now() / 300000); 
    const resendKey = `resend-${order.id}-${timeBucket}`
    
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)
    const subject = "Your Secure Track Download (Regenerated) - NILXNJXN";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://store.nilxnjxn.com";

    const html = `
      <div style="font-family: monospace; background-color: #0A0A0A; color: #FFFFFF; padding: 40px; text-align: center;">
        <h1 style="letter-spacing: 0.2em; text-transform: uppercase;">Link Regenerated</h1>
        <p style="color: #666;">Requested for purchased track.</p>
        
        <div style="margin: 40px 0; padding: 20px; border: 1px solid #333; background-color: #111;">
          <h2 style="font-size: 16px; color: #aaa; text-transform: uppercase; letter-spacing: 0.1em;">Your Fresh Download Link</h2>
          <a href="${downloadLink}" style="display: inline-block; padding: 15px 30px; background-color: #fff; color: #000; text-decoration: none; font-weight: bold; margin-top: 15px; border-radius: 4px;">ACCESS AUDIO FILE</a>
          <p style="font-size: 12px; color: #555; margin-top: 15px;">* Link expires in 2 hours.</p>
        </div>

        <p style="font-size: 12px; color: #444; margin-top: 40px;">
          Lost connection? <a href="${appUrl}/request-link" style="color: #888;">Request another link</a>.
        </p>
      </div>
    `;

    const sendData = await resend.emails.send(
      {
        from: "NILXNJXN <store@nilxnjxn.com>",
        to: [email],
        subject,
        html,
      },
      { idempotencyKey: resendKey }
    );

    if (sendData.error) {
       return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "A new download link has been sent to your email." })
  } catch (error: unknown) {
    console.error("Request link error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to process request" }, { status: 500 })
  }
}
