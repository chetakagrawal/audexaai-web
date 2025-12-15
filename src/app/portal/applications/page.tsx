'use client';

import React, { useState, useEffect } from 'react';
import MetricCard from '@/components/portal/MetricCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { applicationsApi, authApi } from '@/lib/api';

interface Application {
  id: string;
  name: string;
  category: string | null;
  scope_rationale: string | null;
  business_owner_membership_id: string;
  it_owner_membership_id: string;
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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    scope_rationale: '',
    business_owner_membership_id: '',
    it_owner_membership_id: '',
  });

  // Fetch applications and memberships
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [appsData, membershipsData] = await Promise.all([
          applicationsApi.listApplications(),
          authApi.getTenantMemberships(),
        ]);
        setApplications(appsData);
        setMemberships(membershipsData);
        
        // Set default membership IDs if available
        if (membershipsData.length > 0) {
          const defaultMembership = membershipsData.find(m => m.is_default) || membershipsData[0];
          setFormData(prev => ({
            ...prev,
            business_owner_membership_id: defaultMembership.id,
            it_owner_membership_id: defaultMembership.id,
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newApplication = await applicationsApi.createApplication({
        name: formData.name,
        category: formData.category || null,
        scope_rationale: formData.scope_rationale || null,
        business_owner_membership_id: formData.business_owner_membership_id,
        it_owner_membership_id: formData.it_owner_membership_id,
      });

      // Add the new application to the list
      setApplications([...applications, newApplication]);
      
      // Reset form and close modal
      setFormData({
        name: '',
        category: '',
        scope_rationale: '',
        business_owner_membership_id: memberships.find(m => m.is_default)?.id || memberships[0]?.id || '',
        it_owner_membership_id: memberships.find(m => m.is_default)?.id || memberships[0]?.id || '',
      });
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
      console.error('Error creating application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryBadgeColor = (category: string | null) => {
    if (!category) return 'info';
    if (category === 'Core Financial System') return 'info';
    if (category === 'Infrastructure') return 'success';
    if (category === 'Development Environments') return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IT Application Scope</h1>
            <p className="text-gray-600 mt-1">Master inventory of applications in scope for SOX IT General Controls.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Export Applications
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              + Add Application
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Application-Control Mapping</h3>
              <p className="text-sm text-blue-800">
                This view shows all applications in scope and their associated SOX IT General Controls. Changes here automatically sync with the RACM. Note: The scope rationale explains why each application is included in SOX compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
            value={applications.length.toString()}
            label="Total Applications"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            }
            value={applications.filter(app => app.category === 'Core Financial System').length.toString()}
            label="Core Financial Systems"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
            }
            value={applications.filter(app => app.category === 'Infrastructure').length.toString()}
            label="Infrastructure"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            }
            value={applications.filter(app => app.category === 'Development Environments').length.toString()}
            label="Development Environments"
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search applications, owners, or rationale..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Categories</option>
            <option>Core Financial System</option>
            <option>Financial-Significant System</option>
            <option>Infrastructure</option>
            <option>Reporting System</option>
            <option>Custom Development</option>
            <option>Integration</option>
            <option>Development Environments</option>
          </select>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Application Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Business Process Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    IT Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Scope Rationale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No applications found. Click "+ Add Application" to create one.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="font-medium text-gray-900">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.category && (
                          <Badge variant={getCategoryBadgeColor(app.category) as 'info' | 'success' | 'warning'}>
                            {app.category}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {memberships.find(m => m.id === app.business_owner_membership_id)?.user_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {memberships.find(m => m.id === app.business_owner_membership_id)?.role || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {memberships.find(m => m.id === app.it_owner_membership_id)?.user_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {memberships.find(m => m.id === app.it_owner_membership_id)?.role || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-md">{app.scope_rationale || '—'}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Add New Application</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    Business Process Owner *
                  </label>
                  <select
                    required
                    value={formData.business_owner_membership_id}
                    onChange={(e) => setFormData({ ...formData, business_owner_membership_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
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
                    IT Owner *
                  </label>
                  <select
                    required
                    value={formData.it_owner_membership_id}
                    onChange={(e) => setFormData({ ...formData, it_owner_membership_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
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
                    onClick={() => setShowAddModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Application'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
