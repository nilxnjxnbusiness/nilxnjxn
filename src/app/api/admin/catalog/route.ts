import { NextRequest, NextResponse } from "next/server";
import { createCatalogItem } from "@/lib/db/d1-client";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const adminPassword = "nilxnjxn-admin-2026";
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json() as {
      title: string;
      item_type: 'song' | 'album';
      artist?: string;
      cover_url: string;
      preview_url: string | null;
      r2_download_key: string;
      price: string;
      season: 'FRESH' | 'AKAD' | 'LATE' | null;
      slug: string;
    };
    const id = crypto.randomUUID();
    
    await createCatalogItem({
      id,
      title: data.title,
      item_type: data.item_type,
      artist: data.artist || "NILXNJXN",
      cover_url: data.cover_url,
      preview_url: data.preview_url,
      r2_download_key: data.r2_download_key,
      price: data.price,
      season: data.season,
      slug: data.slug,
    });

    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    console.error("Failed to save catalog:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save catalog" },
      { status: 500 }
    );
  }
}
