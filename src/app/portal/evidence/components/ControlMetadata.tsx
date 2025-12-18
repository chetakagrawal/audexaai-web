'use client';

import React from 'react';
import { ControlMetadata } from '../types';
import Badge from '@/components/ui/Badge';

interface ControlMetadataProps {
  metadata: ControlMetadata;
}

export default function ControlMetadataComponent({ metadata }: ControlMetadataProps) {
  const getStatusBadge = (status: ControlMetadata['status']) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="default">Draft</Badge>;
      case 'In Review':
        return <Badge variant="warning">In Review</Badge>;
      case 'Approved':
        return <Badge variant="success">Approved</Badge>;
      case 'Exception Noted':
        return <Badge variant="danger">Exception Noted</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Preparer */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Preparer</label>
          <select
            value={metadata.preparer?.id || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          >
            <option value="">
              {metadata.preparer ? metadata.preparer.name : 'Not assigned'}
            </option>
          </select>
        </div>

        {/* Prepared Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
          <input
            type="text"
            value={metadata.preparedDate || 'N/A'}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
        </div>

        {/* Reviewers */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Reviewers
            <span className="ml-1 text-xs text-gray-500">
              {metadata.reviewers.length > 0 ? `(${metadata.reviewers.length})` : ''}
            </span>
          </label>
          <select
            value=""
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          >
            <option value="">
              {metadata.reviewers.length > 0
                ? metadata.reviewers.map(r => r.name).join(', ')
                : 'No reviewers'}
            </option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
          <div className="flex items-center h-[38px]">
            {getStatusBadge(metadata.status)}
          </div>
        </div>
      </div>
    </div>
  );
}

