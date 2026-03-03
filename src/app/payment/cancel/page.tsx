'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { colors } from '@/lib/constants';

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
      <div className="text-center max-w-md px-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.indigo }}>
          Payment Cancelled
        </h1>
        <p className="text-sm mb-6" style={{ color: colors.slate }}>
          Your payment was not processed. You can return to your assessment to try again.
        </p>
        <div className="flex gap-3 justify-center">
          {sessionId && (
            <button
              onClick={() => router.push(`/assess?resume=${sessionId}`)}
              className="px-6 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: colors.scarlet }}
            >
              Return to Assessment
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: colors.indigo, color: colors.indigo }}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancel() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
