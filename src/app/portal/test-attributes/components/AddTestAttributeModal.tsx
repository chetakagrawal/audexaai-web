'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { TestAttributeCreate } from '@/lib/api';

interface AddTestAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TestAttributeCreate) => Promise<void>;
  isSubmitting: boolean;
  controlCode?: string;
  controlName?: string;
}

export default function AddTestAttributeModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  controlCode,
  controlName,
}: AddTestAttributeModalProps) {
  const [formData, setFormData] = useState<TestAttributeCreate>({
    code: '',
    name: '',
    frequency: null,
    test_procedure: null,
    expected_evidence: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form
    setFormData({
      code: '',
      name: '',
      frequency: null,
      test_procedure: null,
      expected_evidence: null,
    });
  };

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      frequency: null,
      test_procedure: null,
      expected_evidence: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Test Attribute</h2>
        {(controlCode || controlName) && (
          <p className="text-sm text-gray-600 mb-4">
            For: {controlCode && <span className="font-semibold">{controlCode}</span>}
            {controlCode && controlName && ' - '}
            {controlName}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Test Attribute Code *
              </label>
              <input
                type="text"
                id="code"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., TA-AC-01-01"
              />
            </div>
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                id="frequency"
                value={formData.frequency || ''}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select frequency</option>
                <option value="Continuous">Continuous</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Test Attribute Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Quarterly Access Review Completion"
            />
          </div>

          <div>
            <label htmlFor="test_procedure" className="block text-sm font-medium text-gray-700 mb-1">
              Test Procedure
            </label>
            <textarea
              id="test_procedure"
              rows={4}
              value={formData.test_procedure || ''}
              onChange={(e) => setFormData({ ...formData, test_procedure: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the test procedure..."
            />
          </div>

          <div>
            <label htmlFor="expected_evidence" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Evidence
            </label>
            <textarea
              id="expected_evidence"
              rows={4}
              value={formData.expected_evidence || ''}
              onChange={(e) => setFormData({ ...formData, expected_evidence: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the expected evidence..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !formData.code.trim() || !formData.name.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Test Attribute'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

