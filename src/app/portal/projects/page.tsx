'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/portal/DashboardLayout';
import MetricCard from '@/components/portal/MetricCard';
import ProjectCard from '@/components/portal/ProjectCard';
import Button from '@/components/ui/Button';
import { projectsApi, controlsApi } from '@/lib/api';

interface ApiProject {
  id: string;
  tenant_id: string;
  created_by_membership_id: string;
  name: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string | number;
  name: string;
  status: string;
  statusColor: 'blue' | 'orange' | 'green';
  client: string;
  period: string;
  progress: number;
  controls: number;
  evidence: number;
  validated: number;
  issues: number;
  assignedUsers: string[];
  lastUpdated: string;
}

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

// Helper to convert API project to UI project
const convertApiProjectToUI = (apiProject: ApiProject): Project => {
  const getStatusColor = (status: string): 'blue' | 'orange' | 'green' => {
    if (status === 'active') return 'blue';
    if (status === 'in_review' || status === 'in review') return 'orange';
    if (status === 'complete') return 'green';
    return 'blue'; // default
  };

  const formatPeriod = (start: string | null, end: string | null): string => {
    if (!start && !end) return 'No period set';
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (start) {
      return `From ${new Date(start).toLocaleDateString()}`;
    }
    return `Until ${new Date(end!).toLocaleDateString()}`;
  };

  const formatLastUpdated = (updatedAt: string): string => {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  return {
    id: apiProject.id,
    name: apiProject.name,
    status: apiProject.status.charAt(0).toUpperCase() + apiProject.status.slice(1).replace(/_/g, ' '),
    statusColor: getStatusColor(apiProject.status),
    client: 'Current Tenant',
    period: formatPeriod(apiProject.period_start, apiProject.period_end),
    progress: 0,
    controls: 0,
    evidence: 0,
    validated: 0,
    issues: 0,
    assignedUsers: [],
    lastUpdated: formatLastUpdated(apiProject.updated_at),
  };
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ProjectsPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Track current pathname including manual updates via pushState
  const [currentPath, setCurrentPath] = useState(pathname || (typeof window !== 'undefined' ? window.location.pathname : ''));
  
  // Listen for pathname changes (including pushState)
  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', updatePath);
    // Also listen for custom navigation events
    window.addEventListener('pushstate', updatePath);
    window.addEventListener('replacestate', updatePath);
    
    // Check for pathname changes periodically (fallback)
    const interval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        updatePath();
      }
    }, 100);
    
    return () => {
      window.removeEventListener('popstate', updatePath);
      window.removeEventListener('pushstate', updatePath);
      window.removeEventListener('replacestate', updatePath);
      clearInterval(interval);
    };
  }, [currentPath]);
  
  // Also update when Next.js pathname changes
  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);
  
  // Extract project ID from current path if on detail view
  const projectIdMatch = currentPath?.match(/^\/portal\/projects\/([^/]+)$/);
  const projectId = projectIdMatch ? projectIdMatch[1] : null;
  const isDetailView = projectId !== null;
  const isValidProjectId = projectId && UUID_REGEX.test(projectId);

  // List view state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'draft',
    period_start: '',
    period_end: '',
  });

  // Detail view state
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [project, setProject] = useState<ApiProject | null>(null);
  const [projectControls, setProjectControls] = useState<ProjectControl[]>([]);
  const [availableControls, setAvailableControls] = useState<Control[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isLoadingControls, setIsLoadingControls] = useState(false);
  const [showAddControlModal, setShowAddControlModal] = useState(false);
  const [selectedControlId, setSelectedControlId] = useState<string>('');

  // Fetch projects list
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const apiProjects = await projectsApi.listProjects();
      const uiProjects = apiProjects.map(convertApiProjectToUI);
      setProjects(uiProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch project details
  const fetchProject = async (id: string) => {
    try {
      setIsLoadingProject(true);
      const projectData = await projectsApi.getProject(id);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      setProject(null);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const fetchProjectControls = async (id: string) => {
    try {
      setIsLoadingControls(true);
      const controls = await projectsApi.listProjectControls(id);
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

  // Load projects list when on list view
  useEffect(() => {
    if (!isDetailView) {
      fetchProjects();
    }
  }, [isDetailView]);

  // Load project details when on detail view
  useEffect(() => {
    if (isDetailView && isValidProjectId && projectId) {
      fetchProject(projectId);
    } else if (isDetailView && !isValidProjectId) {
      setProject(null);
    }
  }, [isDetailView, isValidProjectId, projectId]);

  // Load project controls when controls tab is active
  useEffect(() => {
    if (activeTab === 'controls' && projectId && isValidProjectId) {
      fetchProjectControls(projectId);
      fetchAvailableControls();
    }
  }, [activeTab, projectId, isValidProjectId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      await projectsApi.createProject({
        name: formData.name,
        status: formData.status,
        period_start: formData.period_start || null,
        period_end: formData.period_end || null,
      });
      
      setFormData({ name: '', status: 'draft', period_start: '', period_end: '' });
      setShowCreateModal(false);
      await fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddControl = async () => {
    if (!selectedControlId || !projectId) return;

    try {
      await projectsApi.addControlToProject(projectId, {
        control_id: selectedControlId,
      });
      setShowAddControlModal(false);
      setSelectedControlId('');
      if (projectId) {
        await fetchProjectControls(projectId);
      }
    } catch (error) {
      console.error('Failed to add control:', error);
      alert('Failed to add control. It may already be added to this project.');
    }
  };

  const getControlDetails = (controlId: string): Control | undefined => {
    return availableControls.find(c => c.id === controlId);
  };

  // Render detail view
  if (isDetailView) {
    if (isLoadingProject) {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <div className="text-gray-500">Loading project...</div>
          </div>
        </DashboardLayout>
      );
    }

    if (!isValidProjectId || !project) {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Project not found</div>
            <Button variant="secondary" onClick={() => router.push('/portal/projects')} className="mt-4">
              Back to Projects
            </Button>
          </div>
        </DashboardLayout>
      );
    }

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

  // Render list view
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your audit engagements.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowCreateModal(true)}
            >
              + New Project
            </Button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Status</option>
              <option>Active</option>
              <option>In Review</option>
              <option>Complete</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects or clients..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            }
            value={projects.length.toString()}
            label="Total Projects"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            }
            value={projects.filter(p => p.status.toLowerCase() === 'active').length.toString()}
            label="Active Projects"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
            value="531"
            label="Total Controls"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            }
            value="16"
            label="Open Issues"
          />
        </div>

        {/* Project Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No projects yet. Create your first project to get started.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Q4 2024 SOX Audit"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="in_review">In Review</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="period_start" className="block text-sm font-medium text-gray-700 mb-1">
                    Period Start
                  </label>
                  <input
                    type="date"
                    id="period_start"
                    value={formData.period_start}
                    onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="period_end" className="block text-sm font-medium text-gray-700 mb-1">
                    Period End
                  </label>
                  <input
                    type="date"
                    id="period_end"
                    value={formData.period_end}
                    onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', status: 'draft', period_start: '', period_end: '' });
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isCreating || !formData.name.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
