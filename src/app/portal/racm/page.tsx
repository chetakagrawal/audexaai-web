'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { controlsApi, applicationsApi } from '@/lib/api';
import { Control, Application, ControlFormData } from './types';
import { convertApiControlToUI } from './racmUtils';
import RACMBanner from './components/RACMBanner';
import RACMMetrics from './components/RACMMetrics';
import RACMFilters from './components/RACMFilters';
import RACMTable from './components/RACMTable';
import CreateControlModal from './components/CreateControlModal';

export default function RACMPage() {
  const [showAddControlModal, setShowAddControlModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [controls, setControls] = useState<Control[]>([]);
  const [isLoadingControls, setIsLoadingControls] = useState(true);

  // Fetch controls on mount
  useEffect(() => {
    fetchControls();
  }, []);

  // Fetch applications when modal opens
  useEffect(() => {
    if (showAddControlModal) {
      fetchApplications();
    }
  }, [showAddControlModal]);

  const fetchControls = async () => {
    try {
      setIsLoadingControls(true);
      const apiControls = await controlsApi.listControls();
      const uiControls = apiControls.map(convertApiControlToUI);
      setControls(uiControls);
    } catch (error) {
      console.error('Failed to fetch controls:', error);
    } finally {
      setIsLoadingControls(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsLoadingApplications(true);
      const apps = await applicationsApi.listApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleCreateControl = async (formData: ControlFormData, applicationIds: string[]) => {
    setIsCreating(true);

    try {
      // Create control with application_ids (backend should handle both in one transaction)
      const newControl = await controlsApi.createControl({
        control_code: formData.control_code,
        name: formData.name,
        category: formData.category || null,
        risk_rating: formData.risk_rating || null,
        control_type: formData.control_type || null,
        frequency: formData.frequency || null,
        is_key: formData.is_key,
        is_automated: formData.is_automated,
        application_ids: applicationIds.length > 0 ? applicationIds : undefined,
      });

      // If backend doesn't support application_ids in createControl, use fallback
      if (applicationIds.length > 0) {
        try {
          await controlsApi.associateApplicationsWithControl(newControl.id, applicationIds);
        } catch (assocError) {
          // If association fails, log but don't fail the whole operation
          // The control was created successfully, association can be retried
          console.warn('Failed to associate applications with control:', assocError);
        }
      }

      // Convert the new control to UI format and add to the list
      const uiControl = convertApiControlToUI(newControl);
      // If we have application names, add them to the UI control
      if (applicationIds.length > 0) {
        const appNames = applicationIds
          .map((id) => applications.find((app) => app.id === id)?.name)
          .filter(Boolean) as string[];
        uiControl.applicationsInScope = appNames;
      }
      setControls((prev) => [uiControl, ...prev]);

      setShowAddControlModal(false);
    } catch (error) {
      console.error('Failed to create control:', error);
      alert('Failed to create control. Please try again.');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Risk & Control Matrix (RACM)</h1>
            <p className="text-gray-600 mt-1">Master control inventory that drives PBC requests and evidence requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export RACM
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowAddControlModal(true)}
            >
              + Add Control
            </Button>
          </div>
        </div>

        {/* Information Banner */}
        <RACMBanner />

        {/* Summary Cards */}
        <RACMMetrics />

        {/* Search and Filter */}
        <RACMFilters />

        {/* Controls Table */}
        {isLoadingControls ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading controls...</div>
          </div>
        ) : controls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No controls yet. Create your first control to get started.</div>
          </div>
        ) : (
          <RACMTable controls={controls} />
        )}
      </div>

      {/* Add Control Modal */}
      <CreateControlModal
        isOpen={showAddControlModal}
        onClose={() => setShowAddControlModal(false)}
        onSubmit={handleCreateControl}
        isCreating={isCreating}
        applications={applications}
        isLoadingApplications={isLoadingApplications}
      />
    </>
  );
}
