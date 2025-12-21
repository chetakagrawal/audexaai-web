'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import { ApplicationResponse } from '@/lib/api';

interface ScopeApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (applicationIds: string[]) => Promise<void>;
  projectControlId: string;
  controlCode: string;
  controlName: string;
  allApplications: ApplicationResponse[];
  scopedApplications: ApplicationResponse[];
  isSaving?: boolean;
}

export default function ScopeApplicationsModal({
  isOpen,
  onClose,
  onSave,
  projectControlId,
  controlCode,
  controlName,
  allApplications,
  scopedApplications,
  isSaving = false,
}: ScopeApplicationsModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize selected IDs from scoped applications
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(scopedApplications.map(app => app.id)));
      setSearchTerm('');
      setError(null);
    }
  }, [isOpen, scopedApplications]);

  // Filter applications by search term
  const filteredApplications = useMemo(() => {
    if (!searchTerm.trim()) return allApplications;
    const term = searchTerm.toLowerCase();
    return allApplications.filter(app =>
      app.name.toLowerCase().includes(term) ||
      (app.category && app.category.toLowerCase().includes(term))
    );
  }, [allApplications, searchTerm]);

  const handleToggle = (applicationId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(applicationId)) {
      newSelected.delete(applicationId);
    } else {
      newSelected.add(applicationId);
    }
    setSelectedIds(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSave(Array.from(selectedIds));
      onClose();
    } catch (err) {
      console.error('Failed to save application scope:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleCancel}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Scope Applications
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {controlCode} - {controlName}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSaving}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>

              {/* Selected count */}
              <div className="mb-3 text-sm text-gray-600">
                {selectedIds.size} {selectedIds.size === 1 ? 'application' : 'applications'} selected
              </div>

              {/* Applications list */}
              <div className="space-y-2">
                {filteredApplications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {searchTerm ? 'No applications found' : 'No applications available'}
                  </p>
                ) : (
                  filteredApplications.map((app) => (
                    <label
                      key={app.id}
                      className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(app.id)}
                        onChange={() => handleToggle(app.id)}
                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isSaving}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{app.name}</div>
                        {app.category && (
                          <div className="text-sm text-gray-500">{app.category}</div>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

