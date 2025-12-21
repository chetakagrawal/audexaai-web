/**
 * Projects API endpoints
 */

import { apiRequest } from './core';
import { ProjectControlResponse, ApplicationResponse, ProjectControlApplicationResponse } from './types';

export interface ProjectResponse {
  id: string;
  tenant_id: string;
  created_by_membership_id: string;
  name: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  updated_at: string | null;
  updated_by_membership_id: string | null;
  deleted_at: string | null;
  deleted_by_membership_id: string | null;
  row_version: number;
}

export const projectsApi = {
  /**
   * List all projects for the current tenant
   */
  async listProjects(): Promise<ProjectResponse[]> {
    return apiRequest<ProjectResponse[]>('/v1/projects');
  },

  /**
   * Get a specific project by ID
   */
  async getProject(projectId: string): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/v1/projects/${projectId}`);
  },

  /**
   * Create a new project
   */
  async createProject(data: {
    name: string;
    status?: string;
    period_start?: string | null;
    period_end?: string | null;
  }): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>('/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List controls for a project
   */
  async listProjectControls(projectId: string): Promise<ProjectControlResponse[]> {
    return apiRequest<ProjectControlResponse[]>(`/v1/projects/${projectId}/controls`);
  },

  /**
   * Add a control to a project
   */
  async addControlToProject(
    projectId: string,
    data: {
      control_id: string;
      is_key_override?: boolean | null;
      frequency_override?: string | null;
      notes?: string | null;
    }
  ): Promise<ProjectControlResponse> {
    return apiRequest<ProjectControlResponse>(`/v1/projects/${projectId}/controls`, {
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
  ): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>(`/v1/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a specific project-control mapping
   */
  async getProjectControl(projectControlId: string): Promise<ProjectControlResponse> {
    return apiRequest<ProjectControlResponse>(`/v1/project-controls/${projectControlId}`);
  },

  /**
   * Update project-control override fields
   */
  async updateProjectControlOverrides(
    projectControlId: string,
    data: {
      is_key_override?: boolean | null;
      frequency_override?: string | null;
      notes?: string | null;
    }
  ): Promise<ProjectControlResponse> {
    return apiRequest<ProjectControlResponse>(`/v1/project-controls/${projectControlId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete (soft delete) a project control
   */
  async deleteProjectControl(projectControlId: string): Promise<void> {
    return apiRequest<void>(`/v1/project-controls/${projectControlId}`, {
      method: 'DELETE',
    });
  },

  /**
   * List applications scoped to a project control
   * Note: Backend returns ApplicationResponse[] directly, not ProjectControlApplicationResponse[]
   */
  async listProjectControlApplications(projectControlId: string): Promise<ApplicationResponse[]> {
    return apiRequest<ApplicationResponse[]>(`/v1/project-controls/${projectControlId}/applications`);
  },

  /**
   * Add an application to a project control
   */
  async addApplicationToProjectControl(
    projectControlId: string,
    data: { application_id: string }
  ): Promise<ProjectControlApplicationResponse> {
    return apiRequest<ProjectControlApplicationResponse>(`/v1/project-controls/${projectControlId}/applications`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Remove an application from a project control
   */
  async removeApplicationFromProjectControl(pcaId: string): Promise<void> {
    return apiRequest<void>(`/v1/project-control-applications/${pcaId}`, {
      method: 'DELETE',
    });
  },
};
