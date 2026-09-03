"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { sideNavItems } from "@/lib/constants";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 bg-white border-r border-slate-200 md:flex md:flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-md bg-slate-900 flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 tracking-tight block leading-none">Savoneyy</span>
              <span className="text-[10px] text-slate-500 font-medium">AI Finance Controller</span>
            </div>
          </Link>
        </div>

        <div className="p-3 space-y-1">
          <div className="px-2 pb-1.5 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            SaaS Workbench
          </div>
          {sideNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-700" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-600" />}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Plan</span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              PRO PLAN
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900">₹2,999 / month</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Razorpay Order #RZP-PRO</p>
          <Link
            href="/dashboard/billing"
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-1 rounded border border-slate-300 transition-colors"
          >
            Manage Billing <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
