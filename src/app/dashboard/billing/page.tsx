"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Sparkles,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Declare Razorpay on window for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99900,         // paise — ₹999
    priceLabel: "₹999",
    description: "For early-stage fintechs and solo operators testing reconciliation workflows.",
    icon: Zap,
    features: [
      "Up to 5,000 records / batch",
      "1 Gateway Integration",
      "1 Bank Feed",
      "Manual Trigger Only",
      "7-day log retention",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299900,        // paise — ₹2,999
    priceLabel: "₹2,999",
    description: "For growing payment operations teams running daily automated reconciliation.",
    icon: ShieldCheck,
    features: [
      "Up to 50,000 records / batch",
      "3 Gateway Integrations",
      "3 Bank Feeds",
      "Scheduled + Webhook Triggers",
      "Gemini AI Exception Reasoner",
      "30-day log retention",
      "Priority email + Slack support",
    ],
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999900,        // paise — ₹9,999
    priceLabel: "₹9,999",
    description: "For large enterprises needing unlimited throughput, custom integrations, and SLAs.",
    icon: Building2,
    features: [
      "Unlimited records",
      "Unlimited Integrations",
      "Dedicated Razorpay Account Manager",
      "Custom matching rules engine",
      "Real-time streaming reconciliation",
      "90-day audit log retention",
      "24×7 phone + SLA support",
    ],
  },
];

interface Subscription {
  planId: string;
  planName: string;
  status: string;
  nextBilling: string | null;
  orderId: string | null;
  subscriptionId: string | null;
  amount: number;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payingPlan, setPayingPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/razorpay/subscription")
      .then((r) => r.json())
      .then((d) => {
        const sub = d.subscription;
        if (sub) {
          setSubscription({
            planId: sub.planId || sub.plan,
            planName: sub.planName || sub.plan,
            status: sub.status,
            nextBilling: sub.currentPeriodEnd || sub.nextBilling,
            orderId: sub.razorpayOrderId || sub.orderId,
            subscriptionId: sub.razorpaySubscriptionId || sub.subscriptionId,
            amount: sub.amount,
          });
        } else {
          setSubscription(null);
        }
      })
      .catch(() => setSubscription(null))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePurchase = async (plan: Plan) => {
    setPayingPlan(plan.id);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const loaded = await loadRazorpayScript();

      // Create Razorpay subscription via backend
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const orderData = await orderRes.json();
      const sub = orderData.subscription || orderData.order;

      // Simulation mode — if keys not configured
      if (sub?.isSimulated) {
        setSuccessMsg(
          `[SIMULATION] Plan "${plan.name}" purchase simulated. Subscription ID: ${sub.id}. No real charge made.`
        );
        setPayingPlan(null);
        return;
      }

      if (!loaded || !window.Razorpay) {
        setErrorMsg("Razorpay SDK failed to load. Check network connectivity.");
        setPayingPlan(null);
        return;
      }

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: plan.price,
        currency: "INR",
        name: "Savoneyy AI Finance Controller",
        description: `${plan.name} Plan — Monthly Subscription`,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              razorpaySubscriptionId: response.razorpay_subscription_id,
              planId: plan.id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSuccessMsg(`Payment verified! ${plan.name} plan is now active.`);
            const subRes = await fetch("/api/razorpay/subscription");
            const subData = await subRes.json();
            setSubscription(subData.subscription || null);
          } else {
            setErrorMsg("Payment verification failed. Contact support.");
          }
        },
        prefill: { name: "Savoneyy User", email: "user@savoneyy.com" },
        theme: { color: "#1d4ed8" },
        modal: { ondismiss: () => setPayingPlan(null) },
      };

      if (sub?.id) {
        options.subscription_id = sub.id;
      }
      if (sub?.id && !sub.isSimulated) {
        options.order_id = sub.id;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      setErrorMsg(e?.message || "Payment initiation failed.");
    } finally {
      setPayingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Razorpay Billing & Plans</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your Savoneyy subscription. Payments powered by Razorpay. All prices in INR (excl. GST).
        </p>
      </div>

      {/* Current Subscription Banner */}
      {!isLoading && subscription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-700 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Active Subscription — {subscription.planName}
            </p>
            <p className="text-[11px] text-blue-700 font-mono mt-0.5">
              Status: {subscription.status}
              {subscription.orderId ? ` · Order: ${subscription.orderId}` : ""}
              {subscription.subscriptionId ? ` · Subscription: ${subscription.subscriptionId}` : ""}
              {subscription.nextBilling ? ` · Renews: ${new Date(subscription.nextBilling).toLocaleDateString()}` : ""}
            </p>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-1 rounded border border-blue-200 uppercase">
            Active
          </span>
        </div>
      )}

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-700" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-700" />
          {errorMsg}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = subscription?.planId?.toLowerCase() === plan.id;
          const isPaying = payingPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-lg border flex flex-col shadow-2xs ${
                plan.highlight ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
              } ${isCurrent ? "border-emerald-300 ring-2 ring-emerald-50" : ""}`}
            >
              {/* Plan Header */}
              <div className={`p-4 border-b ${plan.highlight ? "border-blue-100 bg-blue-50" : "border-slate-100 bg-slate-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center ${plan.highlight ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {plan.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                      {plan.badge}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Current
                    </span>
                  )}
                </div>
                <p className={`text-sm font-bold ${plan.highlight ? "text-blue-900" : "text-slate-900"}`}>{plan.name}</p>
                <p className={`text-[11px] mt-0.5 ${plan.highlight ? "text-blue-700" : "text-slate-500"}`}>{plan.description}</p>
              </div>

              {/* Price */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-slate-900">{plan.priceLabel}</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">+ 18% GST applicable</p>
              </div>

              {/* Features */}
              <ul className="p-4 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="p-4 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
                    Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(plan)}
                    disabled={!!payingPlan}
                    className={`w-full py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 ${
                      plan.highlight
                        ? "bg-blue-700 hover:bg-blue-800 text-white border border-blue-800"
                        : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800"
                    }`}
                  >
                    {isPaying ? (
                      <>
                        <Clock className="h-3.5 w-3.5 animate-spin" /> Processing…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-3.5 w-3.5" />
                        Subscribe via Razorpay
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Razorpay Trust Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-700" />
          <span>Payments are 256-bit TLS encrypted and processed securely by <strong className="text-slate-700">Razorpay</strong>.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-600" /> Simulation Mode Available</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-600" /> PCI DSS Level 1</span>
        </div>
      </div>
    </div>
  );
}
