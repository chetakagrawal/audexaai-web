'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { ProjectControl, Control } from '../types';
import EditControlOverridesModal from './EditControlOverridesModal';

interface ProjectControlsTabProps {
  projectControls: ProjectControl[];
  controlsNotInProject: Control[];
  isLoadingControls: boolean;
  onAddControl: () => void;
  onApplyRACM: () => void;
  onDeleteControl: (projectControlId: string) => Promise<void>;
  onUpdateControl: (projectControlId: string, data: {
    is_key_override: boolean | null;
    frequency_override: string | null;
    notes: string | null;
  }) => Promise<void>;
  getControlDetails: (controlId: string) => Control | undefined;
}

export default function ProjectControlsTab({
  projectControls,
  controlsNotInProject,
  isLoadingControls,
  onAddControl,
  onApplyRACM,
  onDeleteControl,
  onUpdateControl,
  getControlDetails,
}: ProjectControlsTabProps) {
  const [editingControl, setEditingControl] = useState<{ projectControl: ProjectControl; control: Control } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (projectControl: ProjectControl) => {
    const control = getControlDetails(projectControl.control_id);
    if (control) {
      setEditingControl({ projectControl, control });
    }
  };

  const handleSave = async (data: {
    is_key_override: boolean | null;
    frequency_override: string | null;
    notes: string | null;
  }) => {
    if (!editingControl) return;
    setIsUpdating(true);
    try {
      await onUpdateControl(editingControl.projectControl.id, data);
      setEditingControl(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Project Controls</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onApplyRACM}
            >
              + Apply RACM
            </Button>
            <div className="relative group">
              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 pointer-events-none">
                <p>All controls with its applications in scope from the RACM will be applied to this project. You can then update those controls for this project.</p>
                <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onAddControl}
          >
            + Add Control
          </Button>
        </div>
      </div>

      {isLoadingControls ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading controls...</div>
        </div>
      ) : projectControls.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No controls added to this project yet.</p>
          <Button
            variant="primary"
            onClick={onAddControl}
          >
            Add Your First Control
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Control Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key Control
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectControls.map((projectControl) => {
                const control = getControlDetails(projectControl.control_id);
                if (!control) return null;

                return (
                  <tr key={projectControl.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {control.control_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{control.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      v{projectControl.control_version_num}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {control.category || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {control.control_type || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {projectControl.frequency_override || control.frequency || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {projectControl.is_key_override !== null
                        ? projectControl.is_key_override
                          ? 'Yes'
                          : 'No'
                        : control.is_key
                        ? 'Yes'
                        : 'No'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={projectControl.notes || ''}>
                      {projectControl.notes || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(projectControl)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit control overrides"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove "${control.control_code} - ${control.name}" from this project?`)) {
                              onDeleteControl(projectControl.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Remove control from project"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingControl && (
        <EditControlOverridesModal
          projectControl={editingControl.projectControl}
          control={editingControl.control}
          isOpen={!!editingControl}
          onClose={() => setEditingControl(null)}
          onSave={handleSave}
          isSaving={isUpdating}
        />
      )}
    </div>
  );
}
