import React from 'react';

export default function DashboardLoading() {
  return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Status Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholders Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
  );
}

