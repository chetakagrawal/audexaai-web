/**
 * API client for backend requests.
 * Handles authentication tokens and error responses.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

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
    // In dev mode, if backend is not available, return empty data structure
    if (DEV_MODE) {
      console.log(`[API] Dev mode: Skipping request to: ${url}`);
      // Return empty object/array based on endpoint - this allows UI to render
      if (endpoint.includes('/memberships')) {
        return { default_membership_id: null, memberships: [] } as T;
      }
      if (endpoint.includes('/me')) {
        return { id: '', email: 'dev@example.com', name: 'Dev User', is_platform_admin: false } as T;
      }
      return {} as T;
    }

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
      
      // Check if SSO setup is required (403 with specific header/message)
      if (response.status === 403) {
        const requiresSSOSetup = response.headers.get('X-Requires-SSO-Setup') === 'true';
        const errorDetail = error.detail || '';
        
        if (requiresSSOSetup || errorDetail.includes('SSO configuration required')) {
          // Redirect to onboarding if SSO setup is required
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/onboarding')) {
            console.log('[API] SSO setup required, redirecting to onboarding');
            window.location.href = '/onboarding';
            // Return a promise that never resolves to prevent further execution
            return new Promise(() => {}) as T;
          }
        }
      }
      
      throw new Error(error.detail || 'Request failed');
    }

    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;
  } catch (err) {
    console.error(`[API] Request failed:`, err);
    
    // In dev mode, gracefully handle network errors
    if (DEV_MODE && err instanceof TypeError && err.message === 'Failed to fetch') {
      console.warn(`[API] Dev mode: Backend not available, returning empty data`);
      // Return empty structure based on endpoint
      if (endpoint.includes('/memberships')) {
        return { default_membership_id: null, memberships: [] } as T;
      }
      if (endpoint.includes('/me')) {
        return { id: '', email: 'dev@example.com', name: 'Dev User', is_platform_admin: false } as T;
      }
      return {} as T;
    }
    
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

/**
 * Setup token storage (for SSO onboarding)
 */
export function getSetupToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('setup_token');
}

export function setSetupToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('setup_token', token);
}

export function removeSetupToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('setup_token');
}

/**
 * Setup API endpoints (for SSO onboarding)
 * These endpoints use setup tokens (passed as query params) instead of JWT auth
 */
export const setupApi = {
  /**
   * Validate setup token
   * Returns user and tenant info if token is valid
   */
  async validateToken(token: string) {
    // Setup endpoints don't use JWT auth, so we make a direct fetch request
    const url = `${API_BASE_URL}/v1/setup/validate?token=${encodeURIComponent(token)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json() as Promise<{
      valid: boolean;
      user_id?: string;
      tenant_id?: string;
      signup_id?: string;
      user_name?: string;
      user_email?: string;
      tenant_name?: string;
      tenant_slug?: string;
      reason?: string;
    }>;
  },

  /**
   * Configure SSO (requires setup token in query param)
   */
  async configureSSO(token: string, config: {
    provider_type: 'saml' | 'oidc';
    saml_config?: {
      metadata_url?: string;
      entity_id?: string;
      sso_url?: string;
      x509_certificate?: string;
    };
    oidc_config?: {
      client_id: string;
      client_secret: string;
      discovery_url: string;
      redirect_uri?: string;
    };
  }) {
    const url = `${API_BASE_URL}/v1/setup/sso/configure?token=${encodeURIComponent(token)}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json() as Promise<{
      id: string;
      tenant_id: string;
      provider_type: 'saml' | 'oidc';
      is_configured: boolean;
      created_at: string;
      updated_at: string;
    }>;
  },

  /**
   * Test SSO connection (requires setup token in query param)
   */
  async testSSO(token: string, config: {
    provider_type: 'saml' | 'oidc';
    saml_config?: {
      metadata_url?: string;
      entity_id?: string;
      sso_url?: string;
      x509_certificate?: string;
    };
    oidc_config?: {
      client_id: string;
      client_secret: string;
      discovery_url: string;
      redirect_uri?: string;
    };
  }) {
    const url = `${API_BASE_URL}/v1/setup/sso/test?token=${encodeURIComponent(token)}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json() as Promise<{
      success: boolean;
      message?: string;
      config_id?: string;
    }>;
  },

  /**
   * Complete SSO setup (requires setup token in query param)
   */
  async completeSetup(token: string) {
    const url = `${API_BASE_URL}/v1/setup/sso/complete?token=${encodeURIComponent(token)}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json() as Promise<{
      success: boolean;
      message: string;
    }>;
  },
};

