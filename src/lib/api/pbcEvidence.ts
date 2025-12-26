/**
 * PBC Evidence API endpoints
 */

import { apiRequest, API_BASE_URL, getAuthToken, getDefaultMembershipId } from './core';

export interface EvidenceFile {
  id: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number;
  uploaded_at: string;
  sha256?: string | null;
  created_by_membership_id?: string;
  uploaded_by?: string;
}

export interface UploadEvidenceResponse {
  files: EvidenceFile[];
  artifact?: unknown;
}

export const pbcEvidenceApi = {
  /**
   * Upload evidence files for a PBC request
   */
  async uploadPbcEvidence(
    pbcRequestId: string,
    files: File[]
  ): Promise<UploadEvidenceResponse> {
    const token = getAuthToken();
    const membershipId = getDefaultMembershipId();
    const url = `${API_BASE_URL}/v1/pbc/${pbcRequestId}/evidence/upload`;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (membershipId) {
      headers['X-Membership-Id'] = membershipId;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const error = await response.json();
        console.error(`[API] Upload error response:`, error);
        // Handle FastAPI validation errors - detail can be string or array
        if (error.detail) {
          if (Array.isArray(error.detail)) {
            // Format validation errors
            errorMessage = error.detail
              .map((err: { msg?: string; loc?: unknown[] }) => err.msg || JSON.stringify(err))
              .join(', ');
          } else if (typeof error.detail === 'string') {
            errorMessage = error.detail;
          } else {
            errorMessage = JSON.stringify(error.detail);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (parseError) {
        // If JSON parsing fails, use default error message
        console.error('[API] Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  /**
   * List evidence files for a PBC request
   */
  async listPbcEvidence(pbcRequestId: string): Promise<EvidenceFile[]> {
    return apiRequest<EvidenceFile[]>(`/v1/pbc/${pbcRequestId}/evidence`);
  },

  /**
   * Unlink (delete) an evidence file from a PBC request
   */
  async unlinkPbcEvidence(
    pbcRequestId: string,
    evidenceFileId: string
  ): Promise<void> {
    return apiRequest<void>(
      `/v1/pbc/${pbcRequestId}/evidence/${evidenceFileId}`,
      {
        method: 'DELETE',
      }
    );
  },
};

