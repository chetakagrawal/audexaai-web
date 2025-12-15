/**
 * Applications API endpoints
 */

import { apiRequest } from './core';

export const applicationsApi = {
  /**
   * List all applications for the current tenant
   */
  async listApplications() {
    return apiRequest<Array<{
      id: string;
      tenant_id: string;
      name: string;
      category: string | null;
      scope_rationale: string | null;
      business_owner_membership_id: string;
      it_owner_membership_id: string;
      created_at: string;
    }>>('/v1/applications');
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
      business_owner_membership_id: string;
      it_owner_membership_id: string;
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
    business_owner_membership_id: string;
    it_owner_membership_id: string;
  }) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      name: string;
      category: string | null;
      scope_rationale: string | null;
      business_owner_membership_id: string;
      it_owner_membership_id: string;
      created_at: string;
    }>('/v1/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
