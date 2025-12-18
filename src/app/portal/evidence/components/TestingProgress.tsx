'use client';

import React from 'react';
import { TestingProgress } from '../types';

interface TestingProgressProps {
  progress: TestingProgress;
}

export default function TestingProgressComponent({ progress }: TestingProgressProps) {
  const progressItems = [
    { label: 'L1', value: progress.l1, color: 'bg-purple-500' },
    { label: 'L2', value: progress.l2, color: 'bg-yellow-500' },
    { label: 'L3', value: progress.l3, color: 'bg-orange-500' },
    { label: 'L4', value: progress.l4, color: 'bg-gray-400' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Testing Progress</h3>
        <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Save Progress</span>
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        {progressItems.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1 min-w-[40px]">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-300`}
                style={{ width: `${item.value}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 min-w-[35px] text-right">{item.value}%</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Progress updates automatically as evidence is processed through each testing level</span>
      </div>
    </div>
  );
}

