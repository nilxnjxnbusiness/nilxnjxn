import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { getOrderById, updateOrderStatus, getUserByEmail } from "@/lib/db/d1-client"
import { generateDownloadLink, sendReceiptAndLink } from "@/lib/fulfillment/delivery"

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  orderId: z.string(), // This is the razorpay order_id that we stored in DB
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const result = verifyPaymentSchema.safeParse(requestBody)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues.map(e => e.message).join(', ') }, { status: 400 })
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId, email } = result.data

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 })
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(body.toString()).digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Verify order exists
    const order = await getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.status === "paid") {
      // Idempotency: if already paid, return success 
      return NextResponse.json({ success: true, message: "Order already processed" })
    }

    // Update order status
    await updateOrderStatus(orderId, "paid", razorpay_payment_id)

    // Fulfillment
    try {
      const user = await getUserByEmail(email)
      if (!user) throw new Error("User not found for fulfillment")
      if (!order.track_id) throw new Error("Order has no track_id")

      const downloadLink = await generateDownloadLink(order.track_id)
      
      await sendReceiptAndLink(
        email,
        user.tracking_code,
        downloadLink,
        order.amount,
        orderId
      )
    } catch (fulfillErr) {
      console.error("Fulfillment Error:", fulfillErr)
      // Even if fulfillment fails initially, payment succeeded. 
      // User can regenerate link using request-link flow.
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and link delivered successfully",
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
