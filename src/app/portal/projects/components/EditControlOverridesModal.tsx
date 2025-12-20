'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { ProjectControl, Control } from '../types';

interface EditControlOverridesModalProps {
  projectControl: ProjectControl;
  control: Control;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    is_key_override: boolean | null;
    frequency_override: string | null;
    notes: string | null;
  }) => Promise<void>;
  isSaving?: boolean;
}

export default function EditControlOverridesModal({
  projectControl,
  control,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: EditControlOverridesModalProps) {
  const [formData, setFormData] = useState({
    is_key_override: projectControl.is_key_override !== null ? projectControl.is_key_override : control.is_key,
    frequency_override: projectControl.frequency_override || control.frequency || '',
    notes: projectControl.notes || '',
  });
  const [error, setError] = useState<string | null>(null);

  // Update form data when projectControl changes
  useEffect(() => {
    if (projectControl) {
      setFormData({
        is_key_override: projectControl.is_key_override !== null ? projectControl.is_key_override : control.is_key,
        frequency_override: projectControl.frequency_override || control.frequency || '',
        notes: projectControl.notes || '',
      });
      setError(null);
    }
  }, [projectControl, control]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSave({
        is_key_override: formData.is_key_override,
        frequency_override: formData.frequency_override || null,
        notes: formData.notes || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update control overrides');
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      // Reset form to original values
      setFormData({
        is_key_override: projectControl.is_key_override !== null ? projectControl.is_key_override : control.is_key,
        frequency_override: projectControl.frequency_override || control.frequency || '',
        notes: projectControl.notes || '',
      });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Control Overrides</h2>
              <p className="text-sm text-gray-500 mt-1">
                {control.control_code} - {control.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Version: v{projectControl.control_version_num}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSaving}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Control Override
              </label>
              <select
                value={formData.is_key_override === null ? '' : formData.is_key_override.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    is_key_override: value === '' ? null : value === 'true',
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSaving}
              >
                <option value="">Use default ({control.is_key ? 'Yes' : 'No'})</option>
                <option value="true">Yes (Override)</option>
                <option value="false">No (Override)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Default value: {control.is_key ? 'Yes' : 'No'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency Override
              </label>
              <input
                type="text"
                value={formData.frequency_override}
                onChange={(e) => setFormData({ ...formData, frequency_override: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={control.frequency || 'Enter frequency override...'}
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-gray-500">
                Default value: {control.frequency || 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add project-specific notes about this control..."
                rows={4}
                disabled={isSaving}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
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

