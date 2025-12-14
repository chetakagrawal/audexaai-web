/**
 * Signup API endpoints
 */

import { apiRequest } from './core';

export const signupApi = {
  /**
   * Create a new signup request
   */
  async createSignup(data: {
    email: string;
    full_name?: string;
    company_name?: string;
    company_domain?: string;
    requested_auth_mode?: 'sso' | 'direct';
    metadata?: Record<string, unknown>;
  }) {
    return apiRequest<{
      id: string;
      status: string;
    }>('/v1/signups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
