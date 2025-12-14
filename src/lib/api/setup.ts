/**
 * Setup API endpoints (for SSO onboarding)
 * These endpoints use setup tokens (passed as query params) instead of JWT auth
 */

import { API_BASE_URL } from './core';

export interface ApiError {
  detail: string;
}

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
