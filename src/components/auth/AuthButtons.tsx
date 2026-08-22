'use client';

import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export function AuthButtons() {
  return (
    <>
      <SignInButton mode="modal" appearance={{ variables: { borderRadius: '0.5rem' } }}>
        <button className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal" appearance={{ variables: { borderRadius: '0.5rem' } }}>
        <button className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 border border-slate-900 transition-colors">
          Get Started
        </button>
      </SignUpButton>
      <UserButton />
    </>
  );
}
