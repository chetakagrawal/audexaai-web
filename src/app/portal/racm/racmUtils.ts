import { Control, ApiControl } from './types';

// UUID regex pattern for validating control IDs
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getRiskColor = (rating: string): string => {
  if (rating === 'High') return 'text-red-600';
  if (rating === 'Medium') return 'text-orange-600';
  return 'text-yellow-600';
};

// Convert API control to UI control format
export const convertApiControlToUI = (apiControl: ApiControl): Control => {
  return {
    id: apiControl.id, // Use UUID for navigation
    controlCode: apiControl.control_code, // Use control_code for display
    name: apiControl.name,
    category: apiControl.category || 'Uncategorized',
    applicationsInScope: apiControl.applications?.map(app => app.name) || [],
    businessProcessOwner: { name: 'Not assigned', title: '' }, // Will be populated from memberships
    itOwner: { name: 'Not assigned', title: '' }, // Will be populated from memberships
    riskRating: (apiControl.risk_rating as 'High' | 'Medium' | 'Low') || 'Medium',
    type: (apiControl.control_type as 'Preventive' | 'Detective') || 'Preventive',
    frequency: apiControl.frequency || 'Not set',
    isKeyControl: apiControl.is_key,
    isAutomated: apiControl.is_automated,
  };
};
