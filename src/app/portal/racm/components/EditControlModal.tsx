'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { ControlFormData, Control } from '../types';

interface EditControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ControlFormData) => Promise<void>;
  control: Control;
  isSaving: boolean;
}

export default function EditControlModal({
  isOpen,
  onClose,
  onSubmit,
  control,
  isSaving,
}: EditControlModalProps) {
  const [formData, setFormData] = useState<ControlFormData>({
    control_code: control.controlCode,
    name: control.name,
    description: control.description || '',
    category: control.category,
    risk_rating: control.riskRating,
    control_type: control.type,
    frequency: control.frequency,
    is_key: control.isKeyControl,
    is_automated: control.isAutomated,
  });

  // Update form data when control changes
  useEffect(() => {
    setFormData({
      control_code: control.controlCode,
      name: control.name,
      description: control.description || '',
      category: control.category,
      risk_rating: control.riskRating,
      control_type: control.type,
      frequency: control.frequency,
      is_key: control.isKeyControl,
      is_automated: control.isAutomated,
    });
  }, [control]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleClose = () => {
    // Reset form to original values
    setFormData({
      control_code: control.controlCode,
      name: control.name,
      description: control.description || '',
      category: control.category,
      risk_rating: control.riskRating,
      control_type: control.type,
      frequency: control.frequency,
      is_key: control.isKeyControl,
      is_automated: control.isAutomated,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Control</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="control_code" className="block text-sm font-medium text-gray-700 mb-1">
                Control Code *
              </label>
              <input
                type="text"
                id="control_code"
                required
                value={formData.control_code}
                onChange={(e) => setFormData({ ...formData, control_code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., AC-001"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Control Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., User Access Provisioning"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter a detailed description of the control"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Access to Programs and Data"
              />
            </div>
            <div>
              <label htmlFor="risk_rating" className="block text-sm font-medium text-gray-700 mb-1">
                Risk Rating
              </label>
              <select
                id="risk_rating"
                value={formData.risk_rating}
                onChange={(e) => setFormData({ ...formData, risk_rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select risk rating</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="control_type" className="block text-sm font-medium text-gray-700 mb-1">
                Control Type
              </label>
              <select
                id="control_type"
                value={formData.control_type}
                onChange={(e) => setFormData({ ...formData, control_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select type</option>
                <option value="Preventive">Preventive</option>
                <option value="Detective">Detective</option>
                <option value="Corrective">Corrective</option>
              </select>
            </div>
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
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

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_key}
                onChange={(e) => setFormData({ ...formData, is_key: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Key Control</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_automated}
                onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Automated</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving || !formData.control_code.trim() || !formData.name.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

