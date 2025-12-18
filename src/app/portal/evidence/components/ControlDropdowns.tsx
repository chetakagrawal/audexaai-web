'use client';

import React from 'react';
import { Project, Control, Application } from '../types';

interface ControlDropdownsProps {
  projects: Project[];
  controls: Control[];
  applications: Application[];
  selectedProject: string;
  selectedControl: string;
  selectedApplication: string;
  onProjectChange: (projectId: string) => void;
  onControlChange: (controlId: string) => void;
  onApplicationChange: (applicationId: string) => void;
  isLoading?: boolean;
}

export default function ControlDropdowns({
  projects,
  controls,
  applications,
  selectedProject,
  selectedControl,
  selectedApplication,
  onProjectChange,
  onControlChange,
  onApplicationChange,
  isLoading = false,
}: ControlDropdownsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Dropdown */}
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
            SOX Project
          </label>
          <select
            id="project"
            value={selectedProject}
            onChange={(e) => onProjectChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}{project.year ? ` - ${project.year}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Control Dropdown */}
        <div>
          <label htmlFor="control" className="block text-sm font-medium text-gray-700 mb-1">
            Control
          </label>
          <select
            id="control"
            value={selectedControl}
            onChange={(e) => onControlChange(e.target.value)}
            disabled={isLoading || !selectedProject}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select control...</option>
            {controls.map((control) => (
              <option key={control.id} value={control.id}>
                {control.code} - {control.name}
              </option>
            ))}
          </select>
        </div>

        {/* Application Dropdown */}
        <div>
          <label htmlFor="application" className="block text-sm font-medium text-gray-700 mb-1">
            Application
          </label>
          <select
            id="application"
            value={selectedApplication}
            onChange={(e) => onApplicationChange(e.target.value)}
            disabled={isLoading || !selectedControl}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select application...</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

