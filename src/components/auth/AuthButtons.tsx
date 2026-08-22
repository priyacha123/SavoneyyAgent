'use client';

import { SignInButton, UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export function AuthButtons() {
  const { isSignedIn } = useAuth();

  return (
    <>
      {!isSignedIn && (
        <SignInButton mode="modal" appearance={{ variables: { borderRadius: '0.5rem' } }}>
          <button className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors">
            Sign In
          </button>
        </SignInButton>
      )}
      <Link
        href="/sign-up"
        className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 border border-slate-900 transition-colors"
      >
        Get Started
      </Link>
      <UserButton />
    </>
  );
}
