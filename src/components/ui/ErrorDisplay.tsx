import React from 'react';
import Button from './Button';
import Link from 'next/link';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
}

export default function ErrorDisplay({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  error,
  reset,
  showHomeButton = true,
  showRetryButton = true,
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Error Details (Development Only) */}
        {error && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-semibold text-red-900 mb-2">Error Details:</p>
            <p className="text-xs text-red-800 font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetryButton && reset && (
            <Button variant="primary" onClick={reset}>
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          )}
        </div>

        {/* Support Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="mailto:support@audexaai.com" className="text-primary-600 hover:text-primary-700">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

