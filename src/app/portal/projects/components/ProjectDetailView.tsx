'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ApiProject, ProjectControl, Control, Tab } from '../types';
import ProjectOverviewTab from './ProjectOverviewTab';
import ProjectControlsTab from './ProjectControlsTab';
import AddControlModal from './AddControlModal';
import EditProjectModal from './EditProjectModal';

interface ProjectDetailViewProps {
  project: ApiProject;
  projectControls: ProjectControl[];
  availableControls: Control[];
  isLoadingControls: boolean;
  onAddControl: (controlId: string) => Promise<void>;
  onRefreshControls: () => Promise<void>;
  onLoadControls: () => Promise<void>;
  onUpdateProject: (data: {
    name: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
  }) => Promise<void>;
}

export default function ProjectDetailView({
  project,
  projectControls,
  availableControls,
  isLoadingControls,
  onAddControl,
  onRefreshControls,
  onLoadControls,
  onUpdateProject,
}: ProjectDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showAddControlModal, setShowAddControlModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [selectedControlId, setSelectedControlId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const controlsLoadedRef = useRef(false);

  // Load controls when controls tab is activated (only once per tab activation)
  useEffect(() => {
    if (activeTab === 'controls' && !controlsLoadedRef.current && !isLoadingControls) {
      controlsLoadedRef.current = true;
      onLoadControls();
    }
    // Reset the ref when switching away from controls tab
    if (activeTab !== 'controls') {
      controlsLoadedRef.current = false;
    }
  }, [activeTab, onLoadControls, isLoadingControls]);

  const controlsNotInProject = availableControls.filter(
    control => !projectControls.some(pc => pc.control_id === control.id)
  );

  const getControlDetails = (controlId: string): Control | undefined => {
    return availableControls.find(c => c.id === controlId);
  };

  const handleAddControlSubmit = async (controlId: string) => {
    await onAddControl(controlId);
    setShowAddControlModal(false);
    setSelectedControlId('');
    await onRefreshControls();
  };

  const handleUpdateProject = async (data: {
    name: string;
    status: string;
    period_start: string | null;
    period_end: string | null;
  }) => {
    setIsSaving(true);
    try {
      await onUpdateProject(data);
      setShowEditProjectModal(false);
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
          <button
            onClick={() => setShowEditProjectModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Edit Project
          </button>
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
          {activeTab === 'overview' && <ProjectOverviewTab project={project} />}
          {activeTab === 'controls' && (
            <ProjectControlsTab
              projectControls={projectControls}
              controlsNotInProject={controlsNotInProject}
              isLoadingControls={isLoadingControls}
              onAddControl={() => setShowAddControlModal(true)}
              onApplyRACM={() => alert('Apply RACM functionality coming soon')}
              getControlDetails={getControlDetails}
            />
          )}
        </div>
      </div>

      {/* Add Control Modal */}
      <AddControlModal
        isOpen={showAddControlModal}
        onClose={() => {
          setShowAddControlModal(false);
          setSelectedControlId('');
        }}
        onSubmit={handleAddControlSubmit}
        availableControls={controlsNotInProject}
        selectedControlId={selectedControlId}
        onSelectControl={setSelectedControlId}
        isSubmitting={false}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={project}
        isOpen={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
        onSave={handleUpdateProject}
        isSaving={isSaving}
      />
    </>
  );
}
