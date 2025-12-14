/**
 * API client for backend requests.
 * Handles authentication tokens and error responses.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiError {
  detail: string;
}

/**
 * Get the stored authentication token.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Store the authentication token.
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Remove the authentication token.
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('default_membership_id');
}

/**
 * Get the stored default membership ID (for X-Membership-Id header).
 */
export function getDefaultMembershipId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('default_membership_id');
}

/**
 * Store the default membership ID.
 */
export function setDefaultMembershipId(membershipId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('default_membership_id', membershipId);
}

/**
 * Remove the default membership ID.
 */
export function removeDefaultMembershipId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('default_membership_id');
}

/**
 * Make an authenticated API request.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Automatically include X-Membership-Id header if available and not already set
  // This header is required for tenant-scoped endpoints
  const defaultMembershipId = getDefaultMembershipId();
  if (defaultMembershipId && !headers['X-Membership-Id']) {
    headers['X-Membership-Id'] = defaultMembershipId;
  }

  // Merge additional headers from options (these override defaults)
  if (options.headers) {
    const optHeaders = options.headers as Record<string, string>;
    Object.assign(headers, optHeaders);
  }

  try {
    console.log(`[API] Making request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      console.error(`[API] Error response:`, error);
      throw new Error(error.detail || 'Request failed');
    }

    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;
  } catch (err) {
    console.error(`[API] Request failed:`, err);
    // Handle network errors, CORS errors, etc.
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to backend at ${API_BASE_URL}. Make sure the backend is running on http://localhost:8000 and CORS is configured.`
      );
    }
    throw err;
  }
}

/**
 * Authentication API endpoints
 */
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

/**
 * Signup API endpoints
 */
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

