'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Status = 'loading' | 'success' | 'invalid' | 'expired' | 'error';

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    fetch(`/api/verify-email?token=${token}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(d.error); });
        setStatus('success');
      })
      .catch((err) => {
        if (err.message?.includes('expired')) setStatus('expired');
        else setStatus('error');
      });
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-muted" />
        <p className="text-sm text-muted-foreground">Verifying your email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold">Email verified</h1>
        <p className="text-sm text-muted-foreground">Your email has been verified. You can now sign in.</p>
        <Link href="/login" className="inline-block text-sm text-primary hover:underline">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold">
        {status === 'expired' ? 'Link expired' : 'Verification failed'}
      </h1>
      <p className="text-sm text-muted-foreground">
        {status === 'expired'
          ? 'This verification link has expired. Please register again.'
          : 'This verification link is invalid or has already been used.'}
      </p>
      <Link href="/login" className="inline-block text-sm text-primary hover:underline">Go to sign in</Link>
    </div>
  );
}
