/**
 * Controls API endpoints
 */

import { apiRequest } from './core';

export interface ControlResponse {
  id: string;
  tenant_id: string;
  created_by_membership_id: string;
  control_code: string;
  name: string;
  description: string | null;
  category: string | null;
  risk_rating: string | null;
  control_type: string | null;
  frequency: string | null;
  is_key: boolean;
  is_automated: boolean;
  created_at: string;
  updated_at: string;
  updated_by_membership_id: string | null;
  deleted_at: string | null;
  deleted_by_membership_id: string | null;
  row_version: number;
}

export const controlsApi = {
  /**
   * List all controls for the current tenant
   * Note: Applications are no longer included. Use controlApplicationsApi to fetch them separately.
   */
  async listControls(): Promise<ControlResponse[]> {
    return apiRequest<ControlResponse[]>('/v1/controls');
  },

  /**
   * Get a specific control by ID
   * Note: Applications are no longer included. Use controlApplicationsApi to fetch them separately.
   */
  async getControl(controlId: string): Promise<ControlResponse> {
    return apiRequest<ControlResponse>(`/v1/controls/${controlId}`);
  },

  /**
   * Create a new control
   * If application_ids are provided, they will be associated in the same transaction.
   */
  async createControl(data: {
    control_code: string;
    name: string;
    description?: string | null;
    category?: string | null;
    risk_rating?: string | null;
    control_type?: string | null;
    frequency?: string | null;
    is_key?: boolean;
    is_automated?: boolean;
    application_ids?: string[]; // Optional: IDs of applications to associate
  }): Promise<ControlResponse> {
    return apiRequest<ControlResponse>('/v1/controls', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },


  /**
   * Update a control
   */
  async updateControl(controlId: string, data: {
    control_code?: string;
    name?: string;
    description?: string | null;
    category?: string | null;
    risk_rating?: string | null;
    control_type?: string | null;
    frequency?: string | null;
    is_key?: boolean;
    is_automated?: boolean;
  }): Promise<ControlResponse> {
    return apiRequest<ControlResponse>(`/v1/controls/${controlId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete (soft delete) a control
   */
  async deleteControl(controlId: string): Promise<ControlResponse> {
    return apiRequest<ControlResponse>(`/v1/controls/${controlId}`, {
      method: 'DELETE',
    });
  },
};
