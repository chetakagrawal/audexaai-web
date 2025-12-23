'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { Control } from '../types';
import { getRiskColor } from '../racmUtils';

interface RACMTableProps {
  controls: Control[];
  testAttributesCounts: Record<string, number>;
}

export default function RACMTable({ controls, testAttributesCounts }: RACMTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Control ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Control Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Applications in Scope
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Business Process Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                IT Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Risk Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Key Control
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Automated
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Test Attributes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {controls.map((control) => {
              const handleClick = () => {
                const newPath = `/portal/racm/${control.id}`;
                window.history.pushState({}, '', newPath);
                window.dispatchEvent(new Event('pushstate'));
              };

              const handleTestAttributesClick = (e: React.MouseEvent) => {
                e.stopPropagation(); // Prevent row click
                const newPath = `/portal/racm/${control.id}#test-attributes`;
                window.history.pushState({}, '', newPath);
                window.dispatchEvent(new Event('pushstate'));
              };

              const testAttributesCount = testAttributesCounts[control.id] || 0;
              
              return (
              <tr 
                key={control.id} 
                onClick={handleClick}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium text-gray-900">{control.controlCode}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{control.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="info">{control.category}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {control.applicationsInScope.length > 2
                      ? `${control.applicationsInScope.slice(0, 2).join(', ')} +${control.applicationsInScope.length - 2}`
                      : control.applicationsInScope.join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{control.businessProcessOwner.name}</div>
                  <div className="text-xs text-gray-500">{control.businessProcessOwner.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{control.itOwner.name}</div>
                  <div className="text-xs text-gray-500">{control.itOwner.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <span className={`text-sm font-medium ${getRiskColor(control.riskRating)}`}>
                      {control.riskRating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{control.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{control.frequency}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {control.isKeyControl ? (
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-purple-700">Key</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`w-3 h-3 rounded-full ${control.isAutomated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={handleTestAttributesClick}
                    className="text-primary-600 hover:text-primary-800 hover:underline font-medium"
                  >
                    {testAttributesCount}
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
