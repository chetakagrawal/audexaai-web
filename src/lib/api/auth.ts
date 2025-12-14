/**
 * Authentication API endpoints
 */

import {
  apiRequest,
  setAuthToken,
  setDefaultMembershipId,
  removeAuthToken,
  removeDefaultMembershipId,
} from './core';

export const authApi = {
  /**
   * Dev login - creates/finds tenant and user, returns JWT token
   * Now includes default_membership_id and next_url for routing
   */
  async devLogin(email: string, tenantSlug: string) {
    const response = await apiRequest<{
      access_token: string;
      token_type: string;
      user_id: string;
      tenant_id: string | null;  // Can be null for platform admins
      role: string;
      is_platform_admin: boolean;
      default_membership_id: string | null;
      next_url: string;
      memberships: Array<{
        membership_id: string;
        tenant_id: string;
        tenant_name: string;
        role: string;
      }>;
    }>('/v1/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify({ email, tenant_slug: tenantSlug }),
    });

    // Store token
    setAuthToken(response.access_token);

    // Store default membership ID if available (for X-Membership-Id header)
    if (response.default_membership_id) {
      setDefaultMembershipId(response.default_membership_id);
    }

    return response;
  },

  /**
   * Get current user info
   */
  async getMe() {
    return apiRequest<{
      id: string;
      email: string;  // primary_email
      name: string;
      tenant_id: string | null;  // Can be null for platform admins
      role: string | null;  // Can be null for platform admins
      is_platform_admin: boolean;
    }>('/v1/me');
  },

  /**
   * Get all memberships for the current user
   * Returns all user memberships with tenant details and default_membership_id
   */
  async getMemberships() {
    return apiRequest<{
      default_membership_id: string | null;
      memberships: Array<{
        membership_id: string;
        tenant_id: string;
        tenant_name: string;
        tenant_slug: string;
        role: string;
        is_default: boolean;
      }>;
    }>('/v1/me/memberships');
  },

  /**
   * Logout - removes token and membership ID
   */
  logout() {
    removeAuthToken();
    removeDefaultMembershipId();
  },
};
