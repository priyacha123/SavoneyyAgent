'use client';

import { SignIn } from '@clerk/nextjs';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Savoneyy</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to access your reconciliation dashboard</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-none border-0',
                formButtonPrimary: 'bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold',
                footerActionLink: 'text-blue-700 hover:text-blue-800',
                formFieldInput: 'rounded-lg border-slate-300 text-sm',
                identityPreviewText: 'text-sm',
                formFieldLabel: 'text-xs font-semibold text-slate-700',
              },
            }}
            routing="path"
            path="/login"
            signUpUrl="/signup"
          />
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Protected by Clerk. Your data is secure.
        </p>
      </div>
    </div>
  );
}
