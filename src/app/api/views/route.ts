// src/app/api/views/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, source } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    // Hash IP for privacy
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
    const userAgent = req.headers.get("user-agent") ?? undefined;

    await prisma.productView.create({
      data: {
        productId,
        ipHash,
        userAgent,
        source: source ?? "landing_page",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
