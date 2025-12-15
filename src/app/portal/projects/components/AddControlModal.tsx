'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { Control } from '../types';

interface AddControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (controlId: string) => Promise<void>;
  availableControls: Control[];
  selectedControlId: string;
  onSelectControl: (controlId: string) => void;
  isSubmitting: boolean;
}

export default function AddControlModal({
  isOpen,
  onClose,
  onSubmit,
  availableControls,
  selectedControlId,
  onSelectControl,
  isSubmitting,
}: AddControlModalProps) {
  const handleSubmit = async () => {
    if (selectedControlId) {
      await onSubmit(selectedControlId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Control to Project</h2>
        
        {availableControls.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">All available controls are already added to this project.</p>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="control" className="block text-sm font-medium text-gray-700 mb-2">
                Select Control
              </label>
              <select
                id="control"
                value={selectedControlId}
                onChange={(e) => onSelectControl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a control...</option>
                {availableControls.map((control) => (
                  <option key={control.id} value={control.id}>
                    {control.control_code} - {control.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                disabled={!selectedControlId || isSubmitting}
              >
                Add Control
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
