/**
 * Test Attributes API endpoints
 */

import { apiRequest } from './core';

export interface TestAttribute {
  id: string;
  tenant_id: string;
  control_id: string;
  code: string;
  name: string;
  frequency: string | null;
  test_procedure: string | null;
  expected_evidence: string | null;
  created_at: string;
}

export interface TestAttributeCreate {
  code: string;
  name: string;
  frequency?: string | null;
  test_procedure?: string | null;
  expected_evidence?: string | null;
}

export const testAttributesApi = {
  /**
   * List all test attributes for a control
   */
  async listTestAttributes(controlId: string) {
    return apiRequest<TestAttribute[]>(`/v1/controls/${controlId}/test-attributes`);
  },

  /**
   * Get a specific test attribute by ID
   */
  async getTestAttribute(testAttributeId: string) {
    return apiRequest<TestAttribute>(`/v1/test-attributes/${testAttributeId}`);
  },

  /**
   * Create a new test attribute for a control
   */
  async createTestAttribute(controlId: string, data: TestAttributeCreate) {
    return apiRequest<TestAttribute>(`/v1/controls/${controlId}/test-attributes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a test attribute
   */
  async updateTestAttribute(testAttributeId: string, data: TestAttributeCreate) {
    return apiRequest<TestAttribute>(`/v1/test-attributes/${testAttributeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a test attribute
   */
  async deleteTestAttribute(testAttributeId: string) {
    return apiRequest<void>(`/v1/test-attributes/${testAttributeId}`, {
      method: 'DELETE',
    });
  },
};

