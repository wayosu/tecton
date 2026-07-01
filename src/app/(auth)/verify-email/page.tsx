import { Suspense } from 'react';
import { VerifyEmailContent } from './verify-content';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="bg-muted mx-auto h-12 w-12 animate-pulse rounded-full" />
              <div className="bg-muted mx-auto h-4 w-48 animate-pulse rounded" />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
