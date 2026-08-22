import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ success: false, error: "Webhook secret not configured" }, { status: 400 });
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;

    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.payload?.payment?.entity?.method || event.event;

    // Handle subscription events
    const subscriptionEntity = event.payload?.subscription?.entity;
    const paymentEntity = event.payload?.payment?.entity;

    if (!subscriptionEntity) {
      return NextResponse.json({ success: true, message: "No subscription entity found" });
    }

    const razorpaySubscriptionId = subscriptionEntity.id;
    const status = subscriptionEntity.status;
    const planId = subscriptionEntity.plan_id || "";

    // Map Razorpay subscription plan ID back to internal plan ID
    let internalPlanId = "starter";
    for (const [key, value] of Object.entries(process.env)) {
      if (value === planId && key.startsWith("RAZORPAY_") && key.endsWith("_PLAN_ID")) {
        internalPlanId = key
          .replace("RAZORPAY_", "")
          .replace("_PLAN_ID", "")
          .toLowerCase();
        break;
      }
    }

    const plan = razorpaySubscriptionId
      ? await prisma.userSubscription.findFirst({
          where: { razorpaySubscriptionId },
        })
      : null;

    const periodEnd = new Date();
    if (status === "active" || status === "activated") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    if (plan) {
      await prisma.userSubscription.update({
        where: { id: plan.id },
        data: {
          status: status === "activated" ? "active" : status,
          planId: internalPlanId,
          currentPeriodEnd: periodEnd,
          razorpayPaymentId: paymentEntity?.id || plan.razorpayPaymentId,
        },
      });
    } else if (status === "activated" || status === "active") {
      await prisma.userSubscription.create({
        data: {
          userId: "usr_default",
          planId: internalPlanId,
          planName: subscriptionEntity.notes?.planName || `${internalPlanId.charAt(0).toUpperCase() + internalPlanId.slice(1)} Plan`,
          status: "active",
          amount: subscriptionEntity.notes?.amount || (subscriptionEntity.amount / 100),
          currency: "INR",
          razorpaySubscriptionId,
          razorpayPaymentId: paymentEntity?.id,
          currentPeriodEnd: periodEnd,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
