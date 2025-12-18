/**
 * API client for backend requests.
 * 
 * This is the main entry point that re-exports all API modules.
 * You can import from here or from individual modules.
 * 
 * @example
 * ```ts
 * import { projectsApi, controlsApi } from '@/lib/api';
 * // or
 * import { projectsApi } from '@/lib/api/projects';
 * ```
 */

// Core utilities
export {
  API_BASE_URL,
  type ApiError,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getDefaultMembershipId,
  setDefaultMembershipId,
  removeDefaultMembershipId,
  apiRequest,
} from './core';

// API modules
export { authApi } from './auth';
export { signupApi } from './signup';
export { setupApi, getSetupToken, setSetupToken, removeSetupToken } from './setup';
export { projectsApi } from './projects';
export { controlsApi } from './controls';
export { applicationsApi } from './applications';
export { testAttributesApi, type TestAttribute, type TestAttributeCreate } from './testAttributes';
