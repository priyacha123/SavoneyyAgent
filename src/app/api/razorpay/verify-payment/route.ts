import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature, PRICING_PLANS } from "@/lib/razorpay";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      razorpaySubscriptionId,
      planId,
    } = body;

    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      razorpaySubscriptionId
    );

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid Razorpay payment signature" }, { status: 400 });
    }

    const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[1];
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    let subscription = await prisma.userSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (subscription) {
      subscription = await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: {
          planId: plan.id,
          planName: plan.name,
          status: "active",
          amount: plan.price,
          currency: "INR",
          razorpayOrderId: razorpayOrderId || subscription.razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId || subscription.razorpayPaymentId,
          razorpaySignature: razorpaySignature || subscription.razorpaySignature,
          razorpaySubscriptionId: razorpaySubscriptionId || subscription.razorpaySubscriptionId,
          currentPeriodEnd: periodEnd,
        },
      });
    } else {
      subscription = await prisma.userSubscription.create({
        data: {
          userId,
          planId: plan.id,
          planName: plan.name,
          status: "active",
          amount: plan.price,
          currency: "INR",
          razorpayOrderId: razorpayOrderId || `order_sim_${Date.now()}`,
          razorpayPaymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
          razorpaySignature: razorpaySignature || "sig_simulated",
          razorpaySubscriptionId: razorpaySubscriptionId || `sub_sim_${Date.now()}`,
          currentPeriodEnd: periodEnd,
        },
      });
    }

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
