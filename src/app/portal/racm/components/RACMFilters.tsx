'use client';

import React from 'react';

export default function RACMFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search controls, risks, or descriptions..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option>All Categories</option>
        <option>Access to Programs and Data</option>
        <option>Program Changes</option>
        <option>Computer Operations</option>
      </select>
      <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option>All Risk Levels</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>
  );
}
