import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.STORAGE_ENDPOINT || `https://${process.env.STORAGE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    const adminPassword = "nilxnjxn-admin-2026";
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType, bucket: requestedBucket } = await request.json() as { filename?: string; contentType?: string; bucket?: string };

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Allow specifying public vs private bucket
    const allowedBuckets = ["audio-files", "public-assets"];
    const bucket = allowedBuckets.includes(requestedBucket?.toLowerCase() || "") 
      ? requestedBucket! 
      : (process.env.STORAGE_BUCKET_NAME || "audio-files");

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filename, // Example: "shades/trk0.wav" or "public/cover.jpg"
      ContentType: contentType || "application/octet-stream",
    });

    // Generate Pre-signed URL valid for 1 hour
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ success: true, uploadUrl, key: filename });
  } catch (error: unknown) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
