'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/portal/DashboardLayout';
import Button from '@/components/ui/Button';
import { projectsApi, controlsApi } from '@/lib/api';

interface ProjectControl {
  id: string;
  tenant_id: string;
  project_id: string;
  control_id: string;
  is_key_override: boolean | null;
  frequency_override: string | null;
  notes: string | null;
  created_at: string;
}

interface Control {
  id: string;
  control_code: string;
  name: string;
  category: string | null;
  risk_rating: string | null;
  control_type: string | null;
  frequency: string | null;
  is_key: boolean;
  is_automated: boolean;
}

type Tab = 'overview' | 'controls';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [project, setProject] = useState<{
    id: string;
    tenant_id: string;
    created_by_membership_id: string;
    name: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
    created_at: string;
    updated_at: string;
  } | null>(null);
  const [projectControls, setProjectControls] = useState<ProjectControl[]>([]);
  const [availableControls, setAvailableControls] = useState<Control[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingControls, setIsLoadingControls] = useState(false);
  const [showAddControlModal, setShowAddControlModal] = useState(false);
  const [selectedControlId, setSelectedControlId] = useState<string>('');

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const projectData = await projectsApi.getProject(projectId);
        setProject(projectData);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        router.push('/portal/projects');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  const fetchProjectControls = async () => {
    try {
      setIsLoadingControls(true);
      const controls = await projectsApi.listProjectControls(projectId);
      setProjectControls(controls);
    } catch (error) {
      console.error('Failed to fetch project controls:', error);
    } finally {
      setIsLoadingControls(false);
    }
  };

  const fetchAvailableControls = async () => {
    try {
      const controls = await controlsApi.listControls();
      setAvailableControls(controls);
    } catch (error) {
      console.error('Failed to fetch available controls:', error);
    }
  };

  // Fetch project controls when controls tab is active
  useEffect(() => {
    if (activeTab === 'controls' && projectId) {
      fetchProjectControls();
      fetchAvailableControls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, projectId]);

  const handleAddControl = async () => {
    if (!selectedControlId) return;

    try {
      await projectsApi.addControlToProject(projectId, {
        control_id: selectedControlId,
      });
      setShowAddControlModal(false);
      setSelectedControlId('');
      await fetchProjectControls();
    } catch (error) {
      console.error('Failed to add control:', error);
      alert('Failed to add control. It may already be added to this project.');
    }
  };

  const getControlDetails = (controlId: string): Control | undefined => {
    return availableControls.find(c => c.id === controlId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading project...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">Project not found</div>
          <Button variant="secondary" onClick={() => router.push('/portal/projects')} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Filter out controls that are already in the project
  const controlsNotInProject = availableControls.filter(
    control => !projectControls.some(pc => pc.control_id === control.id)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/portal/projects')}
              className="text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">Project details and configuration</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'controls'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Controls
              {projectControls.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {projectControls.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{project.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Period</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {project.period_start && project.period_end
                        ? `${new Date(project.period_start).toLocaleDateString()} - ${new Date(project.period_end).toLocaleDateString()}`
                        : 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(project.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Project Controls</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement Apply RACM functionality
                        alert('Apply RACM functionality coming soon');
                      }}
                    >
                      + Apply RACM
                    </Button>
                    <div className="relative group">
                      <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 pointer-events-none">
                        <p>All controls with its applications in scope from the RACM will be applied to this project. You can then update those controls for this project.</p>
                        <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddControlModal(true)}
                    disabled={controlsNotInProject.length === 0}
                  >
                    + Add Control
                  </Button>
                </div>
              </div>

              {isLoadingControls ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">Loading controls...</div>
                </div>
              ) : projectControls.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500 mb-4">No controls added to this project yet.</p>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddControlModal(true)}
                    disabled={controlsNotInProject.length === 0}
                  >
                    Add Your First Control
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Control Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Frequency
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Key Control
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projectControls.map((projectControl) => {
                        const control = getControlDetails(projectControl.control_id);
                        if (!control) return null;

                        return (
                          <tr key={projectControl.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {control.control_code}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{control.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {control.category || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {control.control_type || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {projectControl.frequency_override || control.frequency || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {projectControl.is_key_override !== null
                                ? projectControl.is_key_override
                                  ? 'Yes'
                                  : 'No'
                                : control.is_key
                                ? 'Yes'
                                : 'No'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Add Control Modal */}
      {showAddControlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Control to Project</h2>
            
            {controlsNotInProject.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">All available controls are already added to this project.</p>
                <Button variant="secondary" onClick={() => setShowAddControlModal(false)}>
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
                    onChange={(e) => setSelectedControlId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choose a control...</option>
                    {controlsNotInProject.map((control) => (
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
                    onClick={() => {
                      setShowAddControlModal(false);
                      setSelectedControlId('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAddControl}
                    disabled={!selectedControlId}
                  >
                    Add Control
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
