import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: { userId: "usr_default" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      subscription: subscription || {
        planId: "pro",
        planName: "Pro Plan (Trial)",
        status: "active",
        amount: 2999,
        currency: "INR",
        currentPeriodEnd: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
