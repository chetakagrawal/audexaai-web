'use client';

import React from 'react';
import MetricCard from '@/components/portal/MetricCard';

export default function RACMMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        icon={
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        }
        value="18"
        label="Total Controls"
      />
      <MetricCard
        icon={
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Key</span>
            </div>
          </div>
        }
        value="13"
        label="Key Controls"
      />
      <MetricCard
        icon={
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        }
        value="13"
        label="High Risk Controls"
      />
      <MetricCard
        icon={
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
          </div>
        }
        value="9"
        label="Automated Controls"
      />
    </div>
  );
}
