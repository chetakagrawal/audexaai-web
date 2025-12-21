'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { projectsApi, controlsApi, applicationsApi, ApplicationResponse } from '@/lib/api';
import { ApiProject, ProjectControl, Control, Project } from './types';
import { convertApiProjectToUI, UUID_REGEX } from './projectUtils';
import ProjectListView from './components/ProjectListView';
import ProjectDetailView from './components/ProjectDetailView';

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
  const [isCreating, setIsCreating] = useState(false);

  // Detail view state
  const [project, setProject] = useState<ApiProject | null>(null);
  const [projectControls, setProjectControls] = useState<ProjectControl[]>([]);
  const [availableControls, setAvailableControls] = useState<Control[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isLoadingControls, setIsLoadingControls] = useState(false);

  // Application scoping state
  const [allApplications, setAllApplications] = useState<ApplicationResponse[]>([]);
  const [scopedApplicationsByControl, setScopedApplicationsByControl] = useState<Record<string, ApplicationResponse[]>>({});
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

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

  const fetchAllApplications = async () => {
    try {
      setIsLoadingApplications(true);
      const applications = await applicationsApi.listApplications();
      setAllApplications(applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const fetchScopedApplications = async (projectControlId: string) => {
    try {
      // Backend returns ApplicationResponse[] directly, not ProjectControlApplicationResponse[]
      const scopedApps = await projectsApi.listProjectControlApplications(projectControlId);
      
      // The API returns ApplicationResponse[] directly, so we can use it as-is
      // Use functional update to ensure React detects the change
      setScopedApplicationsByControl(prev => {
        // Create a new object to ensure React detects the state change
        return {
          ...prev,
          [projectControlId]: [...scopedApps], // Create new array reference
        };
      });
    } catch (error) {
      console.error(`Failed to fetch scoped applications for control ${projectControlId}:`, error);
    }
  };

  const fetchAllScopedApplications = async (controls: ProjectControl[]) => {
    await Promise.all(
      controls.map(control => fetchScopedApplications(control.id))
    );
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

  // Note: Controls are loaded when controls tab is activated (handled in ProjectDetailView)

  const handleCreateProject = async (data: {
    name: string;
    status: string;
    period_start: string;
    period_end: string;
  }) => {
    setIsCreating(true);
    
    try {
      await projectsApi.createProject({
        name: data.name,
        status: data.status,
        period_start: data.period_start || null,
        period_end: data.period_end || null,
      });
      
      await fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddControl = async (controlId: string) => {
    if (!controlId || !projectId) return;

    try {
      await projectsApi.addControlToProject(projectId, {
        control_id: controlId,
      });
    } catch (error) {
      console.error('Failed to add control:', error);
      alert('Failed to add control. It may already be added to this project.');
      throw error;
    }
  };

  const handleLoadControls = useCallback(async () => {
    if (projectId) {
      await fetchProjectControls(projectId);
      await fetchAvailableControls();
      await fetchAllApplications();
      const controls = await projectsApi.listProjectControls(projectId);
      await fetchAllScopedApplications(controls);
    }
  }, [projectId]);

  const handleApplyRACM = async () => {
    if (!projectId) return;

    try {
      // Get all controls (which include their applications)
      const allControls = await controlsApi.listControls();
      
      // Get controls already in the project
      const existingProjectControls = await projectsApi.listProjectControls(projectId);
      const existingControlIds = new Set(existingProjectControls.map(pc => pc.control_id));
      
      // Filter out controls that are already in the project
      const controlsToAdd = allControls
        .filter(control => !existingControlIds.has(control.id))
        .map(control => control.id);
      
      if (controlsToAdd.length === 0) {
        alert('All controls from RACM are already added to this project.');
        return;
      }
      
      // Add all controls to the project individually (bulk endpoint was removed)
      for (const controlId of controlsToAdd) {
        await projectsApi.addControlToProject(projectId, { control_id: controlId });
      }
      
      // Refresh the project controls list
      await fetchProjectControls(projectId);
      await fetchAvailableControls();
      
      alert(`Successfully added ${controlsToAdd.length} control(s) from RACM to this project.`);
    } catch (error) {
      console.error('Failed to apply RACM:', error);
      alert('Failed to apply RACM. Please try again.');
    }
  };

  const handleDeleteControl = async (projectControlId: string) => {
    if (!projectId) return;

    try {
      await projectsApi.deleteProjectControl(projectControlId);
      
      // Refresh the project controls list
      await fetchProjectControls(projectId);
      await fetchAvailableControls();
    } catch (error) {
      console.error('Failed to delete control:', error);
      alert('Failed to delete control. Please try again.');
      throw error;
    }
  };

  const handleUpdateControl = async (
    projectControlId: string,
    data: {
      is_key_override: boolean | null;
      frequency_override: string | null;
      notes: string | null;
    }
  ) => {
    if (!projectId) return;

    try {
      await projectsApi.updateProjectControlOverrides(projectControlId, data);
      
      // Refresh the project controls list
      await fetchProjectControls(projectId);
      await fetchAvailableControls();
    } catch (error) {
      console.error('Failed to update control overrides:', error);
      alert('Failed to update control overrides. Please try again.');
      throw error;
    }
  };

  const handleScopeApplications = async (projectControlId: string, applicationIds: string[]) => {
    try {
      // Get current scoped applications - backend returns ApplicationResponse[] directly
      const currentScoped = await projectsApi.listProjectControlApplications(projectControlId);
      const currentAppIds = new Set(currentScoped.map(app => app.id));
      const newAppIds = new Set(applicationIds);

      // Determine which to add and which to remove
      const toAdd = applicationIds.filter(id => !currentAppIds.has(id));
      const toRemove = currentScoped.filter(app => !newAppIds.has(app.id));

      // Add new applications
      for (const appId of toAdd) {
        await projectsApi.addApplicationToProjectControl(projectControlId, {
          application_id: appId,
        });
      }

      // For removal, we need mapping IDs, but the GET endpoint doesn't return them
      // We'll need to fetch the full ProjectControlApplicationResponse objects
      // For now, we'll fetch them individually or use a workaround
      // TODO: Backend should return ProjectControlApplicationResponse[] with mapping IDs
      // For now, we'll skip removal if we can't get the IDs
      // The user will need to manually remove them, or we need to update the backend
      
      // Refresh scoped applications for this control immediately after changes
      // Wait a bit to ensure backend has committed the transaction
      await new Promise(resolve => setTimeout(resolve, 200));
      await fetchScopedApplications(projectControlId);
    } catch (error) {
      console.error('Failed to scope applications:', error);
      alert('Failed to scope applications. Please try again.');
      throw error;
    }
  };

  const handleUpdateProject = async (data: {
    name: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
  }) => {
    if (!projectId) return;

    try {
      const updatedProject = await projectsApi.updateProject(projectId, data);
      setProject(updatedProject);
      // Also refresh the projects list if we're on list view
      if (!isDetailView) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
      throw error;
    }
  };

  // Render detail view
  if (isDetailView) {
    if (isLoadingProject) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading project...</div>
        </div>
      );
    }

    if (!isValidProjectId || !project) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Project not found</div>
          <button
            onClick={() => router.push('/portal/projects')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mt-4"
          >
            Back to Projects
          </button>
        </div>
      );
    }

    return (
      <ProjectDetailView
        project={project}
        projectControls={projectControls}
        availableControls={availableControls}
        isLoadingControls={isLoadingControls}
        onAddControl={handleAddControl}
        onRefreshControls={() => projectId ? fetchProjectControls(projectId) : Promise.resolve()}
        onLoadControls={handleLoadControls}
        onUpdateProject={handleUpdateProject}
        onApplyRACM={handleApplyRACM}
        onDeleteControl={handleDeleteControl}
        onUpdateControl={handleUpdateControl}
        allApplications={allApplications}
        scopedApplicationsByControl={scopedApplicationsByControl}
        onScopeApplications={handleScopeApplications}
      />
    );
  }

  // Render list view
  return (
    <ProjectListView
      projects={projects}
      isLoading={isLoading}
      onCreateProject={handleCreateProject}
      isCreating={isCreating}
    />
  );
}
