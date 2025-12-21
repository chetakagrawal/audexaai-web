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

export interface ApplicationResponse {
  id: string;
  tenant_id: string;
  name: string;
  category: string | null;
  scope_rationale: string | null;
  business_owner_membership_id: string | null;
  it_owner_membership_id: string | null;
  created_at: string;
  created_by_membership_id?: string | null;
  updated_at?: string | null;
  updated_by_membership_id?: string | null;
  deleted_at?: string | null;
  deleted_by_membership_id?: string | null;
  row_version?: number;
}

export interface ProjectControlApplicationResponse {
  id: string;
  tenant_id: string;
  project_control_id: string;
  application_id: string;
  application_version_num: number;
  source: string;
  added_at: string;
  added_by_membership_id: string;
  removed_at: string | null;
  removed_by_membership_id: string | null;
  application?: ApplicationResponse;
}

