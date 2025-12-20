/**
 * Control Applications API endpoints
 * Manages the relationship between controls and applications
 */

import { apiRequest } from './core';

export interface ControlApplicationResponse {
  id: string;
  tenant_id: string;
  control_id: string;
  application_id: string;
  created_at: string;
}

export interface Application {
  id: string;
  tenant_id: string;
  name: string;
  category: string | null;
  scope_rationale: string | null;
  business_owner_membership_id: string | null;
  it_owner_membership_id: string | null;
  created_at: string;
}

export const controlApplicationsApi = {
  /**
   * List all applications attached to a control
   * Returns Application objects directly (not ControlApplicationResponse)
   */
  async listControlApplications(controlId: string): Promise<Application[]> {
    return apiRequest<Application[]>(`/v1/controls/${controlId}/applications`);
  },

  /**
   * Attach multiple applications to a control in bulk
   * Note: This adds applications but doesn't remove existing ones
   */
  async attachApplicationsToControl(
    controlId: string,
    applicationIds: string[]
  ): Promise<ControlApplicationResponse[]> {
    return apiRequest<ControlApplicationResponse[]>(
      `/v1/controls/${controlId}/applications/bulk`,
      {
        method: 'POST',
        body: JSON.stringify(applicationIds),
      }
    );
  },

  /**
   * Replace all applications for a control (removes old, adds new)
   */
  async replaceControlApplications(
    controlId: string,
    applicationIds: string[]
  ): Promise<ControlApplicationResponse[]> {
    return apiRequest<ControlApplicationResponse[]>(
      `/v1/controls/${controlId}/applications/bulk`,
      {
        method: 'PUT',
        body: JSON.stringify(applicationIds),
      }
    );
  },

  /**
   * Remove an application from a control
   */
  async detachApplicationFromControl(
    controlId: string,
    applicationId: string
  ): Promise<void> {
    return apiRequest<void>(`/v1/controls/${controlId}/applications/${applicationId}`, {
      method: 'DELETE',
    });
  },
};

