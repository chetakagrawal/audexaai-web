'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import type { PbcRequestItemResponse } from '@/lib/api';

interface EditCheckModalProps {
  item: PbcRequestItemResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, data: {
    status?: string | null;
    notes?: string | null;
    assignee_membership_id?: string | null;
  }) => Promise<void>;
}

// Valid item statuses from backend
const ITEM_STATUSES = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'requested', label: 'Requested' },
  { value: 'received', label: 'Received' },
  { value: 'in_review', label: 'In Review' },
  { value: 'complete', label: 'Complete' },
  { value: 'exception', label: 'Exception' },
] as const;

export default function EditCheckModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditCheckModalProps) {
  const [status, setStatus] = useState<string>(item.status);
  const [notes, setNotes] = useState<string>(item.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(item.status);
      setNotes(item.notes || '');
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(item.id, {
        status: status || null,
        notes: notes || null,
        // assignee_membership_id can be added later if needed
      });
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Edit Check</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {ITEM_STATUSES.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add notes about this check..."
              />
            </div>

            {/* Snapshot info (read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Snapshot Information</h3>
              {item.effective_procedure_snapshot && (
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Effective Procedure:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {item.effective_procedure_snapshot}
                  </div>
                </div>
              )}
              {item.effective_evidence_snapshot && (
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Effective Evidence:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {item.effective_evidence_snapshot}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

