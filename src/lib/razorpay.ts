import Razorpay from "razorpay";
import crypto from "crypto";

export interface PricingPlan {
  id: string;
  name: string;
  price: number; // in INR
  billingPeriod: "monthly" | "yearly";
  description: string;
  features: string[];
  recommended?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    price: 999,
    billingPeriod: "monthly",
    description: "Ideal for growing D2C brands & early startups with up to 1,000 monthly transactions.",
    features: [
      "Up to 1,000 reconciled records/mo",
      "3-Way Multi-Source Matching",
      "Rule-Based Discrepancy Flagging",
      "Standard CSV & Excel Exports",
      "Email Support",
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: 2999,
    billingPeriod: "monthly",
    description: "Built for scaling e-commerce merchants & mid-sized finance ops teams.",
    recommended: true,
    features: [
      "Up to 25,000 reconciled records/mo",
      "Full 3-Way Engine + Custom Tolerances",
      "Gemini AI Exception Reasoner",
      "Ground Truth Precision/Recall Matrix",
      "Real-time Bank & Gateway API Feeds",
      "Priority 24/7 Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 9999,
    billingPeriod: "monthly",
    description: "For high-volume enterprise platforms, marketplaces & multi-entity conglomerates.",
    features: [
      "Unlimited Reconciled Volume",
      "Dedicated Custom AI Matching Models",
      "Custom ERP Integrations (SAP, Tally, NetSuite)",
      "Audit Trail Export to Data Warehouse",
      "SLA & Dedicated Account Manager",
    ],
  },
];

export const PLAN_ID_MAP: Record<string, string> = {
  starter: process.env.RAZORPAY_STARTER_PLAN_ID || "",
  pro: process.env.RAZORPAY_PRO_PLAN_ID || "",
  enterprise: process.env.RAZORPAY_ENTERPRISE_PLAN_ID || "",
};

// Initialize Razorpay SDK instance
export function getRazorpayInstance(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && !keyId.includes("demo")) {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return null;
}

// Generate Razorpay Order or Simulated Fallback Order
export async function createRazorpayOrder(planId: string) {
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error("Invalid plan selected");

  const amountInPaise = plan.price * 100;
  const instance = getRazorpayInstance();

  if (instance) {
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planId: plan.id,
        planName: plan.name,
      },
    });

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      isSimulated: false,
    };
  }

  // Fallback simulated order for testing/demo without live Razorpay credentials
  return {
    id: `order_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    amount: amountInPaise,
    currency: "INR",
    plan,
    isSimulated: true,
  };
}

// Create Razorpay Subscription using plan IDs from .env
export async function createRazorpaySubscription(planId: string) {
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error("Invalid plan selected");

  const razorpayPlanId = PLAN_ID_MAP[planId];
  const amountInPaise = plan.price * 100;
  const instance = getRazorpayInstance();

  if (instance && razorpayPlanId) {
    try {
      const subscription = await instance.subscriptions.create({
        plan_id: razorpayPlanId,
        total_count: 0,
        start_at: Math.floor(Date.now() / 1000) + 3600,
        notes: {
          planId: plan.id,
          planName: plan.name,
          amount: String(plan.price),
        },
      });

      return {
        id: subscription.id,
        planId: plan.id,
        planName: plan.name,
        amount: amountInPaise,
        currency: "INR",
        status: subscription.status,
        isSimulated: false,
      };
    } catch (err: any) {
      console.error("Razorpay subscription creation failed:", err);
      throw new Error(err?.description || "Failed to create Razorpay subscription");
    }
  }

  // Fallback simulated subscription for testing/demo without live credentials
  return {
    id: `sub_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    planId: plan.id,
    planName: plan.name,
    amount: amountInPaise,
    currency: "INR",
    status: "created",
    isSimulated: true,
  };
}

// Verify Razorpay Payment Signature (supports both order and subscription payments)
export function verifyRazorpaySignature(
  orderId: string | undefined,
  paymentId: string,
  signature: string,
  subscriptionId?: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || keySecret.includes("demo")) {
    return true;
  }

  const payload = subscriptionId
    ? `${subscriptionId}|${paymentId}`
    : `${orderId}|${paymentId}`;

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  return generatedSignature === signature;
}

// Load client-side Razorpay Checkout script dynamically
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
