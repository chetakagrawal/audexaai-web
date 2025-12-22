'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { LineItem } from '../types';
import { ProjectTestAttributeOverrideUpsert } from '@/lib/api';

interface LineItemOverrideModalProps {
  lineItem: LineItem;
  baseProcedure: string | null;
  baseEvidence: string | null;
  baseFrequency: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectTestAttributeOverrideUpsert) => Promise<void>;
  onDelete?: () => Promise<void>;
  isSaving?: boolean;
}

export default function LineItemOverrideModal({
  lineItem,
  baseProcedure,
  baseEvidence,
  baseFrequency,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isSaving = false,
}: LineItemOverrideModalProps) {
  const [formData, setFormData] = useState({
    procedure_override: lineItem.effectiveProcedure || '',
    expected_evidence_override: lineItem.effectiveEvidence || '',
    frequency_override: lineItem.effectiveFrequency || '',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Update form data when lineItem changes
  useEffect(() => {
    if (lineItem) {
      setFormData({
        procedure_override: lineItem.isOverridden ? lineItem.effectiveProcedure || '' : '',
        expected_evidence_override: lineItem.isOverridden ? lineItem.effectiveEvidence || '' : '',
        frequency_override: lineItem.isOverridden ? lineItem.effectiveFrequency || '' : '',
        notes: '',
      });
      setError(null);
    }
  }, [lineItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSave({
        application_id: lineItem.applicationId,
        procedure_override: formData.procedure_override || null,
        expected_evidence_override: formData.expected_evidence_override || null,
        frequency_override: formData.frequency_override || null,
        notes: formData.notes || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save override');
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to remove this override?')) return;

    setError(null);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete override');
    }
  };

  const handleResetToBase = () => {
    setFormData({
      procedure_override: '',
      expected_evidence_override: '',
      frequency_override: '',
      notes: '',
    });
  };

  const handleClose = () => {
    if (!isSaving) {
      setFormData({
        procedure_override: lineItem.isOverridden ? lineItem.effectiveProcedure || '' : '',
        expected_evidence_override: lineItem.isOverridden ? lineItem.effectiveEvidence || '' : '',
        frequency_override: lineItem.isOverridden ? lineItem.effectiveFrequency || '' : '',
        notes: '',
      });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {lineItem.isOverridden ? 'Edit Override' : 'Create Override'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Control:</span> {lineItem.projectControlCode} - {lineItem.projectControlName}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Application:</span> {lineItem.applicationName || 'All Applications'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Test Attribute:</span> {lineItem.testAttributeCode} - {lineItem.testAttributeName}
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
                Test Procedure Override
              </label>
              <textarea
                value={formData.procedure_override}
                onChange={(e) => setFormData({ ...formData, procedure_override: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={baseProcedure || 'Enter test procedure override...'}
                rows={6}
                disabled={isSaving}
              />
              {baseProcedure && (
                <p className="mt-1 text-xs text-gray-500">
                  Base value: {baseProcedure.substring(0, 100)}{baseProcedure.length > 100 ? '...' : ''}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Evidence Override
              </label>
              <textarea
                value={formData.expected_evidence_override}
                onChange={(e) => setFormData({ ...formData, expected_evidence_override: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={baseEvidence || 'Enter expected evidence override...'}
                rows={6}
                disabled={isSaving}
              />
              {baseEvidence && (
                <p className="mt-1 text-xs text-gray-500">
                  Base value: {baseEvidence.substring(0, 100)}{baseEvidence.length > 100 ? '...' : ''}
                </p>
              )}
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
                placeholder={baseFrequency || 'Enter frequency override...'}
                disabled={isSaving}
              />
              {baseFrequency && (
                <p className="mt-1 text-xs text-gray-500">
                  Base value: {baseFrequency}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add notes about this override..."
                rows={3}
                disabled={isSaving}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                {lineItem.isOverridden && onDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete Override
                  </Button>
                )}
                {lineItem.isOverridden && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetToBase}
                    disabled={isSaving}
                  >
                    Reset to Base
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
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
                  {isSaving ? 'Saving...' : 'Save Override'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

