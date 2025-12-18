'use client';

import React, { useState } from 'react';
import { Control } from '../types';
import Badge from '@/components/ui/Badge';

interface ControlAccordionProps {
  control: Control | null;
}

export default function ControlAccordion({ control }: ControlAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!control) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{control.code}</h3>
              <span className="text-gray-600">{control.name}</span>
            </div>
            {!isExpanded && (
              <p className="text-sm text-gray-500 mt-1">{control.description}</p>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Control Details</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Description</span>
                  <p className="text-sm text-gray-900">{control.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Risk Rating</span>
                  {control.riskRating ? (
                    <Badge variant={
                      control.riskRating === 'High' ? 'danger' :
                      control.riskRating === 'Medium' ? 'warning' : 'success'
                    }>
                      {control.riskRating}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500">Not set</span>
                  )}
                </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Control Type</span>
                    <p className="text-sm text-gray-900">{control.controlType || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Control Attributes</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Frequency</span>
                  <p className="text-sm text-gray-900">{control.frequency || 'Not set'}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${control.isKey ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-900">Key Control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${control.isAutomated ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-900">Automated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

