import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Resend } from "resend"
import { getCatalogItemById } from "@/lib/db/d1-client"

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.STORAGE_ENDPOINT || `https://${process.env.STORAGE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
  },
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function generateDownloadLink(trackId: string): Promise<string> {
  const bucket = process.env.STORAGE_BUCKET_NAME || "AUDIO-FILES";
  
  // 1. Try exact key lookup from D1 catalog (preferred — no guessing)
  const catalogItem = await getCatalogItemById(trackId);
  if (catalogItem?.r2_download_key) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: catalogItem.r2_download_key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 7200 });
  }

  // 2. Fallback: List objects by prefix (legacy tracks without r2_download_key)
  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `shades/${trackId}.`, 
  });

  const listData = await s3Client.send(listCommand);
  if (!listData.Contents || listData.Contents.length === 0) {
    throw new Error(`No audio file found for track ID: ${trackId}`);
  }

  // Use the first matched file
  const actualKey = listData.Contents[0]!.Key as string;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: actualKey,
  });

  // Expire in 2 hours (7200 seconds)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 7200 });
  return url;
}

export async function sendReceiptAndLink(
  email: string,
  trackingCode: string,
  downloadLink: string,
  amountPaise: number,
  orderId: string
): Promise<void> {
  const amountRs = (amountPaise / 100).toFixed(2);
  const subject = "Your Secure Track Download - NILXNJXN";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://store.nilxnjxn.com";

  const html = `
    <div style="font-family: monospace; background-color: #0A0A0A; color: #FFFFFF; padding: 40px; text-align: center;">
      <h1 style="letter-spacing: 0.2em; text-transform: uppercase;">Payment Confirmed</h1>
      <p style="color: #666;">Order ID: ${orderId} | Amount: ₹${amountRs}</p>
      
      <div style="margin: 40px 0; padding: 20px; border: 1px solid #333; background-color: #111;">
        <h2 style="font-size: 16px; color: #aaa; text-transform: uppercase; letter-spacing: 0.1em;">Your Download Link</h2>
        <a href="${downloadLink}" style="display: inline-block; padding: 15px 30px; background-color: #fff; color: #000; text-decoration: none; font-weight: bold; margin-top: 15px; border-radius: 4px;">ACCESS AUDIO FILE</a>
        <p style="font-size: 12px; color: #555; margin-top: 15px;">* Link expires in 2 hours.</p>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px dashed #333;">
        <p style="color: #888; font-size: 12px;">Keep this Tracking Code. It is your identity for future downloads:</p>
        <code style="font-size: 18px; color: #fff; background: #222; padding: 5px 10px; border-radius: 4px;">${trackingCode}</code>
      </div>

      <p style="font-size: 12px; color: #444; margin-top: 40px;">
        Lost connection? <a href="${appUrl}/request-link" style="color: #888;">Request a new link</a> using your Email and Tracking Code.
      </p>
    </div>
  `;

  // Provide idempotency key using Razorpay order ID to avoid double-sends if function retries
  const { data, error } = await resend.emails.send(
    {
      from: "NILXNJXN <store@nilxnjxn.com>",
      to: [email],
      subject,
      html,
    },
    { idempotencyKey: `receipt-${orderId}` }
  );

  if (error) {
    console.error("Failed to send email via Resend:", error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }

  console.log(`Receipt sent to ${email}, id: ${data?.id}`);
}
