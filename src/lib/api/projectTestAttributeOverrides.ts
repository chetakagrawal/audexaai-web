/**
 * Project Test Attribute Overrides API endpoints
 */

import { apiRequest } from './core';

export interface ProjectTestAttributeOverrideResponse {
  id: string;
  tenant_id: string;
  project_control_id: string;
  test_attribute_id: string;
  application_id: string | null;
  base_test_attribute_version_num: number;
  name_override: string | null;
  frequency_override: string | null;
  procedure_override: string | null;
  expected_evidence_override: string | null;
  notes: string | null;
  created_at: string;
  created_by_membership_id: string | null;
  updated_at: string | null;
  updated_by_membership_id: string | null;
  deleted_at: string | null;
  deleted_by_membership_id: string | null;
  row_version: number;
}

export interface ProjectTestAttributeOverrideUpsert {
  application_id?: string | null;
  name_override?: string | null;
  frequency_override?: string | null;
  procedure_override?: string | null;
  expected_evidence_override?: string | null;
  notes?: string | null;
}

export interface EffectiveTestAttributeResponse {
  test_attribute_id: string;
  code: string;
  name: string;
  frequency: string | null;
  test_procedure: string | null;
  expected_evidence: string | null;
  source: 'base' | 'project_global_override' | 'project_app_override';
  override_id: string | null;
  base_test_attribute_version_num: number;
}

export const projectTestAttributeOverridesApi = {
  /**
   * List all active test attribute overrides for a project control
   */
  async listOverridesForProjectControl(projectControlId: string): Promise<ProjectTestAttributeOverrideResponse[]> {
    return apiRequest<ProjectTestAttributeOverrideResponse[]>(
      `/v1/project-controls/${projectControlId}/test-attributes/overrides`
    );
  },

  /**
   * Create or update a project-level test attribute override
   */
  async upsertOverride(
    projectControlId: string,
    testAttributeId: string,
    data: ProjectTestAttributeOverrideUpsert
  ): Promise<ProjectTestAttributeOverrideResponse> {
    return apiRequest<ProjectTestAttributeOverrideResponse>(
      `/v1/project-controls/${projectControlId}/test-attributes/${testAttributeId}/override`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete (soft delete) a project test attribute override
   */
  async deleteOverride(overrideId: string): Promise<void> {
    return apiRequest<void>(`/v1/project-test-attribute-overrides/${overrideId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get the effective (resolved) test attribute with overrides applied
   */
  async getEffectiveTestAttribute(
    projectControlId: string,
    testAttributeId: string,
    applicationId?: string | null
  ): Promise<EffectiveTestAttributeResponse> {
    const params = applicationId ? `?application_id=${applicationId}` : '';
    return apiRequest<EffectiveTestAttributeResponse>(
      `/v1/project-controls/${projectControlId}/test-attributes/${testAttributeId}/effective${params}`
    );
  },
};

