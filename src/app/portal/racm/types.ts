export interface Control {
  id: string; // UUID from backend
  controlCode: string; // Display code like "AC-001"
  name: string;
  category: string;
  applicationsInScope: string[];
  businessProcessOwner: {
    name: string;
    title: string;
  };
  itOwner: {
    name: string;
    title: string;
  };
  riskRating: 'High' | 'Medium' | 'Low';
  type: 'Preventive' | 'Detective';
  frequency: string;
  isKeyControl: boolean;
  isAutomated: boolean;
}

export interface Application {
  id: string;
  name: string;
}

export interface ControlFormData {
  control_code: string;
  name: string;
  category: string;
  risk_rating: string;
  control_type: string;
  frequency: string;
  is_key: boolean;
  is_automated: boolean;
}

export interface ApiApplication {
  id: string;
  tenant_id: string;
  name: string;
  category: string | null;
  scope_rationale: string | null;
  business_owner_membership_id: string | null;
  it_owner_membership_id: string | null;
  created_at: string;
}

export interface ApiControl {
  id: string;
  tenant_id: string;
  created_by_membership_id: string;
  control_code: string;
  name: string;
  category: string | null;
  risk_rating: string | null;
  control_type: string | null;
  frequency: string | null;
  is_key: boolean;
  is_automated: boolean;
  created_at: string;
  applications: ApiApplication[];
}
