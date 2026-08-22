import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Savoneyy — Multi-Source Financial Reconciliation Workbench",
  description: "Enterprise Financial Settlement & Audit Trail Controller (Razorpay Buildathon Track 4)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
