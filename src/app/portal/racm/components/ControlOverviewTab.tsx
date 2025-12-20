'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { Control } from '../types';
import { getRiskColor } from '../racmUtils';

interface ControlOverviewTabProps {
  control: Control;
}

export default function ControlOverviewTab({ control }: ControlOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Control Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Control Information</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Control ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{control.controlCode}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Control Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{control.name}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {control.description || 'No description provided'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1">
              <Badge variant="info">{control.category}</Badge>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Risk Rating</dt>
            <dd className="mt-1">
              <span className={`text-sm font-medium ${getRiskColor(control.riskRating)}`}>
                {control.riskRating}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Control Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{control.type}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Frequency</dt>
            <dd className="mt-1 text-sm text-gray-900">{control.frequency || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Key Control</dt>
            <dd className="mt-1">
              {control.isKeyControl ? (
                <Badge variant="default">Yes</Badge>
              ) : (
                <span className="text-sm text-gray-500">No</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Automated</dt>
            <dd className="mt-1">
              {control.isAutomated ? (
                <Badge variant="success">Yes</Badge>
              ) : (
                <span className="text-sm text-gray-500">No</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Ownership */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ownership</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Business Process Owner</dt>
            <dd className="mt-1 text-sm text-gray-900">{control.businessProcessOwner.name}</dd>
            {control.businessProcessOwner.title && (
              <dd className="text-xs text-gray-500">{control.businessProcessOwner.title}</dd>
            )}
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">IT Owner</dt>
            <dd className="mt-1 text-sm text-gray-900">{control.itOwner.name}</dd>
            {control.itOwner.title && (
              <dd className="text-xs text-gray-500">{control.itOwner.title}</dd>
            )}
          </div>
        </dl>
      </div>
    </div>
  );
}

