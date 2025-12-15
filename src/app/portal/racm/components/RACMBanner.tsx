'use client';

import React from 'react';

export default function RACMBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">SOX IT General Controls Template</h3>
          <p className="text-sm text-blue-800 mb-2">
            This pre-configured RACM contains standard SOX ITGC controls. You can use our template as-is or customize it for your organization.
          </p>
          <p className="text-xs text-blue-700">
            <strong>Automation:</strong> PBC requests are automatically generated from these controls, and control owners listed here become the default recipients.
          </p>
        </div>
      </div>
    </div>
  );
}
