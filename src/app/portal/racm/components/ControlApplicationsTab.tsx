'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Control, Application } from '../types';
import ApplicationsMultiselect from './ApplicationsMultiselect';

interface ControlApplicationsTabProps {
  control: Control;
  currentApplications: Application[];
  allApplications: Application[];
  isLoadingApplications: boolean;
  onUpdateApplications: (applicationIds: string[]) => Promise<void>;
  isSaving: boolean;
}

export default function ControlApplicationsTab({
  control,
  currentApplications,
  allApplications,
  isLoadingApplications,
  onUpdateApplications,
  isSaving,
}: ControlApplicationsTabProps) {
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>(
    currentApplications.map(app => app.id)
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Sync selectedApplicationIds when currentApplications changes
  useEffect(() => {
    const currentIds = currentApplications.map(app => app.id);
    setSelectedApplicationIds(currentIds);
    setHasChanges(false);
  }, [currentApplications]);

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedApplicationIds(newSelection);
    const currentIds = currentApplications.map(app => app.id).sort().join(',');
    const newIds = newSelection.sort().join(',');
    setHasChanges(currentIds !== newIds);
  };

  const handleSave = async () => {
    try {
      await onUpdateApplications(selectedApplicationIds);
      setHasChanges(false);
    } catch (error) {
      // Error handling is done in parent
    }
  };

  const handleCancel = () => {
    setSelectedApplicationIds(currentApplications.map(app => app.id));
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Applications in Scope</h2>
          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select the applications that are in scope for this control. Changes will be saved immediately.
        </p>

        <ApplicationsMultiselect
          applications={allApplications}
          selectedApplicationIds={selectedApplicationIds}
          onSelectionChange={handleSelectionChange}
          isLoading={isLoadingApplications}
        />

        {selectedApplicationIds.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Applications ({selectedApplicationIds.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedApplicationIds.map((appId) => {
                const app = allApplications.find(a => a.id === appId);
                return app ? (
                  <span
                    key={appId}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {app.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

