'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { pbcApi, pbcEvidenceApi, projectsApi, controlsApi, applicationsApi, authApi, type PbcRequestResponse, type PbcRequestItemResponse, type EvidenceFile } from '@/lib/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useToast } from '@/components/ui/ToastProvider';
import ChecksTable from './components/ChecksTable';
import EditCheckModal from './components/EditCheckModal';
import EvidenceUploader from './components/EvidenceUploader';
import EvidenceList from './components/EvidenceList';
import ConfirmModal from './components/ConfirmModal';

interface PbcRequestDetailPageProps {}

export default function PbcRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const pbcRequestId = params.pbc_request_id as string;
  const { showToast } = useToast();

  const [pbcRequest, setPbcRequest] = useState<PbcRequestResponse | null>(null);
  const [items, setItems] = useState<PbcRequestItemResponse[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [controlName, setControlName] = useState<string | undefined>();
  const [controlCode, setControlCode] = useState<string | undefined>();
  const [applicationName, setApplicationName] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingItem, setEditingItem] = useState<PbcRequestItemResponse | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(false);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [isRemovingEvidence, setIsRemovingEvidence] = useState(false);
  const [removingFileId, setRemovingFileId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId && pbcRequestId) {
      loadData();
      loadEvidence();
    }
  }, [projectId, pbcRequestId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [request, itemsData, project] = await Promise.all([
        pbcApi.getPbcRequest(pbcRequestId),
        pbcApi.listPbcRequestItems(pbcRequestId),
        projectsApi.getProject(projectId),
      ]);

      setPbcRequest(request);
      setItems(itemsData);
      setProjectName(project.name);

      // Derive Control and Application from items
      const uniqueControlIds = new Set(itemsData.map(item => item.project_control_id));
      const uniqueApplicationIds = new Set(itemsData.map(item => item.application_id));

      if (uniqueControlIds.size === 1) {
        const projectControlId = Array.from(uniqueControlIds)[0];
        try {
          const projectControl = await projectsApi.getProjectControl(projectControlId);
          const control = await controlsApi.getControl(projectControl.control_id);
          setControlName(control.name);
          setControlCode(control.control_code);
        } catch (err) {
          console.warn(`Failed to fetch control:`, err);
        }
      }

      if (uniqueApplicationIds.size === 1) {
        const applicationId = Array.from(uniqueApplicationIds)[0];
        try {
          const application = await applicationsApi.getApplication(applicationId);
          setApplicationName(application.name);
        } catch (err) {
          console.warn(`Failed to fetch application:`, err);
        }
      }
    } catch (err) {
      console.error('Failed to load PBC request:', err);
      setError(err instanceof Error ? err : new Error('Failed to load PBC request'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvidence = async () => {
    try {
      setIsLoadingEvidence(true);
      const files = await pbcEvidenceApi.listPbcEvidence(pbcRequestId);

      // Get unique membership IDs that uploaded files
      const membershipIds = files
        .map(file => file.created_by_membership_id)
        .filter((id): id is string => id !== undefined);

      // Fetch user names for these membership IDs
      let userNames: Record<string, string> = {};
      if (membershipIds.length > 0) {
        try {
          userNames = await authApi.getUserNamesForMemberships(membershipIds);
        } catch (err) {
          console.warn('Failed to fetch uploader names:', err);
          // Continue without uploader names if this fails
        }
      }

      // Attach uploader names to files
      const filesWithUploaders = files.map(file => ({
        ...file,
        uploaded_by: file.created_by_membership_id ? userNames[file.created_by_membership_id] : undefined,
      }));

      setEvidenceFiles(filesWithUploaders);
    } catch (err) {
      console.error('Failed to load evidence:', err);
      // Don't show error toast for evidence loading failures, just log
    } finally {
      setIsLoadingEvidence(false);
    }
  };

  const handleEvidenceUpload = async (files: File[]) => {
    try {
      setIsUploadingEvidence(true);
      const hadEvidenceBefore = evidenceFiles.length > 0;
      await pbcEvidenceApi.uploadPbcEvidence(pbcRequestId, files);
      
      // Reload evidence list to get updated state
      await loadEvidence();
      
      showToast(`Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`, 'success');

      // Optional: Update item statuses from "requested" to "received" if this is the first evidence
      if (!hadEvidenceBefore) {
        try {
          const currentItems = await pbcApi.listPbcRequestItems(pbcRequestId);
          const requestedItems = currentItems.filter((item) => item.status === 'requested');
          
          // Update each requested item to "received" status
          await Promise.all(
            requestedItems.map((item) =>
              pbcApi.updatePbcRequestItem(item.id, { status: 'received' })
            )
          );

          // Reload data to reflect status changes
          if (requestedItems.length > 0) {
            await loadData();
          }
        } catch (err) {
          // Best-effort: log but don't fail the upload
          console.warn('Failed to update item statuses after evidence upload:', err);
        }
      }
    } catch (err) {
      console.error('Failed to upload evidence:', err);
      showToast(`Failed to upload evidence: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
      throw err;
    } finally {
      setIsUploadingEvidence(false);
    }
  };

  const handleEvidenceRemove = async (fileId: string) => {
    try {
      setIsRemovingEvidence(true);
      await pbcEvidenceApi.unlinkPbcEvidence(pbcRequestId, fileId);
      setEvidenceFiles((prev) => prev.filter((f) => f.id !== fileId));
      showToast('Evidence file removed', 'success');
      setRemovingFileId(null);
    } catch (err) {
      console.error('Failed to remove evidence:', err);
      showToast(`Failed to remove evidence: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setIsRemovingEvidence(false);
    }
  };

  const handleRunAnalysis = async () => {
    // Stub for now - backend endpoint not ready
    showToast('Analysis not implemented yet', 'info');
  };

  const handleItemUpdate = async (itemId: string, data: {
    status?: string | null;
    notes?: string | null;
    assignee_membership_id?: string | null;
  }) => {
    try {
      await pbcApi.updatePbcRequestItem(itemId, data);
      showToast('Check updated successfully', 'success');
      setEditingItem(null);
      await loadData();
    } catch (err) {
      console.error('Failed to update check:', err);
      showToast(`Failed to update check: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
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

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'requested':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-purple-100 text-purple-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'exception':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Compute progress summary
  const completedCount = items.filter(item => item.status === 'complete').length;
  const exceptionCount = items.filter(item => item.status === 'exception').length;
  // Note: "out_of_scope" status doesn't exist in backend, so we'll show 0 or omit
  const outOfScopeCount = 0; // Placeholder - no out_of_scope status in backend
  const totalCount = items.length;

  // Compute rollup status
  const computeRollupStatus = (): string => {
    if (items.length === 0) return 'NOT_STARTED';
    if (items.some(item => item.status === 'exception')) return 'EXCEPTION';
    if (items.every(item => item.status === 'complete')) return 'COMPLETE';
    if (items.some(item => item.status === 'in_review')) return 'IN_REVIEW';
    if (items.some(item => item.status === 'received' || item.status === 'requested')) return 'IN_PROGRESS';
    if (items.every(item => item.status === 'not_started')) return 'NOT_STARTED';
    return 'IN_PROGRESS';
  };

  const rollupStatus = computeRollupStatus();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading PBC request...</div>
      </div>
    );
  }

  if (error || !pbcRequest) {
    return (
      <ErrorDisplay
        title="Failed to load PBC request"
        message={error?.message || 'PBC request not found'}
        showRetryButton={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push(`/portal/projects/${projectId}/pbc`)}
          className="text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to PBC Requests
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PBC Request</h1>
            <div className="mt-2 flex items-center gap-4">
              {controlName && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Control:</span> {controlName}
                  {controlCode && <span className="text-gray-500 ml-1">({controlCode})</span>}
                </div>
              )}
              {applicationName && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Application:</span> {applicationName}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(pbcRequest.status)}>
              {pbcRequest.status.replace('_', ' ')}
            </Badge>
            {rollupStatus !== pbcRequest.status && (
              <Badge className="bg-gray-200 text-gray-700">
                Rollup: {rollupStatus.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>
        {pbcRequest.due_date && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Due date:</span> {formatDate(pbcRequest.due_date)}
          </div>
        )}
        {pbcRequest.instructions && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Instructions</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{pbcRequest.instructions}</p>
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Progress Summary</h2>
          <Button
            variant="primary"
            onClick={handleRunAnalysis}
            disabled={evidenceFiles.length === 0}
            size="sm"
          >
            Run AI Analysis
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">{completedCount}/{totalCount}</div>
            <div className="text-sm text-gray-600">Checks Complete</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{exceptionCount}</div>
            <div className="text-sm text-gray-600">Exceptions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{evidenceFiles.length}</div>
            <div className="text-sm text-gray-600">Files uploaded</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Last updated:</span>{' '}
              {pbcRequest.updated_at ? formatDate(pbcRequest.updated_at) : 'Never'}
            </div>
          </div>
        </div>
      </div>

      {/* Checks Table */}
      <ChecksTable
        items={items}
        onEdit={(item) => setEditingItem(item)}
        getItemStatusColor={getItemStatusColor}
      />

      {/* Evidence Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence</h3>
            <p className="text-sm text-gray-600">Upload evidence files for this PBC request</p>
          </div>
          <EvidenceUploader
            onFilesSelected={handleEvidenceUpload}
            isUploading={isUploadingEvidence}
          />
        </div>

        {isLoadingEvidence ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Loading evidence...</p>
          </div>
        ) : (
          <EvidenceList
            files={evidenceFiles}
            onRemove={(fileId) => setRemovingFileId(fileId)}
            isRemoving={isRemovingEvidence}
          />
        )}
      </div>

      {/* Edit Check Modal */}
      {editingItem && (
        <EditCheckModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleItemUpdate}
        />
      )}

      {/* Confirm Remove Evidence Modal */}
      <ConfirmModal
        isOpen={removingFileId !== null}
        title="Remove Evidence File"
        message="Are you sure you want to remove this file from the request?"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (removingFileId) {
            handleEvidenceRemove(removingFileId);
          }
        }}
        onCancel={() => setRemovingFileId(null)}
      />
    </div>
  );
}

