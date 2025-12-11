'use client';

import React from 'react';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <ErrorDisplay
        title="Portal Error"
        message="An error occurred while loading the portal. Please try again or contact support if the problem persists."
        error={error}
        reset={reset}
        showHomeButton={false}
        showRetryButton={true}
      />
    </div>
  );
}

