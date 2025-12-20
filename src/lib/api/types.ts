/**
 * Shared API response types
 */

export interface ProjectControlResponse {
  id: string;
  tenant_id: string;
  project_id: string;
  control_id: string;
  control_version_num: number;
  is_key_override: boolean | null;
  frequency_override: string | null;
  notes: string | null;
  added_at: string;
  added_by_membership_id: string;
  removed_at: string | null;
  removed_by_membership_id: string | null;
  created_at: string;
  updated_at: string | null;
  updated_by_membership_id: string | null;
}

