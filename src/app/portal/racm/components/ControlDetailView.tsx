'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { controlsApi, testAttributesApi } from '@/lib/api';
import { Control, ControlFormData } from '../types';
import ControlOverviewTab from './ControlOverviewTab';
import ControlTestAttributesTab from './ControlTestAttributesTab';
import EditControlModal from './EditControlModal';

type Tab = 'overview' | 'test-attributes';

interface ControlDetailViewProps {
  controlId: string;
}

export default function ControlDetailView({ controlId }: ControlDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [control, setControl] = useState<Control | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch control details
  useEffect(() => {
    fetchControl();
  }, [controlId]);

  const fetchControl = async () => {
    try {
      setIsLoading(true);
      const apiControl = await controlsApi.getControl(controlId);
      
      // Convert API control to UI format
      const uiControl: Control = {
        id: apiControl.id,
        controlCode: apiControl.control_code,
        name: apiControl.name,
        description: apiControl.description,
        category: apiControl.category || '',
        applicationsInScope: [],
        businessProcessOwner: {
          name: 'Not assigned',
          title: '',
        },
        itOwner: {
          name: 'Not assigned',
          title: '',
        },
        riskRating: (apiControl.risk_rating as 'High' | 'Medium' | 'Low') || 'Medium',
        type: (apiControl.control_type as 'Preventive' | 'Detective') || 'Preventive',
        frequency: apiControl.frequency || '',
        isKeyControl: apiControl.is_key,
        isAutomated: apiControl.is_automated,
      };
      
      setControl(uiControl);
    } catch (error) {
      console.error('Failed to fetch control:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateControl = async (formData: ControlFormData) => {
    if (!control) return;

    try {
      setIsSaving(true);
      await controlsApi.updateControl(controlId, {
        control_code: formData.control_code,
        name: formData.name,
        description: formData.description || null,
        category: formData.category || null,
        risk_rating: formData.risk_rating || null,
        control_type: formData.control_type || null,
        frequency: formData.frequency || null,
        is_key: formData.is_key,
        is_automated: formData.is_automated,
      });
      await fetchControl(); // Refresh after update
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update control:', error);
      alert('Failed to update control. Please try again.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading control...</div>
      </div>
    );
  }

  if (!control) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Control not found</div>
        <button
          onClick={() => router.push('/portal/racm')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mt-4"
        >
          Back to RACM
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/portal/racm')}
              className="text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to RACM
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{control.controlCode}</h1>
              <span className="text-xl text-gray-600">{control.name}</span>
            </div>
            <p className="text-gray-600 mt-1">Control details and configuration</p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Edit Control
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
              onClick={() => setActiveTab('test-attributes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'test-attributes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Test Attributes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <ControlOverviewTab control={control} />}
          {activeTab === 'test-attributes' && (
            <ControlTestAttributesTab 
              controlId={controlId}
              controlCode={control.controlCode}
              controlName={control.name}
            />
          )}
        </div>
      </div>

      {/* Edit Control Modal */}
      <EditControlModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateControl}
        control={control}
        isSaving={isSaving}
      />
    </>
  );
}

