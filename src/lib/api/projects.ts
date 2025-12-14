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
    }>(`/v1/projects/${projectId}/controls`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
