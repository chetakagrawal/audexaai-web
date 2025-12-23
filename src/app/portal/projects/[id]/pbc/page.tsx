'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { pbcApi, projectsApi, controlsApi, applicationsApi, type PbcRequestResponse } from '@/lib/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import GeneratePbcModal from './components/GeneratePbcModal';
import StartPbcModal from './components/StartPbcModal';

interface PbcRequestWithMetadata extends PbcRequestResponse {
  itemsCount: number;
  controlName?: string;
  controlCode?: string;
  applicationName?: string;
  isMultipleControls?: boolean;
  isMultipleApplications?: boolean;
}

export default function ProjectPbcListPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [pbcRequests, setPbcRequests] = useState<PbcRequestWithMetadata[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [startingRequest, setStartingRequest] = useState<PbcRequestWithMetadata | null>(null);

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [requests, project] = await Promise.all([
        pbcApi.listPbcRequests(projectId),
        projectsApi.getProject(projectId),
      ]);
      setProjectName(project.name);

      // Fetch items for each request to derive Control × Application
      const requestsWithMetadata = await Promise.all(
        requests.map(async (request) => {
          try {
            const items = await pbcApi.listPbcRequestItems(request.id);
            
            // Derive Control and Application from items
            const uniqueControlIds = new Set(items.map(item => item.project_control_id));
            const uniqueApplicationIds = new Set(items.map(item => item.application_id));
            
            // Fetch control and application details
            let controlName: string | undefined;
            let controlCode: string | undefined;
            let applicationName: string | undefined;
            const isMultipleControls = uniqueControlIds.size > 1;
            const isMultipleApplications = uniqueApplicationIds.size > 1;

            if (!isMultipleControls && uniqueControlIds.size === 1) {
              const projectControlId = Array.from(uniqueControlIds)[0];
              try {
                const projectControl = await projectsApi.getProjectControl(projectControlId);
                const control = await controlsApi.getControl(projectControl.control_id);
                controlName = control.name;
                controlCode = control.control_code;
              } catch (err) {
                console.warn(`Failed to fetch control for project_control_id ${projectControlId}:`, err);
              }
            }

            if (!isMultipleApplications && uniqueApplicationIds.size === 1) {
              const applicationId = Array.from(uniqueApplicationIds)[0];
              try {
                const application = await applicationsApi.getApplication(applicationId);
                applicationName = application.name;
              } catch (err) {
                console.warn(`Failed to fetch application ${applicationId}:`, err);
              }
            }

            return {
              ...request,
              itemsCount: items.length,
              controlName: isMultipleControls ? undefined : controlName,
              controlCode: isMultipleControls ? undefined : controlCode,
              applicationName: isMultipleApplications ? undefined : applicationName,
              isMultipleControls,
              isMultipleApplications,
            };
          } catch (err) {
            console.warn(`Failed to fetch items for request ${request.id}:`, err);
            return {
              ...request,
              itemsCount: 0,
            };
          }
        })
      );

      setPbcRequests(requestsWithMetadata);
    } catch (err) {
      console.error('Failed to load PBC requests:', err);
      setError(err instanceof Error ? err : new Error('Failed to load PBC requests'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (data: {
    mode: 'new' | 'replace_drafts';
    group_by: 'application' | 'control' | 'control_app';
    due_date?: string | null;
    instructions?: string | null;
  }) => {
    try {
      await pbcApi.generatePbcRequests(projectId, data);
      setShowGenerateModal(false);
      await loadData();
      alert('PBC requests generated successfully');
    } catch (err) {
      console.error('Failed to generate PBC requests:', err);
      alert(`Failed to generate PBC requests: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      case 'closed':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading PBC requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load PBC requests"
        message={error.message}
        showRetryButton={false}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push(`/portal/projects/${projectId}`)}
              className="text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Project
            </button>
            <h1 className="text-3xl font-bold text-gray-900">PBC Requests</h1>
            <p className="text-gray-600 mt-1">
              Manage PBC requests for {projectName}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowGenerateModal(true)}
          >
            Generate PBC
          </Button>
        </div>

        {/* PBC Requests Table */}
        {pbcRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No PBC requests yet</h3>
            <p className="text-gray-600 mb-4">
              Generate your first PBC request to start collecting evidence.
            </p>
            <Button variant="primary" onClick={() => setShowGenerateModal(true)}>
              Generate PBC
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Control
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Application
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Checks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pbcRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {request.isMultipleControls ? (
                          <span className="text-sm text-gray-500 italic">Multiple</span>
                        ) : request.controlName ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.controlName}</div>
                            {request.controlCode && (
                              <div className="text-xs text-gray-500">{request.controlCode}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {request.isMultipleApplications ? (
                          <span className="text-sm text-gray-500 italic">Multiple</span>
                        ) : request.applicationName ? (
                          <span className="text-sm text-gray-900">{request.applicationName}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{formatDate(request.due_date)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{request.itemsCount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {request.updated_at ? formatDate(request.updated_at) : 'Never'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.status === 'draft' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setStartingRequest(request)}
                          >
                            Start
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <GeneratePbcModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerate}
      />

      {startingRequest && (
        <StartPbcModal
          pbcRequest={startingRequest}
          isOpen={!!startingRequest}
          onClose={() => setStartingRequest(null)}
          onStart={async (data) => {
            try {
              // Update request status to 'issued' (next status after draft)
              await pbcApi.updatePbcRequest(startingRequest.id, {
                status: 'issued',
                due_date: data.due_date || startingRequest.due_date,
                instructions: data.instructions || startingRequest.instructions,
              });

              // If "Apply to all checks" is enabled, update all items
              if (data.applyToAllChecks) {
                const items = await pbcApi.listPbcRequestItems(startingRequest.id);
                
                // Update items with concurrency limit of 5
                const CONCURRENCY_LIMIT = 5;
                let updatedCount = 0;
                let failedCount = 0;

                for (let i = 0; i < items.length; i += CONCURRENCY_LIMIT) {
                  const batch = items.slice(i, i + CONCURRENCY_LIMIT);
                  await Promise.all(
                    batch.map(async (item) => {
                      try {
                        await pbcApi.updatePbcRequestItem(item.id, {
                          status: 'requested', // Next status after not_started
                        });
                        updatedCount++;
                      } catch (err) {
                        console.error(`Failed to update item ${item.id}:`, err);
                        failedCount++;
                      }
                    })
                  );
                }

                // Show toast summary
                if (failedCount === 0) {
                  alert(`Updated ${updatedCount}/${items.length} checks`);
                } else {
                  alert(`Updated ${updatedCount}/${items.length} checks. ${failedCount} failed.`);
                }
              }

              setStartingRequest(null);
              await loadData();
            } catch (err) {
              console.error('Failed to start PBC request:', err);
              alert(`Failed to start PBC request: ${err instanceof Error ? err.message : 'Unknown error'}`);
              throw err;
            }
          }}
        />
      )}
    </>
  );
}

