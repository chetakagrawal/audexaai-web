import React from 'react';
import Logo from '@/components/ui/Logo';

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo href="/" size="lg" showTagline={true} className="justify-center" />
        </div>

        {/* Loading Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            {/* Spinner */}
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading login page...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

