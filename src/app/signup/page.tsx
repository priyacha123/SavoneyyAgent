'use client';

import { SignUp } from '@clerk/nextjs';
import { ShieldCheck } from 'lucide-react';

export default function SignupPage() {
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
          <h1 className="text-xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500">Get started with Savoneyy today</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-none border-0',
                formButtonPrimary: 'bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold',
                footerActionLink: 'text-blue-700 hover:text-blue-800',
                formFieldInput: 'rounded-lg border-slate-300 text-sm',
              },
            }}
            routing="path"
            path="/signup"
            signInUrl="/login"
          />
        </div>
      </div>
    </div>
  );
}
