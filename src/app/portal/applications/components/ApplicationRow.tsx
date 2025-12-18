'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import { applicationsApi } from '@/lib/api';

interface Application {
  id: string;
  name: string;
  category: string | null;
  scope_rationale: string | null;
  business_owner_membership_id: string | null;
  it_owner_membership_id: string | null;
  created_at: string;
}

interface Control {
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

interface Membership {
  id: string;
  user_name: string;
  user_email: string;
  role: string;
}

interface ApplicationRowProps {
  application: Application;
  memberships: Membership[];
  onEdit: (application: Application) => void;
}

export default function ApplicationRow({ application, memberships, onEdit }: ApplicationRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [controls, setControls] = useState<Control[]>([]);
  const [isLoadingControls, setIsLoadingControls] = useState(false);
  const [controlsError, setControlsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchControls = async () => {
      if (isExpanded && controls.length === 0 && !isLoadingControls) {
        setIsLoadingControls(true);
        setControlsError(null);
        try {
          const controlsData = await applicationsApi.getApplicationControls(application.id);
          setControls(controlsData);
        } catch (error) {
          console.error('Failed to fetch controls:', error);
          setControlsError('Failed to load controls');
        } finally {
          setIsLoadingControls(false);
        }
      }
    };

    fetchControls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, application.id]);

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't expand if clicking the edit button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(application);
  };

  const getCategoryBadgeColor = (category: string | null) => {
    if (!category) return 'info';
    if (category === 'Core Financial System') return 'info';
    if (category === 'Infrastructure') return 'success';
    if (category === 'Development Environments') return 'warning';
    return 'info';
  };

  const getRiskColor = (rating: string | null) => {
    if (!rating) return 'text-gray-600';
    if (rating === 'High') return 'text-red-600';
    if (rating === 'Medium') return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <>
      <tr 
        onClick={handleRowClick}
        className="hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-gray-900">{application.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {application.category && (
            <Badge variant={getCategoryBadgeColor(application.category) as 'info' | 'success' | 'warning'}>
              {application.category}
            </Badge>
          )}
        </td>
        <td className="px-6 py-4">
          {application.business_owner_membership_id ? (
            <>
              <div className="text-sm text-gray-900">
                {memberships.find(m => m.id === application.business_owner_membership_id)?.user_name || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                {memberships.find(m => m.id === application.business_owner_membership_id)?.role || ''}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">Not assigned</span>
          )}
        </td>
        <td className="px-6 py-4">
          {application.it_owner_membership_id ? (
            <>
              <div className="text-sm text-gray-900">
                {memberships.find(m => m.id === application.it_owner_membership_id)?.user_name || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                {memberships.find(m => m.id === application.it_owner_membership_id)?.role || ''}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">Not assigned</span>
          )}
        </td>
        <td className="px-6 py-4">
          <p className="text-sm text-gray-600 max-w-md">{application.scope_rationale || '—'}</p>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={handleEditClick}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Edit
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">Mapped Controls</h4>
              {isLoadingControls ? (
                <div className="text-sm text-gray-500">Loading controls...</div>
              ) : controlsError ? (
                <div className="text-sm text-red-600">{controlsError}</div>
              ) : controls.length === 0 ? (
                <div className="text-sm text-gray-500">No controls mapped to this application.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Control Code</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Control Name</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Risk Rating</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Frequency</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Key Control</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Automated</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {controls.map((control) => (
                        <tr key={control.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm font-mono text-gray-900">{control.control_code}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{control.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{control.category || '—'}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={getRiskColor(control.risk_rating)}>
                              {control.risk_rating || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">{control.control_type || '—'}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{control.frequency || '—'}</td>
                          <td className="px-4 py-2 text-sm">
                            {control.is_key ? (
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-semibold text-purple-700">Key</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <div className={`w-3 h-3 rounded-full ${control.is_automated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

