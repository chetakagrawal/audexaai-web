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

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
   */
  async devLogin(email: string, tenantSlug: string) {
    const response = await apiRequest<{
      access_token: string;
      token_type: string;
      user_id: string;
      tenant_id: string | null;  // Can be null for platform admins
      role: string;
      is_platform_admin: boolean;
    }>('/v1/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify({ email, tenant_slug: tenantSlug }),
    });

    // Store token
    setAuthToken(response.access_token);

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
   * Logout - removes token
   */
  logout() {
    removeAuthToken();
  },
};

