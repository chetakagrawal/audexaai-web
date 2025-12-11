import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="mb-4 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

