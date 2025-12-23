'use client';

import React, { useState, useEffect } from 'react';
import { projectsApi, type ProjectResponse } from '@/lib/api';
import PbcTab from '../projects/components/PbcTab';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

export default function PBCRequestsPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectsList = await projectsApi.listProjects();
      setProjects(projectsList);
      
      // Auto-select first project if available
      if (projectsList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projectsList[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to load projects'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load projects"
        message={error.message}
        showRetryButton={false}
      />
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Projects Found</h2>
        <p className="text-gray-600 mb-4">
          You need to create a project before you can manage PBC requests.
        </p>
        <a
          href="/portal/projects"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Go to Projects →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Project Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PBC Requests</h1>
          <p className="text-gray-600 mt-1">Select a project to manage PBC requests</p>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="project-select" className="text-sm font-medium text-gray-700">
            Project:
          </label>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[200px]"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PBC Tab for Selected Project */}
      {selectedProjectId && (
        <PbcTab projectId={selectedProjectId} />
      )}
    </div>
  );
}

