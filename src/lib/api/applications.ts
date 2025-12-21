/**
 * Applications API endpoints
 */

import { apiRequest } from './core';
import { ApplicationResponse } from './types';

export const applicationsApi = {
  /**
   * List all applications for the current tenant
   */
  async listApplications(): Promise<ApplicationResponse[]> {
    return apiRequest<ApplicationResponse[]>('/v1/applications');
  },

  /**
   * Get a specific application by ID
   */
  async getApplication(applicationId: string) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      name: string;
      category: string | null;
      scope_rationale: string | null;
      business_owner_membership_id: string | null;
      it_owner_membership_id: string | null;
      created_at: string;
    }>(`/v1/applications/${applicationId}`);
  },

  /**
   * Create a new application
   */
  async createApplication(data: {
    name: string;
    category?: string | null;
    scope_rationale?: string | null;
    business_owner_membership_id?: string | null;
    it_owner_membership_id?: string | null;
  }) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      name: string;
      category: string | null;
      scope_rationale: string | null;
      business_owner_membership_id: string | null;
      it_owner_membership_id: string | null;
      created_at: string;
    }>('/v1/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing application
   */
  async updateApplication(
    applicationId: string,
    data: {
      name?: string | null;
      category?: string | null;
      scope_rationale?: string | null;
      business_owner_membership_id?: string | null;
      it_owner_membership_id?: string | null;
    }
  ) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      name: string;
      category: string | null;
      scope_rationale: string | null;
      business_owner_membership_id: string | null;
      it_owner_membership_id: string | null;
      created_at: string;
    }>(`/v1/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get controls for an application
   */
  async getApplicationControls(applicationId: string) {
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
    }>>(`/v1/applications/${applicationId}/controls`);
  },
};
