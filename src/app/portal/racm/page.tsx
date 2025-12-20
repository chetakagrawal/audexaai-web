'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { controlsApi, applicationsApi, controlApplicationsApi } from '@/lib/api';
import { Control, Application, ControlFormData } from './types';
import { convertApiControlToUI, UUID_REGEX } from './racmUtils';
import RACMBanner from './components/RACMBanner';
import RACMMetrics from './components/RACMMetrics';
import RACMFilters from './components/RACMFilters';
import RACMTable from './components/RACMTable';
import CreateControlModal from './components/CreateControlModal';
import ControlDetailView from './components/ControlDetailView';

export default function RACMPage() {
  const pathname = usePathname();
  
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
  
  // Extract control ID from current path if on detail view
  const controlIdMatch = currentPath?.match(/^\/portal\/racm\/([^/]+)$/);
  const controlId = controlIdMatch ? controlIdMatch[1] : null;
  const isDetailView = controlId !== null;
  const isValidControlId = controlId && UUID_REGEX.test(controlId);
  const [showAddControlModal, setShowAddControlModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [controls, setControls] = useState<Control[]>([]);
  const [isLoadingControls, setIsLoadingControls] = useState(true);

  // Fetch controls on mount (only when on list view)
  useEffect(() => {
    if (!isDetailView) {
      fetchControls();
    }
  }, [isDetailView]);

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
      
      // Fetch applications for each control in parallel
      const controlsWithApplications = await Promise.all(
        apiControls.map(async (apiControl) => {
          try {
            // Fetch applications for this control (now returns Application[] directly)
            const applications = await controlApplicationsApi.listControlApplications(apiControl.id);
            // Extract application names directly from the response
            const applicationNames = applications.map(app => app.name);
            
            return convertApiControlToUI(apiControl, applicationNames);
          } catch (error) {
            console.error(`Failed to fetch applications for control ${apiControl.id}:`, error);
            // Return control without applications if fetch fails
            return convertApiControlToUI(apiControl, []);
          }
        })
      );
      
      setControls(controlsWithApplications);
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
        description: formData.description || null,
        category: formData.category || null,
        risk_rating: formData.risk_rating || null,
        control_type: formData.control_type || null,
        frequency: formData.frequency || null,
        is_key: formData.is_key,
        is_automated: formData.is_automated,
        application_ids: applicationIds.length > 0 ? applicationIds : undefined,
      });

      // Fetch application names for the new control using the updated API
      let applicationNames: string[] = [];
      if (applicationIds.length > 0) {
        try {
          // Use the new API that returns Application[] directly
          const applications = await controlApplicationsApi.listControlApplications(newControl.id);
          applicationNames = applications.map(app => app.name);
        } catch (error) {
          console.warn('Failed to fetch application names:', error);
        }
      }

      // Convert the new control to UI format and add to the list
      const uiControl = convertApiControlToUI(newControl, applicationNames);
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


  // Render detail view
  if (isDetailView) {
    if (!isValidControlId) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Invalid control ID</div>
          <button
            onClick={() => window.history.pushState({}, '', '/portal/racm')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mt-4"
          >
            Back to RACM
          </button>
        </div>
      );
    }

    return <ControlDetailView controlId={controlId} />;
  }

  // Render list view
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
