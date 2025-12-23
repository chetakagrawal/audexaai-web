/**
 * PBC (Prepared By Client) v2 API endpoints
 */

import { apiRequest } from './core';

export interface PbcRequestResponse {
  id: string;
  tenant_id: string;
  project_id: string;
  title: string;
  due_date: string | null;
  status: string; // draft|issued|in_progress|submitted|accepted|returned|closed
  instructions: string | null;
  created_at: string;
  created_by_membership_id: string;
  updated_at: string | null;
  updated_by_membership_id: string | null;
  deleted_at: string | null;
  deleted_by_membership_id: string | null;
  row_version: number;
}

export interface PbcRequestItemResponse {
  id: string;
  tenant_id: string;
  project_id: string;
  pbc_request_id: string;
  project_control_id: string;
  application_id: string;
  test_attribute_id: string;
  // Snapshot fields (immutable)
  pinned_control_version_num: number;
  pinned_test_attribute_version_num: number;
  effective_procedure_snapshot: string | null;
  effective_evidence_snapshot: string | null;
  source_snapshot: string; // base|project_global_override|project_app_override
  override_id_snapshot: string | null;
  // Workflow fields (mutable)
  status: string; // not_started|requested|received|in_review|complete|exception
  assignee_membership_id: string | null;
  instructions_extra: string | null;
  notes: string | null;
  // Audit fields
  created_at: string;
  created_by_membership_id: string;
  updated_at: string | null;
  updated_by_membership_id: string | null;
  deleted_at: string | null;
  deleted_by_membership_id: string | null;
  row_version: number;
}

export interface PbcGenerateRequest {
  mode?: 'new' | 'replace_drafts';
  group_by?: 'application' | 'control' | 'control_app';
  due_date?: string | null;
  instructions?: string | null;
}

export interface PbcRequestPatch {
  title?: string | null;
  due_date?: string | null;
  status?: string | null;
  instructions?: string | null;
}

export interface PbcRequestItemPatch {
  status?: string | null;
  assignee_membership_id?: string | null;
  instructions_extra?: string | null;
  notes?: string | null;
}

export const pbcApi = {
  /**
   * Generate PBC requests for a project
   */
  async generatePbcRequests(
    projectId: string,
    data: PbcGenerateRequest
  ): Promise<PbcRequestResponse> {
    return apiRequest<PbcRequestResponse>(`/v1/projects/${projectId}/pbc/generate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List all PBC requests for a project
   */
  async listPbcRequests(projectId: string): Promise<PbcRequestResponse[]> {
    return apiRequest<PbcRequestResponse[]>(`/v1/projects/${projectId}/pbc`);
  },

  /**
   * Get a specific PBC request by ID
   */
  async getPbcRequest(pbcRequestId: string): Promise<PbcRequestResponse> {
    return apiRequest<PbcRequestResponse>(`/v1/pbc/${pbcRequestId}`);
  },

  /**
   * List items for a PBC request
   */
  async listPbcRequestItems(pbcRequestId: string): Promise<PbcRequestItemResponse[]> {
    return apiRequest<PbcRequestItemResponse[]>(`/v1/pbc/${pbcRequestId}/items`);
  },

  /**
   * Update a PBC request
   */
  async updatePbcRequest(
    pbcRequestId: string,
    data: PbcRequestPatch
  ): Promise<PbcRequestResponse> {
    return apiRequest<PbcRequestResponse>(`/v1/pbc/${pbcRequestId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a PBC request item
   */
  async updatePbcRequestItem(
    itemId: string,
    data: PbcRequestItemPatch
  ): Promise<PbcRequestItemResponse> {
    return apiRequest<PbcRequestItemResponse>(`/v1/pbc/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

