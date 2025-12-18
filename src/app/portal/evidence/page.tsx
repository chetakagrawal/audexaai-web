'use client';

import React, { useState } from 'react';
import {
  Project,
  Control,
  Application,
  ControlMetadata,
  TestingProgress,
  TabType,
  EvidenceFile,
} from './types';
import ControlDropdowns from './components/ControlDropdowns';
import ControlAccordion from './components/ControlAccordion';
import ControlMetadataComponent from './components/ControlMetadata';
import TestingProgressComponent from './components/TestingProgress';
import EvidenceTabs from './components/EvidenceTabs';
import FileUploadArea from './components/FileUploadArea';
import UploadedFilesTable from './components/UploadedFilesTable';

export default function EvidencePage() {
  // Mock data - will be replaced with backend API calls
  const mockProjects: Project[] = [
    { id: '1', name: 'SOX FY2025', year: 'Round 1' },
    { id: '2', name: 'SOX FY2024', year: 'Round 2' },
  ];

  const mockControls: Control[] = [
    {
      id: '1',
      code: 'ITGC-01',
      name: 'User Access Provisioning',
      description: 'Controls for managing user access provisioning and de-provisioning processes',
      riskRating: 'High',
      controlType: 'Preventive',
      frequency: 'Quarterly',
      isKey: true,
      isAutomated: false,
    },
    {
      id: '2',
      code: 'ITGC-02',
      name: 'Change Management',
      description: 'Controls for managing changes to IT systems and applications',
      riskRating: 'Medium',
      controlType: 'Preventive',
      frequency: 'Monthly',
      isKey: false,
      isAutomated: true,
    },
  ];

  const mockApplications: Application[] = [
    { id: '1', name: 'SAP ERP' },
    { id: '2', name: 'Salesforce' },
    { id: '3', name: 'Workday' },
  ];

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

  const mockFiles: EvidenceFile[] = [
    {
      id: '1',
      fileName: 'Sample_Selection_25.xlsx',
      source: 'PBC-001',
      uploadedBy: 'Client Portal',
      uploadedDate: '2025-01-10',
      status: 'Processed',
      autoMapped: true,
    },
    {
      id: '2',
      fileName: 'User_Access_Report_Q3.xlsx',
      source: 'PBC-002',
      uploadedBy: 'Client Portal',
      uploadedDate: '2025-01-11',
      status: 'Needs Review',
      autoMapped: false,
    },
    {
      id: '3',
      fileName: 'Access_Review_2025_Q1.xlsx',
      source: 'PBC-003',
      uploadedBy: 'Client Portal',
      uploadedDate: '2025-01-12',
      status: 'Needs Review',
      autoMapped: true,
    },
  ];

  // State management
  const [selectedProject, setSelectedProject] = useState('1');
  const [selectedControl, setSelectedControl] = useState('1');
  const [selectedApplication, setSelectedApplication] = useState('1');
  const [activeTab, setActiveTab] = useState<TabType>('evidence');
  const [files, setFiles] = useState<EvidenceFile[]>(mockFiles);
  const [isUploading, setIsUploading] = useState(false);

  // Find selected control
  const currentControl = mockControls.find((c) => c.id === selectedControl) || null;

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

      {/* Control Selection Dropdowns */}
      <ControlDropdowns
        projects={mockProjects}
        controls={mockControls}
        applications={mockApplications}
        selectedProject={selectedProject}
        selectedControl={selectedControl}
        selectedApplication={selectedApplication}
        onProjectChange={setSelectedProject}
        onControlChange={setSelectedControl}
        onApplicationChange={setSelectedApplication}
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

