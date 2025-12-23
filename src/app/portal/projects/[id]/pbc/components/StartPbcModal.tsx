'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import type { PbcRequestResponse } from '@/lib/api';

interface StartPbcModalProps {
  pbcRequest: PbcRequestResponse;
  isOpen: boolean;
  onClose: () => void;
  onStart: (data: {
    due_date?: string | null;
    instructions?: string | null;
    applyToAllChecks: boolean;
  }) => Promise<void>;
}

export default function StartPbcModal({
  pbcRequest,
  isOpen,
  onClose,
  onStart,
}: StartPbcModalProps) {
  const [dueDate, setDueDate] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [applyToAllChecks, setApplyToAllChecks] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initialize with existing values
      setDueDate(pbcRequest.due_date ? pbcRequest.due_date.split('T')[0] : '');
      setInstructions(pbcRequest.instructions || '');
      setApplyToAllChecks(true);
    }
  }, [isOpen, pbcRequest]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onStart({
        due_date: dueDate || null,
        instructions: instructions || null,
        applyToAllChecks,
      });
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Start PBC Request</h2>
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
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Instructions for this PBC request..."
              />
            </div>

            {/* Apply to all checks toggle */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={applyToAllChecks}
                  onChange={(e) => setApplyToAllChecks(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Apply to all checks (recommended)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                When enabled, all checks in this request will be marked as "requested"
              </p>
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
                {isSubmitting ? 'Starting...' : 'Start Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

