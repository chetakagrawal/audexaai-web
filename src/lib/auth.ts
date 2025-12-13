/**
 * Authentication utilities and helpers.
 */

import { getAuthToken, removeAuthToken } from './api';

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Check if user is authenticated.
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Get the stored auth token.
 */
export function getToken(): string | null {
  return getAuthToken();
}

/**
 * Logout the current user.
 */
export function logout(): void {
  removeAuthToken();
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login/';
  }
}

/**
 * Extract tenant slug from email domain.
 * Example: "user@company.com" -> "company"
 */
export function extractTenantSlugFromEmail(email: string): string {
  const domain = email.split('@')[1];
  if (!domain) return 'default';
  
  // Remove common TLDs and convert to slug
  const slug = domain
    .replace(/\.(com|org|net|io|co|ai)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  
  return slug || 'default';
}

