import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  BarChart2,
  Database,
  Sparkles,
  Building2,
  Clock,
  Lock,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: "3-Way Automated Matching",
      description:
        "Deterministic matching across Razorpay settlements, bank credit advices, and ERP GL entries — in one engine.",
    },
    {
      icon: Sparkles,
      title: "Gemini AI Exception Reasoner",
      description:
        "Every unmatched record gets a natural-language audit diagnosis powered by Google Gemini AI — no manual review needed.",
    },
    {
      icon: BarChart2,
      title: "Real-Time Discrepancy Matrix",
      description:
        "Live heatmap view of amount mismatches across all three data sources. Spot the problem before your auditor does.",
    },
    {
      icon: Database,
      title: "Multi-Feed Ingestion",
      description:
        "Connect Razorpay API, bank SFTP feeds, and ERP webhooks simultaneously. New sources in under 5 minutes.",
    },
    {
      icon: Clock,
      title: "Scheduled Batch Runs",
      description:
        "Auto-trigger reconciliation hourly, daily, or on every settlement push. Full audit trail per run.",
    },
    {
      icon: Lock,
      title: "Enterprise-Grade Audit Logs",
      description:
        "Every match decision, variance, and exception is logged with timestamps, confidence scores, and AI reasoning.",
    },
  ];

  const plans = [
    { name: "Starter", price: "₹999", records: "5,000 records/batch", cta: "Get Started" },
    { name: "Pro", price: "₹2,999", records: "50,000 records/batch", cta: "Start Pro Trial", highlight: true },
    { name: "Enterprise", price: "₹9,999", records: "Unlimited records", cta: "Contact Sales" },
  ];

  const stats = [
    { value: "99.8%", label: "Match accuracy" },
    { value: "<2s", label: "Per-record latency" },
    { value: "₹50Cr+", label: "Settlements reconciled" },
    { value: "3-way", label: "Source matching depth" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">Savoneyy</span>
            <span className="hidden sm:block text-[10px] text-slate-400 font-medium border-l border-slate-200 pl-2.5 ml-1">
              AI Finance Controller
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Docs</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded border border-slate-900 transition-colors"
            >
              Open Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Razorpay AI Buildathon — Track 4: Finance Operations
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-5 max-w-3xl mx-auto">
          Stop Chasing Payment Mismatches.<br />
          <span className="underline decoration-blue-600 decoration-4 underline-offset-4">Automate Reconciliation.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Savoneyy is a SaaS reconciliation engine that performs deterministic 3-way matching across
          Razorpay settlement reports, bank credit advices, and ERP ledger entries — then uses Gemini AI
          to diagnose every exception in plain English.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded border border-blue-800 transition-all"
          >
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-300 transition-all"
          >
            See How It Works
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black font-mono text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Built for Finance Operations Teams
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Every feature is designed around the real-world workflow of payment reconciliation at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:border-slate-300 transition-colors">
                <div className="h-8 w-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-slate-700" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-10">
            The Reconciliation Pipeline
          </h2>
          <div className="flex flex-col md:flex-row items-start gap-0">
            {[
              { step: "01", title: "Ingest Sources", desc: "Pull Razorpay settlement CSV, bank SFTP credit advice, and ERP GL export automatically." },
              { step: "02", title: "3-Way Match", desc: "Deterministic engine cross-checks TxnID, Amount, UTR, and OrderID across all three sources." },
              { step: "03", title: "AI Exception Triage", desc: "Unmatched records routed to Gemini AI which generates a plain-English audit diagnosis." },
              { step: "04", title: "Audit & Export", desc: "Full audit trail with confidence scores, exception reports, and one-click CSV export for finance teams." },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.step}>
                <div className="flex-1 p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Step {item.step}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden md:flex items-center self-stretch pt-10">
                    <ArrowRight className="h-5 w-5 text-slate-400 shrink-0" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">Simple, Transparent Pricing</h2>
          <p className="text-sm text-slate-500">All plans include a 14-day free trial. No credit card required to start.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg border flex flex-col p-6 shadow-2xs ${
                plan.highlight ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
              }`}
            >
              {plan.highlight && (
                <span className="self-start text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mb-3">
                  Most Popular
                </span>
              )}
              <p className="text-sm font-bold text-slate-900">{plan.name}</p>
              <p className="text-3xl font-black font-mono text-slate-900 mt-1.5">
                {plan.price}
                <span className="text-sm font-medium text-slate-500">/mo</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-5">{plan.records}</p>

              <ul className="space-y-1.5 flex-1 mb-6">
                {["3-way reconciliation engine", "Gemini AI Exception Reasoner", "Razorpay Billing Integration", "Audit Trail & Export"].map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/billing"
                className={`w-full text-center py-2 rounded text-xs font-bold transition-colors border ${
                  plan.highlight
                    ? "bg-blue-700 text-white border-blue-800 hover:bg-blue-800"
                    : "bg-slate-900 text-white border-slate-800 hover:bg-slate-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-slate-200 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <Globe className="h-8 w-8 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black tracking-tight mb-3">
            Ready to close your reconciliation backlog?
          </h2>
          <p className="text-sm text-slate-400 mb-6 max-w-lg mx-auto">
            Start processing settlements today. No infrastructure to manage, no Excel sheets, no more manual exception hunting.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded border border-white transition-all"
          >
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-slate-900 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Savoneyy</span>
            <span>AI Finance Controller</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Built for Razorpay AI Buildathon — Track 4</span>
            <span>·</span>
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
