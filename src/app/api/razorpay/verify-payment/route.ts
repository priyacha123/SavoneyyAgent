import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature, PRICING_PLANS } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } = body;

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid Razorpay payment signature" }, { status: 400 });
    }

    const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[1];
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // Save or update subscription in DB
    const subscription = await prisma.userSubscription.create({
      data: {
        userId: "usr_default",
        planId: plan.id,
        planName: plan.name,
        status: "active",
        amount: plan.price,
        currency: "INR",
        razorpayOrderId: razorpayOrderId || `order_sim_${Date.now()}`,
        razorpayPaymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
        razorpaySignature: razorpaySignature || "sig_simulated",
        currentPeriodEnd: periodEnd,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
