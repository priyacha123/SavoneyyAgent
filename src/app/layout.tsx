import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Savoneyy — AI Financial Controller",
  description: "Autonomous Multi-Source Financial Reconciliation Engine & Audit Dashboard for Razorpay Buildathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
