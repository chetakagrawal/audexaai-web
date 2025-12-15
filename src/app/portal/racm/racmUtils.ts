import { Control, ApiControl } from './types';

export const getRiskColor = (rating: string): string => {
  if (rating === 'High') return 'text-red-600';
  if (rating === 'Medium') return 'text-orange-600';
  return 'text-yellow-600';
};

// Convert API control to UI control format
export const convertApiControlToUI = (apiControl: ApiControl): Control => {
  return {
    id: apiControl.control_code || apiControl.id,
    name: apiControl.name,
    category: apiControl.category || 'Uncategorized',
    applicationsInScope: [], // Will be populated from control_applications junction table
    businessProcessOwner: { name: 'Not assigned', title: '' }, // Will be populated from memberships
    itOwner: { name: 'Not assigned', title: '' }, // Will be populated from memberships
    riskRating: (apiControl.risk_rating as 'High' | 'Medium' | 'Low') || 'Medium',
    type: (apiControl.control_type as 'Preventive' | 'Detective') || 'Preventive',
    frequency: apiControl.frequency || 'Not set',
    isKeyControl: apiControl.is_key,
    isAutomated: apiControl.is_automated,
  };
};
