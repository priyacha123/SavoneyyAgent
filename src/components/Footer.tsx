import React from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, Lock, CheckCircle } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-bold text-base text-slate-900">Savoneyy</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Autonomous multi-source financial reconciliation engine. Measured ground-truth precision & Gemini AI exception reasoning.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Razorpay Verified Merchant Platform</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Product Engine</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-blue-700 transition-colors">Reconciliation Engine</Link>
              </li>
              <li>
                <Link href="/dashboard/history" className="hover:text-blue-700 transition-colors">Batch History & Logs</Link>
              </li>
              <li>
                <Link href="/dashboard/sources" className="hover:text-blue-700 transition-colors">Data Feed Connectors</Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-blue-700 transition-colors">Rules & AI Settings</Link>
              </li>
            </ul>
          </div>

          {/* Razorpay Billing Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Razorpay Plans</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Starter Plan (₹999/mo)</Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Pro Plan (₹2,999/mo)</Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Enterprise SLA</Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Razorpay Payment Security</Link>
              </li>
            </ul>
          </div>

          {/* Track 4 Buildathon Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Razorpay Buildathon</h4>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-900">Track 4 Submission</div>
              <p className="text-[11px] text-slate-500">
                Closes 1 finance-ops loop over 50+ record synthetic batch with measured precision & honest exception list.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>© {new Date().getFullYear()} Savoneyy AI Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
