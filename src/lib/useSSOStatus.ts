/**
 * Hook to check SSO status and handle redirects
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Check if an API error indicates SSO setup is required
 */
export function isSSOSetupRequired(error: Error | string): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message;
  return errorMessage.includes('SSO configuration required') || 
         errorMessage.includes('X-Requires-SSO-Setup');
}

/**
 * Hook to check SSO status when accessing portal routes
 * Redirects to onboarding if SSO setup is required
 */
export function useSSOStatusCheck() {
  const router = useRouter();

  useEffect(() => {
    // This will be called when portal routes make API calls
    // The apiRequest function handles 403 errors and redirects
    // This hook can be extended for more complex scenarios
  }, [router]);
}

/**
 * Handle API error responses that might require SSO setup redirect
 */
export function handleAPIError(error: Error): boolean {
  if (isSSOSetupRequired(error)) {
    // Redirect to onboarding
    if (typeof window !== 'undefined') {
      window.location.href = '/onboarding';
    }
    return true; // Error was handled
  }
  return false; // Error not handled
}
