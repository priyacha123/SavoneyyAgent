"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  ShieldCheck,
} from "lucide-react";
import { navItems } from "@/lib/constants";
import { MobileDrawerProps } from "@/lib/types";


export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-none transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white border-r border-slate-200 shadow-2xl flex flex-col justify-between z-50">
        <div>
          <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm text-slate-900">Savoneyy SaaS</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors border border-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-3 space-y-1">
            <div className="px-2 pb-1 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-700" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs font-bold text-slate-900">Active Plan: Razorpay Pro</div>
          <p className="text-[10px] text-slate-500 mt-0.5">₹2,999 / month • Track 4 Buildathon</p>
          <button
            onClick={onClose}
            className="mt-3 w-full py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};
