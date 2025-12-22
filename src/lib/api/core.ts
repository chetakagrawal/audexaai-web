/**
 * Core API utilities and types.
 * Handles authentication tokens, base URL, and the main API request function.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

    // Handle 204 No Content responses (no body to parse)
    if (response.status === 204) {
      console.log(`[API] Success: 204 No Content`);
      return undefined as T;
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
