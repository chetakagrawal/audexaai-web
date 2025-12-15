'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface Project {
  id: number | string;
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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const pathname = usePathname();
  
  const handleClick = () => {
    const newPath = `/portal/projects/${project.id}`;
    // Use pushState to update URL without triggering Next.js route lookup
    window.history.pushState({}, '', newPath);
    // Dispatch custom event to notify components of the pathname change
    window.dispatchEvent(new Event('pushstate'));
  };
  const statusColors = {
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
  };

  const getInitialsColor = (initials: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.statusColor]}`}>
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{project.client}</span>
            <span>•</span>
            <span>{project.period}</span>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              project.progress === 100 ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Controls</div>
          <div className="text-lg font-semibold text-gray-900">{project.controls}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Evidence</div>
          <div className="text-lg font-semibold text-gray-900">{project.evidence}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Validated</div>
          <div className="text-lg font-semibold text-green-600">{project.validated}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Issues</div>
          <div className="text-lg font-semibold text-red-600">{project.issues}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Assigned:</span>
          <div className="flex -space-x-2">
            {project.assignedUsers.map((initials, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full ${getInitialsColor(initials)} flex items-center justify-center text-white text-xs font-semibold border-2 border-white`}
                title={initials}
              >
                {initials}
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Updated {project.lastUpdated}
        </div>
      </div>
    </div>
  );
}

