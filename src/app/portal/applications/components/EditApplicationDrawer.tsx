'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface Application {
  id: string;
  name: string;
  category: string | null;
  scope_rationale: string | null;
  business_owner_membership_id: string | null;
  it_owner_membership_id: string | null;
  created_at: string;
}

interface Membership {
  id: string;
  user_id: string;
  tenant_id: string;
  role: string;
  is_default: boolean;
  user_name: string;
  user_email: string;
  created_at: string;
}

interface EditApplicationDrawerProps {
  application: Application | null;
  memberships: Membership[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (applicationId: string, data: {
    name?: string | null;
    category?: string | null;
    scope_rationale?: string | null;
    business_owner_membership_id?: string | null;
    it_owner_membership_id?: string | null;
  }) => Promise<void>;
}

export default function EditApplicationDrawer({
  application,
  memberships,
  isOpen,
  onClose,
  onSave,
}: EditApplicationDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    scope_rationale: '',
    business_owner_membership_id: '',
    it_owner_membership_id: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form data when application changes
  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name || '',
        category: application.category || '',
        scope_rationale: application.scope_rationale || '',
        business_owner_membership_id: application.business_owner_membership_id || '',
        it_owner_membership_id: application.it_owner_membership_id || '',
      });
      setError(null);
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSave(application.id, {
        name: formData.name || null,
        category: formData.category || null,
        scope_rationale: formData.scope_rationale || null,
        business_owner_membership_id: formData.business_owner_membership_id || null,
        it_owner_membership_id: formData.it_owner_membership_id || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!isOpen || !application) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Edit Application</h2>
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., SAP ERP"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isSaving}
                >
                  <option value="">Select a category</option>
                  <option value="Core Financial System">Core Financial System</option>
                  <option value="Financial-Significant System">Financial-Significant System</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Reporting System">Reporting System</option>
                  <option value="Custom Development">Custom Development</option>
                  <option value="Integration">Integration</option>
                  <option value="Development Environments">Development Environments</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Process Owner
                </label>
                <select
                  value={formData.business_owner_membership_id}
                  onChange={(e) => setFormData({ ...formData, business_owner_membership_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isSaving}
                >
                  <option value="">Select a business process owner (optional)</option>
                  {memberships.length === 0 ? (
                    <option value="">No memberships available</option>
                  ) : (
                    memberships.map((membership) => (
                      <option key={membership.id} value={membership.id}>
                        {membership.user_name} ({membership.user_email}) - {membership.role} {membership.is_default && '(Default)'}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IT Owner
                </label>
                <select
                  value={formData.it_owner_membership_id}
                  onChange={(e) => setFormData({ ...formData, it_owner_membership_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isSaving}
                >
                  <option value="">Select an IT owner (optional)</option>
                  {memberships.length === 0 ? (
                    <option value="">No memberships available</option>
                  ) : (
                    memberships.map((membership) => (
                      <option key={membership.id} value={membership.id}>
                        {membership.user_name} ({membership.user_email}) - {membership.role} {membership.is_default && '(Default)'}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope Rationale
                </label>
                <textarea
                  value={formData.scope_rationale}
                  onChange={(e) => setFormData({ ...formData, scope_rationale: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Explain why this application is included in SOX compliance..."
                  disabled={isSaving}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
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
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

