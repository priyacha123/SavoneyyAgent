import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Savoneyy — Multi-Source Financial Reconciliation Workbench',
  description: 'Enterprise Financial Settlement & Audit Trail Controller (Razorpay Buildathon Track 4)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#0f172a',
          colorBackground: '#ffffff',
          colorTextOnPrimaryBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#0f172a',
          borderRadius: '0.5rem',
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        elements: {
          formButtonPrimary: 'bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold',
          footerActionLink: 'text-blue-700 hover:text-blue-800',
          formFieldInput: 'rounded-lg border-slate-300 text-sm',
          identityPreviewText: 'text-sm',
          formFieldLabel: 'text-xs font-semibold text-slate-700',
          card: 'shadow-none border border-slate-200',
          rootBox: 'mx-auto',
        },
      }}
    >
      <html lang="en" className={inter.variable}>
        <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
