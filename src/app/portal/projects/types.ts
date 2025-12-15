export interface ApiProject {
  id: string;
  tenant_id: string;
  created_by_membership_id: string;
  name: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string | number;
  name: string;
  status: string;
  statusColor: 'blue' | 'orange' | 'green';
  client: string;
  period: string;
  progress: number;
  controls: number;
  evidence: number;
  validated: number;
  issues: number;
  assignedUsers: string[];
  lastUpdated: string;
}

export interface ProjectControl {
  id: string;
  tenant_id: string;
  project_id: string;
  control_id: string;
  is_key_override: boolean | null;
  frequency_override: string | null;
  notes: string | null;
  created_at: string;
}

export interface Control {
  id: string;
  control_code: string;
  name: string;
  category: string | null;
  risk_rating: string | null;
  control_type: string | null;
  frequency: string | null;
  is_key: boolean;
  is_automated: boolean;
}

export type Tab = 'overview' | 'controls';
