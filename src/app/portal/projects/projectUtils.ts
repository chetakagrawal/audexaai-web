import { ApiProject, Project } from './types';

// Helper to convert API project to UI project
export const convertApiProjectToUI = (apiProject: ApiProject): Project => {
  const getStatusColor = (status: string): 'blue' | 'orange' | 'green' => {
    if (status === 'active') return 'blue';
    if (status === 'in_review' || status === 'in review') return 'orange';
    if (status === 'complete') return 'green';
    return 'blue'; // default
  };

  const formatPeriod = (start: string | null, end: string | null): string => {
    if (!start && !end) return 'No period set';
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (start) {
      return `From ${new Date(start).toLocaleDateString()}`;
    }
    return `Until ${new Date(end!).toLocaleDateString()}`;
  };

  const formatLastUpdated = (updatedAt: string | null): string => {
    if (!updatedAt) return 'Never updated';
    
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  return {
    id: apiProject.id,
    name: apiProject.name,
    status: apiProject.status.charAt(0).toUpperCase() + apiProject.status.slice(1).replace(/_/g, ' '),
    statusColor: getStatusColor(apiProject.status),
    client: 'Current Tenant',
    period: formatPeriod(apiProject.period_start, apiProject.period_end),
    progress: 0,
    controls: 0,
    evidence: 0,
    validated: 0,
    issues: 0,
    assignedUsers: [],
    lastUpdated: formatLastUpdated(apiProject.updated_at),
  };
};

// UUID validation regex
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
