'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { authApi } from '@/lib/api';

export default function NoAccessPage() {
  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/login/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo href="/" size="lg" showTagline={true} className="justify-center" />
        </div>

        {/* No Access Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-8 h-8 text-amber-600" 
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

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              No Access
            </h1>
            <p className="text-gray-600 mb-6">
              You don&apos;t have access to any tenant workspaces yet.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Your account has been created, but you need to be granted access to a tenant workspace
              by an administrator before you can use the application.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Sign Out
              </button>
              <Link 
                href="/pilot/"
                className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
              >
                Join Pilot Program
              </Link>
              <Link 
                href="/"
                className="block w-full px-4 py-3 text-primary-600 rounded-lg font-medium hover:text-primary-700 transition-colors text-center"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Need help? Contact{' '}
            <a href="mailto:support@audexaai.com" className="text-primary-600 hover:underline">
              support@audexaai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
