'use client';

import React, { useEffect, useState } from 'react';
import { Application } from '../types';

interface ApplicationsMultiselectProps {
  applications: Application[];
  selectedApplicationIds: string[];
  onSelectionChange: (ids: string[]) => void;
  isLoading?: boolean;
}

export default function ApplicationsMultiselect({
  applications,
  selectedApplicationIds,
  onSelectionChange,
  isLoading = false,
}: ApplicationsMultiselectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.applications-multiselect-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const handleToggle = (applicationId: string) => {
    const newSelection = selectedApplicationIds.includes(applicationId)
      ? selectedApplicationIds.filter((id) => id !== applicationId)
      : [...selectedApplicationIds, applicationId];
    onSelectionChange(newSelection);
  };

  const handleRemove = (applicationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange(selectedApplicationIds.filter((id) => id !== applicationId));
  };

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedApplicationNames = () => {
    return selectedApplicationIds
      .map((id) => applications.find((app) => app.id === id)?.name)
      .filter(Boolean) as string[];
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500 py-2">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return <div className="text-sm text-gray-500 py-2">No applications available. Create applications first.</div>;
  }

  return (
    <div className="relative applications-multiselect-container">
      {/* Selected items display */}
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer bg-white flex items-center gap-2 flex-wrap"
      >
        {selectedApplicationIds.length === 0 ? (
          <span className="text-gray-500 text-sm">Select applications...</span>
        ) : (
          <>
            {getSelectedApplicationNames().map((name, index) => {
              const appId = selectedApplicationIds[index];
              return (
                <span
                  key={appId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm"
                >
                  {name}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(appId, e)}
                    className="hover:text-primary-900 focus:outline-none"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </>
        )}
        <div className="ml-auto">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          {/* Options list */}
          <div className="py-1">
            {filteredApplications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No applications found</div>
            ) : (
              filteredApplications.map((app) => (
                <label
                  key={app.id}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedApplicationIds.includes(app.id)}
                    onChange={() => handleToggle(app.id)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm text-gray-700">{app.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
