'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { ApiProject } from '../types';

interface EditProjectModalProps {
  project: ApiProject;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
  }) => Promise<void>;
  isSaving?: boolean;
}

export default function EditProjectModal({
  project,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'draft',
    period_start: '',
    period_end: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        status: project.status || 'draft',
        period_start: project.period_start ? new Date(project.period_start).toISOString().split('T')[0] : '',
        period_end: project.period_end ? new Date(project.period_end).toISOString().split('T')[0] : '',
      });
      setError(null);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate dates
    if (formData.period_start && formData.period_end) {
      const startDate = new Date(formData.period_start);
      const endDate = new Date(formData.period_end);
      if (endDate < startDate) {
        setError('End date must be after start date');
        return;
      }
    }

    try {
      await onSave({
        name: formData.name,
        status: formData.status,
        period_start: formData.period_start || null,
        period_end: formData.period_end || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      // Reset form to original values
      if (project) {
        setFormData({
          name: project.name || '',
          status: project.status || 'draft',
          period_start: project.period_start ? new Date(project.period_start).toISOString().split('T')[0] : '',
          period_end: project.period_end ? new Date(project.period_end).toISOString().split('T')[0] : '',
        });
      }
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
            <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
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
                Project Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Q1 2024 SOX Audit"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSaving}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period Start
                </label>
                <input
                  type="date"
                  value={formData.period_start}
                  onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period End
                </label>
                <input
                  type="date"
                  value={formData.period_end}
                  onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isSaving}
                />
              </div>
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

