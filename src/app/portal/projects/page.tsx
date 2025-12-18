'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { projectsApi, controlsApi } from '@/lib/api';
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
      
      // Add all controls to the project in bulk
      await projectsApi.addControlsToProjectBulk(projectId, controlsToAdd);
      
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
      await projectsApi.deleteProjectControl(projectId, projectControlId);
      
      // Refresh the project controls list
      await fetchProjectControls(projectId);
      await fetchAvailableControls();
    } catch (error) {
      console.error('Failed to delete control:', error);
      alert('Failed to delete control. Please try again.');
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
