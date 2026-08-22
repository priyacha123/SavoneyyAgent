import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ success: false, error: "planId is required" }, { status: 400 });
    }

    const orderData = await createRazorpayOrder(planId);
    return NextResponse.json({ success: true, order: orderData });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
