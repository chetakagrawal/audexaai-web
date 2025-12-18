'use client';

import React, { useState, useEffect } from 'react';
import {
  Project,
  Control,
  Application,
  ControlMetadata,
  TestingProgress,
  TabType,
  EvidenceFile,
} from './types';
import { projectsApi, controlsApi } from '@/lib/api';
import ControlDropdowns from './components/ControlDropdowns';
import ControlAccordion from './components/ControlAccordion';
import ControlMetadataComponent from './components/ControlMetadata';
import TestingProgressComponent from './components/TestingProgress';
import EvidenceTabs from './components/EvidenceTabs';
import FileUploadArea from './components/FileUploadArea';
import UploadedFilesTable from './components/UploadedFilesTable';

export default function EvidencePage() {
  // State for data
  const [projects, setProjects] = useState<Project[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Loading states
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingControls, setIsLoadingControls] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockMetadata: ControlMetadata = {
    preparer: { id: '1', name: 'John Doe' },
    preparedDate: '07/20/2025',
    reviewers: [
      { id: '1', name: 'Jane Smith' },
      { id: '2', name: 'Alex Johnson' },
    ],
    status: 'Draft',
  };

  const mockProgress: TestingProgress = {
    l1: 75,
    l2: 50,
    l3: 25,
    l4: 0,
  };

  // State management
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedControl, setSelectedControl] = useState('');
  const [selectedApplication, setSelectedApplication] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('evidence');
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Find selected control
  const currentControl = controls.find((c) => c.id === selectedControl) || null;

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch controls when project changes
  useEffect(() => {
    if (selectedProject) {
      fetchControlsForProject(selectedProject);
      // Reset control and application selections
      setSelectedControl('');
      setSelectedApplication('');
      setApplications([]);
    } else {
      setControls([]);
      setSelectedControl('');
      setSelectedApplication('');
      setApplications([]);
    }
  }, [selectedProject]);

  // Fetch applications when control changes
  useEffect(() => {
    if (selectedControl) {
      fetchApplicationsForControl(selectedControl);
      // Reset application selection
      setSelectedApplication('');
    } else {
      setApplications([]);
      setSelectedApplication('');
    }
  }, [selectedControl]);

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setError(null);
      const apiProjects = await projectsApi.listProjects();
      
      // Transform API projects to our Project type
      const transformedProjects: Project[] = apiProjects.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        period_start: p.period_start,
        period_end: p.period_end,
        // Derive year from name or period if available
        year: p.name.includes('FY') ? p.name.split('FY')[1]?.trim() : undefined,
      }));
      
      setProjects(transformedProjects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const fetchControlsForProject = async (projectId: string) => {
    try {
      setIsLoadingControls(true);
      setError(null);
      
      // Get project controls (returns control_ids)
      const projectControls = await projectsApi.listProjectControls(projectId);
      
      if (projectControls.length === 0) {
        setControls([]);
        return;
      }

      // Fetch full control details for each control_id
      const controlDetails = await Promise.all(
        projectControls.map(async (pc) => {
          try {
            const control = await controlsApi.getControl(pc.control_id);
            return {
              id: control.id,
              code: control.control_code,
              name: control.name,
              description: control.category || undefined,
              riskRating: (control.risk_rating as 'High' | 'Medium' | 'Low') || null,
              controlType: (control.control_type as 'Preventive' | 'Detective' | 'Corrective') || null,
              frequency: control.frequency,
              isKey: control.is_key,
              isAutomated: control.is_automated,
              category: control.category,
            };
          } catch (err) {
            console.error(`Failed to fetch control ${pc.control_id}:`, err);
            return null;
          }
        })
      );

      // Filter out any null results
      const validControls = controlDetails.filter((c): c is Control => c !== null);
      setControls(validControls);
    } catch (err) {
      console.error('Failed to fetch controls:', err);
      setError(err instanceof Error ? err.message : 'Failed to load controls');
      setControls([]);
    } finally {
      setIsLoadingControls(false);
    }
  };

  const fetchApplicationsForControl = async (controlId: string) => {
    try {
      setIsLoadingApplications(true);
      setError(null);
      
      // Get control details which includes applications
      const control = await controlsApi.getControl(controlId);
      
      // Transform applications to our Application type
      const transformedApplications: Application[] = control.applications.map((app) => ({
        id: app.id,
        name: app.name,
      }));
      
      setApplications(transformedApplications);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load applications');
      setApplications([]);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  // Handlers
  const handleFilesSelected = async (selectedFiles: File[]) => {
    console.log('Files selected:', selectedFiles);
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Mock adding files to the table
      const newFiles: EvidenceFile[] = selectedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        fileName: file.name,
        source: 'PBC-004',
        uploadedBy: 'Client Portal',
        uploadedDate: new Date().toISOString().split('T')[0],
        status: 'Needs Review',
        autoMapped: false,
      }));
      
      setFiles([...files, ...newFiles]);
      setIsUploading(false);
    }, 2000);
  };

  const handleViewFile = (file: EvidenceFile) => {
    console.log('View file:', file);
    // TODO: Implement file viewer
  };

  const handleDeleteFile = (file: EvidenceFile) => {
    console.log('Delete file:', file);
    // TODO: Implement delete functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Evidence</h1>
        <p className="text-gray-600 mt-1">
          Upload and manage evidence for control testing
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-red-900">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Control Selection Dropdowns */}
      <ControlDropdowns
        projects={projects}
        controls={controls}
        applications={applications}
        selectedProject={selectedProject}
        selectedControl={selectedControl}
        selectedApplication={selectedApplication}
        onProjectChange={setSelectedProject}
        onControlChange={setSelectedControl}
        onApplicationChange={setSelectedApplication}
        isLoading={isLoadingProjects || isLoadingControls || isLoadingApplications}
      />

      {/* Control Information Accordion */}
      {currentControl && <ControlAccordion control={currentControl} />}

      {/* Control Metadata */}
      <ControlMetadataComponent metadata={mockMetadata} />

      {/* Testing Progress */}
      <TestingProgressComponent progress={mockProgress} />

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <EvidenceTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              {/* Info Banner */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-purple-900 mb-1">
                      Automatic Evidence Ingestion Active
                    </h4>
                    <p className="text-sm text-purple-800">
                      Evidence uploaded via PBC requests is automatically tagged to corresponding controls
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <FileUploadArea 
                onFilesSelected={handleFilesSelected}
                isUploading={isUploading}
              />

              {/* Uploaded Files Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Evidence</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <UploadedFilesTable
                    files={files}
                    onViewFile={handleViewFile}
                    onDeleteFile={handleDeleteFile}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'l1-extraction' && (
            <div className="text-center py-12 text-gray-500">
              AI L1: Extraction - Coming soon
            </div>
          )}

          {activeTab === 'l2-analysis' && (
            <div className="text-center py-12 text-gray-500">
              AI L2: Analysis - Coming soon
            </div>
          )}

          {activeTab === 'l3-test-attributes' && (
            <div className="text-center py-12 text-gray-500">
              AI L3: Test Attributes - Coming soon
            </div>
          )}

          {activeTab === 'l4-summary' && (
            <div className="text-center py-12 text-gray-500">
              AI L4: Summary - Coming soon
            </div>
          )}

          {activeTab === 'findings' && (
            <div className="text-center py-12 text-gray-500">
              Findings - Coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

