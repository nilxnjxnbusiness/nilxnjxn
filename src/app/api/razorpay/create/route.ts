import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { getUserByEmail, createUser, createOrder } from "@/lib/db/d1-client"
import { getTracks } from "@/lib/data"

const createOrderRequestSchema = z.object({
  currency: z.string().default("INR"),
  trackId: z.string(),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = createOrderRequestSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map(e => e.message).join(', ') }, { status: 400 })
    }

    const { currency, trackId, email } = result.data

    // VALIDATION: Prevent trackId S3 enumeration or garbage purchases
    const allTracks = await getTracks()
    const targetTrack = allTracks.find(t => t.id === trackId)
    
    if (!targetTrack) {
      return NextResponse.json({ error: "Invalid track ID requested." }, { status: 404 })
    }

    // PRICING AUTHORITY: Prevent client-side manipulation by deriving price strictly from the backend
    const numericPrice = parseInt(targetTrack.price.replace(/[^0-9]/g, ''), 10)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: "Invalid track pricing configuration." }, { status: 500 })
    }
    const razorpayAmount = Math.round(numericPrice * 100); // in paise

    // Check or create user securely
    let user = await getUserByEmail(email)
    if (!user) {
      // SECURITY FIX: Replaced predictable Math.random() with CSPRNG
      const trackingCode = crypto.randomBytes(4).toString('hex').toUpperCase()
      const newUserId = crypto.randomUUID()
      user = await createUser(newUserId, email, trackingCode)
    }

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay API keys are not configured.");
      return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 500 });
    }
    
    const dbOrderId = crypto.randomUUID()

    const options = {
      amount: razorpayAmount,
      currency,
      receipt: dbOrderId,
    };

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64")}`
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const errorBody = await response.json() as { error?: { description?: string } };
      console.error("Razorpay order creation failed:", errorBody);
      return NextResponse.json({ error: `Failed to create payment order: ${errorBody.error?.description || 'Unknown'}` }, { status: 500 });
    }

    const razorpayOrder = await response.json() as { id: string; amount?: number; currency?: string; [key: string]: unknown };
   
    await createOrder(razorpayOrder.id, user.id, razorpayAmount, trackId)

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      dbOrderId: razorpayOrder.id,
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}
