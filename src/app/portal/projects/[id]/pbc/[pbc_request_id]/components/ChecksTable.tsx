'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { PbcRequestItemResponse } from '@/lib/api';

interface ChecksTableProps {
  items: PbcRequestItemResponse[];
  onEdit: (item: PbcRequestItemResponse) => void;
  getItemStatusColor: (status: string) => string;
}

export default function ChecksTable({ items, onEdit, getItemStatusColor }: ChecksTableProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return '—';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'base':
        return 'bg-blue-100 text-blue-800';
      case 'project_global_override':
        return 'bg-green-100 text-green-800';
      case 'project_app_override':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No checks yet</h3>
        <p className="text-gray-600">This PBC request has no checks.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Checks</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Check Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Effective Procedure
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Effective Evidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => {
              const isExpanded = expandedItems.has(item.id);
              const procedureText = item.effective_procedure_snapshot || null;
              const evidenceText = item.effective_evidence_snapshot || null;
              const showProcedureExpand = procedureText && procedureText.length > 100;
              const showEvidenceExpand = evidenceText && evidenceText.length > 100;
              const hasAnyLongText = showProcedureExpand || showEvidenceExpand;

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      Check {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {isExpanded || !showProcedureExpand ? (
                        <div className="whitespace-pre-wrap">{procedureText || '—'}</div>
                      ) : (
                        <div>
                          {truncateText(procedureText, 100)}
                          {hasAnyLongText && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-primary-600 hover:text-primary-800 ml-2 text-xs font-medium"
                            >
                              View
                            </button>
                          )}
                        </div>
                      )}
                      {isExpanded && hasAnyLongText && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-primary-600 hover:text-primary-800 mt-1 text-xs font-medium"
                        >
                          Collapse
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {isExpanded || !showEvidenceExpand ? (
                        <div className="whitespace-pre-wrap">{evidenceText || '—'}</div>
                      ) : (
                        <div>
                          {truncateText(evidenceText, 100)}
                          {hasAnyLongText && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-primary-600 hover:text-primary-800 ml-2 text-xs font-medium"
                            >
                              View
                            </button>
                          )}
                        </div>
                      )}
                      {isExpanded && hasAnyLongText && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-primary-600 hover:text-primary-800 mt-1 text-xs font-medium"
                        >
                          Collapse
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getSourceBadgeColor(item.source_snapshot)}>
                      {item.source_snapshot.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getItemStatusColor(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

