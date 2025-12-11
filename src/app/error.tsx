'use client';

import React from 'react';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Something went wrong"
      message="We encountered an unexpected error. Please try again or return to the home page."
      error={error}
      reset={reset}
      showHomeButton={true}
      showRetryButton={true}
    />
  );
}

