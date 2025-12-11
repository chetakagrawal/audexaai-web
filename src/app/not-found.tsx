import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo href="/" size="lg" />
        </div>

        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-600">404</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link href="/portal/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              Home
            </Link>
            <Link href="/login" className="text-primary-600 hover:text-primary-700">
              Login
            </Link>
            <Link href="/#waitlist" className="text-primary-600 hover:text-primary-700">
              Waitlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

