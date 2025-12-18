/**
 * Projects API endpoints
 */

import { apiRequest } from './core';

export const projectsApi = {
  /**
   * List all projects for the current tenant
   */
  async listProjects() {
    return apiRequest<Array<{
      id: string;
      tenant_id: string;
      created_by_membership_id: string;
      name: string;
      status: string;
      period_start: string | null;
      period_end: string | null;
      created_at: string;
      updated_at: string;
    }>>('/v1/projects');
  },

  /**
   * Get a specific project by ID
   */
  async getProject(projectId: string) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      created_by_membership_id: string;
      name: string;
      status: string;
      period_start: string | null;
      period_end: string | null;
      created_at: string;
      updated_at: string;
    }>(`/v1/projects/${projectId}`);
  },

  /**
   * Create a new project
   */
  async createProject(data: {
    name: string;
    status?: string;
    period_start?: string | null;
    period_end?: string | null;
  }) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      created_by_membership_id: string;
      name: string;
      status: string;
      period_start: string | null;
      period_end: string | null;
      created_at: string;
      updated_at: string;
    }>('/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List controls for a project
   */
  async listProjectControls(projectId: string) {
    return apiRequest<Array<{
      id: string;
      tenant_id: string;
      project_id: string;
      control_id: string;
      is_key_override: boolean | null;
      frequency_override: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string | null;
      updated_by_membership_id: string | null;
      deleted_at: string | null;
      deleted_by_membership_id: string | null;
    }>>(`/v1/projects/${projectId}/controls`);
  },

  /**
   * Add a control to a project
   */
  async addControlToProject(projectId: string, data: {
    control_id: string;
    is_key_override?: boolean | null;
    frequency_override?: string | null;
    notes?: string | null;
  }) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      project_id: string;
      control_id: string;
      is_key_override: boolean | null;
      frequency_override: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string | null;
      updated_by_membership_id: string | null;
      deleted_at: string | null;
      deleted_by_membership_id: string | null;
    }>(`/v1/projects/${projectId}/controls`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing project
   */
  async updateProject(
    projectId: string,
    data: {
      name?: string | null;
      status?: string | null;
      period_start?: string | null;
      period_end?: string | null;
    }
  ) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      created_by_membership_id: string;
      name: string;
      status: string;
      period_start: string | null;
      period_end: string | null;
      created_at: string;
      updated_at: string;
    }>(`/v1/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Add multiple controls to a project in bulk
   */
  async addControlsToProjectBulk(projectId: string, controlIds: string[]) {
    return apiRequest<Array<{
      id: string;
      tenant_id: string;
      project_id: string;
      control_id: string;
      is_key_override: boolean | null;
      frequency_override: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string | null;
      updated_by_membership_id: string | null;
      deleted_at: string | null;
      deleted_by_membership_id: string | null;
    }>>(`/v1/projects/${projectId}/controls/bulk`, {
      method: 'POST',
      body: JSON.stringify(controlIds),
    });
  },

  /**
   * Delete (soft delete) a project control
   */
  async deleteProjectControl(projectId: string, projectControlId: string) {
    return apiRequest<{
      id: string;
      tenant_id: string;
      project_id: string;
      control_id: string;
      is_key_override: boolean | null;
      frequency_override: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string | null;
      updated_by_membership_id: string | null;
      deleted_at: string | null;
      deleted_by_membership_id: string | null;
    }>(`/v1/projects/${projectId}/controls/${projectControlId}`, {
      method: 'DELETE',
    });
  },
};
