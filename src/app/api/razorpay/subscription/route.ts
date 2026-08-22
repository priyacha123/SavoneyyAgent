import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.userSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      subscription: subscription || null,
    });
  } catch (error: any) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
