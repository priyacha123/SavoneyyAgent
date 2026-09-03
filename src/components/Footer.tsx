import React from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, Lock, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { icons } from "@/lib/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-black text-xl text-slate-900 tracking-tight">Savoneyy</span>
              <span className="text-[10px] text-slate-400 font-medium border-l border-slate-200 pl-2.5 ml-1">
                AI Finance Controller
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Autonomous multi-source financial reconciliation engine. Deterministic 3-way matching across Razorpay settlements, bank credit advices, and ERP ledgers — with Gemini AI exception reasoning.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {icons.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-blue-700 transition-colors">Reconciliation Engine</Link>
              </li>
              <li>
                <Link href="/dashboard/history" className="hover:text-blue-700 transition-colors">Batch History &amp; Logs</Link>
              </li>
              <li>
                <Link href="/dashboard/sources" className="hover:text-blue-700 transition-colors">Data Feed Connectors</Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-blue-700 transition-colors">Rules &amp; AI Settings</Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Razorpay Billing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Pricing</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Starter — ₹999/mo</Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Pro — ₹2,999/mo</Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="hover:text-blue-700 transition-colors">Enterprise — ₹9,999/mo</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Buildathon</h4>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-900">Track 4: AI Finance Controller</div>
              <p className="text-[11px] text-slate-500">
                Closes 1 finance-ops loop over 50+ record synthetic batch with measured precision &amp; honest exception list.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#" className="hover:text-blue-700 transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-700 transition-colors">API Reference</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-700 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-700 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-700 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>256-bit SSL Encrypted · Razorpay Verified Merchant</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Priya
            </span>
            <span>© {new Date().getFullYear()} Savoneyy AI Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
