/**
 * Controls API endpoints
 */

import { apiRequest } from './core';

export const controlsApi = {
  /**
   * List all controls for the current tenant
   */
  async listControls() {
    return apiRequest<Array<{
      id: string;
      tenant_id: string;
      created_by_membership_id: string;
      control_code: string;
      name: string;
      category: string | null;
      risk_rating: string | null;
      control_type: string | null;
      frequency: string | null;
      is_key: boolean;
      is_automated: boolean;
      created_at: string;
      applications: Array<{
        id: string;
        tenant_id: string;
        name: string;
        category: string | null;
        scope_rationale: string | null;
        business_owner_membership_id: string | null;
        it_owner_membership_id: string | null;
        created_at: string;
      }>;
    }>>('/v1/controls');
  },

  /**
   * Get a specific control by ID
   */
  async getControl(controlId: string) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      created_by_membership_id: string;
      control_code: string;
      name: string;
      category: string | null;
      risk_rating: string | null;
      control_type: string | null;
      frequency: string | null;
      is_key: boolean;
      is_automated: boolean;
      created_at: string;
      applications: Array<{
        id: string;
        tenant_id: string;
        name: string;
        category: string | null;
        scope_rationale: string | null;
        business_owner_membership_id: string | null;
        it_owner_membership_id: string | null;
        created_at: string;
      }>;
    }>(`/v1/controls/${controlId}`);
  },

  /**
   * Create a new control
   */
  async createControl(data: {
    control_code: string;
    name: string;
    category?: string | null;
    risk_rating?: string | null;
    control_type?: string | null;
    frequency?: string | null;
    is_key?: boolean;
    is_automated?: boolean;
    application_ids?: string[]; // Optional: IDs of applications to associate
  }) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      created_by_membership_id: string;
      control_code: string;
      name: string;
      category: string | null;
      risk_rating: string | null;
      control_type: string | null;
      frequency: string | null;
      is_key: boolean;
      is_automated: boolean;
      created_at: string;
      applications: Array<{
        id: string;
        tenant_id: string;
        name: string;
        category: string | null;
        scope_rationale: string | null;
        business_owner_membership_id: string | null;
        it_owner_membership_id: string | null;
        created_at: string;
      }>;
    }>('/v1/controls', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Associate applications with a control (creates control_applications records in bulk)
   */
  async associateApplicationsWithControl(controlId: string, applicationIds: string[]) {
    return apiRequest<Array<{
      id: string;
      tenant_id: string;
      control_id: string;
      application_id: string;
      created_at: string;
    }>>(`/v1/controls/${controlId}/applications/bulk`, {
      method: 'POST',
      body: JSON.stringify(applicationIds),
    });
  },
};
