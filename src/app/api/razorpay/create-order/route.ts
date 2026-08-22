import { NextResponse } from "next/server";
import { createRazorpaySubscription } from "@/lib/razorpay";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ success: false, error: "planId is required" }, { status: 400 });
    }

    const subscriptionData = await createRazorpaySubscription(planId);
    return NextResponse.json({ success: true, subscription: subscriptionData });
  } catch (error: any) {
    console.error("Error creating Razorpay subscription:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
