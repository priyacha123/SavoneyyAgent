"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Footer } from "@/components/Footer";
import { Menu, CreditCard, ChevronRight } from "lucide-react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Reconciliation Workbench",
  "/dashboard/history": "Batch History & Analytics",
  "/dashboard/sources": "Connected Data Feeds",
  "/dashboard/billing": "Razorpay Billing & Plans",
  "/dashboard/settings": "Engine Rules & Settings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const pageTitle = BREADCRUMB_MAP[pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Mobile Drawer (with dedicated close-menu X button) */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation Bar */}
        <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          {/* Mobile Hamburger + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 md:hidden"
              aria-label="Open navigation menu"
              id="mobile-menu-toggle"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Link href="/" className="hover:text-slate-900 transition-colors hidden sm:block">
                Savoneyy
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400 hidden sm:block" />
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors hidden sm:block">
                Dashboard
              </Link>
              {pathname !== "/dashboard" && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-400 hidden sm:block" />
                  <span className="text-slate-900 font-semibold">{pageTitle}</span>
                </>
              )}
              {pathname === "/dashboard" && (
                <span className="text-slate-900 font-semibold sm:block hidden">{pageTitle}</span>
              )}
              {/* Mobile: show only current page */}
              <span className="text-slate-900 font-semibold sm:hidden">{pageTitle}</span>
            </div>
          </div>

          {/* Header Right: Plan Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/billing"
              id="billing-nav-badge"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">PRO Plan</span>
              <span className="sm:hidden">PRO</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-[90%] w-full mx-auto">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
