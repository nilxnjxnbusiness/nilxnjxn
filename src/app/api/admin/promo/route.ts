import { NextRequest, NextResponse } from "next/server";
import { getPromoCodes, createPromoCode, deletePromoCode } from "@/lib/db/d1-client";

const ADMIN_PASSWORD = "nilxnjxn-admin-2026";

function authenticate(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const promos = await getPromoCodes();
    return NextResponse.json(promos);
  } catch (error) {
    console.error("Failed to fetch promos:", error);
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as any;
    const { code, discountValue, discountType } = body;
    if (!code || !discountValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await createPromoCode({
      code: code.toUpperCase(),
      discount_type: discountType || 'fixed',
      discount_value: parseInt(discountValue, 10),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to create promo:", error);
    return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as any;
    const { code } = body;
    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    await deletePromoCode(code);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete promo:", error);
    return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
  }
}
