'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LineItem } from '../types';
import { ProjectControl, Control } from '../types';
import {
  ApplicationResponse,
  TestAttribute,
  projectTestAttributeOverridesApi,
  ProjectTestAttributeOverrideResponse,
  testAttributesApi,
} from '@/lib/api';
import LineItemOverrideModal from './LineItemOverrideModal';

interface LineItemsTabProps {
  projectId: string;
  projectControls: ProjectControl[];
  getControlDetails: (controlId: string) => Control | undefined;
  scopedApplicationsByControl: Record<string, ApplicationResponse[]>;
  filterByProjectControlId?: string | null;
}

interface LineItemWithBase extends LineItem {
  baseProcedure: string | null;
  baseEvidence: string | null;
  baseFrequency: string | null;
}

export default function LineItemsTab({
  projectId,
  projectControls,
  getControlDetails,
  scopedApplicationsByControl,
  filterByProjectControlId,
}: LineItemsTabProps) {
  const [lineItems, setLineItems] = useState<LineItemWithBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedControlFilter, setSelectedControlFilter] = useState<string | null>(
    filterByProjectControlId || null
  );
  const [showOnlyOverridden, setShowOnlyOverridden] = useState(false);
  const [editingLineItem, setEditingLineItem] = useState<LineItemWithBase | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [overridesByProjectControl, setOverridesByProjectControl] = useState<
    Record<string, ProjectTestAttributeOverrideResponse[]>
  >({});

  // Fetch all data needed for line items
  useEffect(() => {
    const fetchLineItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const items: LineItemWithBase[] = [];
        const overridesMap: Record<string, ProjectTestAttributeOverrideResponse[]> = {};

        // Fetch overrides for all project controls
        for (const projectControl of projectControls) {
          try {
            const overrides = await projectTestAttributeOverridesApi.listOverridesForProjectControl(
              projectControl.id
            );
            overridesMap[projectControl.id] = overrides.filter((o) => !o.deleted_at);
          } catch (err) {
            console.error(`Failed to fetch overrides for control ${projectControl.id}:`, err);
            overridesMap[projectControl.id] = [];
          }
        }
        setOverridesByProjectControl(overridesMap);

        // For each project control, create line items
        for (const projectControl of projectControls) {
          const control = getControlDetails(projectControl.control_id);
          if (!control) continue;

          const scopedApps = scopedApplicationsByControl[projectControl.id] || [];
          const overrides = overridesMap[projectControl.id] || [];

          // Fetch test attributes for this control
          let testAttributes: TestAttribute[] = [];
          try {
            testAttributes = await testAttributesApi.listTestAttributes(projectControl.control_id);
          } catch (err) {
            console.error(`Failed to fetch test attributes for control ${projectControl.control_id}:`, err);
            continue;
          }

          // Create line items: apps × test attributes
          // If no apps scoped, create one line item with applicationId = null
          const appsToUse = scopedApps.length > 0 ? scopedApps : [null];

          for (const app of appsToUse) {
            for (const testAttr of testAttributes) {
              // Find applicable override (app-specific first, then global)
              let override: ProjectTestAttributeOverrideResponse | null = null;
              if (app) {
                override =
                  overrides.find(
                    (o) =>
                      o.test_attribute_id === testAttr.id &&
                      o.application_id === app.id &&
                      !o.deleted_at
                  ) || null;
              }
              if (!override) {
                override =
                  overrides.find(
                    (o) =>
                      o.test_attribute_id === testAttr.id &&
                      o.application_id === null &&
                      !o.deleted_at
                  ) || null;
              }

              const isOverridden = !!override;
              const effectiveProcedure = override?.procedure_override ?? testAttr.test_procedure;
              const effectiveEvidence = override?.expected_evidence_override ?? testAttr.expected_evidence;
              const effectiveFrequency = override?.frequency_override ?? testAttr.frequency;

              items.push({
                id: `${projectControl.id}-${app?.id || 'null'}-${testAttr.id}`,
                projectControlId: projectControl.id,
                projectControlCode: control.control_code,
                projectControlName: control.name,
                applicationId: app?.id || null,
                applicationName: app?.name || null,
                testAttributeId: testAttr.id,
                testAttributeCode: testAttr.code,
                testAttributeName: testAttr.name,
                effectiveProcedure,
                effectiveEvidence,
                effectiveFrequency,
                source: isOverridden ? 'project_override' : 'base',
                overrideId: override?.id || null,
                isOverridden,
                baseProcedure: testAttr.test_procedure,
                baseEvidence: testAttr.expected_evidence,
                baseFrequency: testAttr.frequency,
              });
            }
          }
        }

        setLineItems(items);
      } catch (err) {
        console.error('Failed to fetch line items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load line items');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectControls.length > 0) {
      fetchLineItems();
    } else {
      setIsLoading(false);
    }
  }, [projectControls, getControlDetails, scopedApplicationsByControl]);

  // Filter line items
  const filteredItems = useMemo(() => {
    let filtered = lineItems;

    // Filter by selected control
    if (selectedControlFilter) {
      filtered = filtered.filter((item) => item.projectControlId === selectedControlFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.projectControlCode.toLowerCase().includes(query) ||
          item.projectControlName.toLowerCase().includes(query) ||
          item.applicationName?.toLowerCase().includes(query) ||
          item.testAttributeCode.toLowerCase().includes(query) ||
          item.testAttributeName.toLowerCase().includes(query)
      );
    }

    // Filter by override status
    if (showOnlyOverridden) {
      filtered = filtered.filter((item) => item.isOverridden);
    }

    return filtered;
  }, [lineItems, searchQuery, selectedControlFilter, showOnlyOverridden]);

  const handleEditOverride = (item: LineItemWithBase) => {
    setEditingLineItem(item);
  };

  const handleSaveOverride = async (data: {
    application_id?: string | null;
    procedure_override?: string | null;
    expected_evidence_override?: string | null;
    frequency_override?: string | null;
    notes?: string | null;
  }) => {
    if (!editingLineItem) return;

    setIsSaving(true);
    try {
      await projectTestAttributeOverridesApi.upsertOverride(
        editingLineItem.projectControlId,
        editingLineItem.testAttributeId,
        data
      );

      // Refresh overrides for this project control
      const overrides = await projectTestAttributeOverridesApi.listOverridesForProjectControl(
        editingLineItem.projectControlId
      );
      setOverridesByProjectControl((prev) => ({
        ...prev,
        [editingLineItem.projectControlId]: overrides.filter((o) => !o.deleted_at),
      }));

      // Refresh line items
      const updatedItems = lineItems.map((item) => {
        if (
          item.projectControlId === editingLineItem.projectControlId &&
          item.testAttributeId === editingLineItem.testAttributeId &&
          item.applicationId === editingLineItem.applicationId
        ) {
          // Find the new override
          const override = overrides.find(
            (o) =>
              o.test_attribute_id === editingLineItem.testAttributeId &&
              o.application_id === editingLineItem.applicationId &&
              !o.deleted_at
          );

          if (override) {
            return {
              ...item,
              effectiveProcedure: override.procedure_override ?? item.baseProcedure,
              effectiveEvidence: override.expected_evidence_override ?? item.baseEvidence,
              effectiveFrequency: override.frequency_override ?? item.baseFrequency,
              source: 'project_override' as const,
              overrideId: override.id,
              isOverridden: true,
            };
          }
        }
        return item;
      });
      setLineItems(updatedItems);

      setEditingLineItem(null);
    } catch (err) {
      console.error('Failed to save override:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOverride = async () => {
    if (!editingLineItem || !editingLineItem.overrideId) return;

    setIsSaving(true);
    try {
      await projectTestAttributeOverridesApi.deleteOverride(editingLineItem.overrideId);

      // Refresh overrides
      const overrides = await projectTestAttributeOverridesApi.listOverridesForProjectControl(
        editingLineItem.projectControlId
      );
      setOverridesByProjectControl((prev) => ({
        ...prev,
        [editingLineItem.projectControlId]: overrides.filter((o) => !o.deleted_at),
      }));

      // Update line item
      const updatedItems = lineItems.map((item) => {
        if (
          item.projectControlId === editingLineItem.projectControlId &&
          item.testAttributeId === editingLineItem.testAttributeId &&
          item.applicationId === editingLineItem.applicationId
        ) {
          return {
            ...item,
            effectiveProcedure: item.baseProcedure,
            effectiveEvidence: item.baseEvidence,
            effectiveFrequency: item.baseFrequency,
            source: 'base' as const,
            overrideId: null,
            isOverridden: false,
          };
        }
        return item;
      });
      setLineItems(updatedItems);

      setEditingLineItem(null);
    } catch (err) {
      console.error('Failed to delete override:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return '—';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const uniqueControls = useMemo(() => {
    const controls = new Map<string, { id: string; code: string; name: string }>();
    lineItems.forEach((item) => {
      if (!controls.has(item.projectControlId)) {
        controls.set(item.projectControlId, {
          id: item.projectControlId,
          code: item.projectControlCode,
          name: item.projectControlName,
        });
      }
    });
    return Array.from(controls.values());
  }, [lineItems]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading line items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Line Items</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by control, app, or test attribute..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Control</label>
            <select
              value={selectedControlFilter || ''}
              onChange={(e) => setSelectedControlFilter(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Controls</option>
              {uniqueControls.map((control) => (
                <option key={control.id} value={control.id}>
                  {control.code} - {control.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyOverridden}
                onChange={(e) => setShowOnlyOverridden(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Show only overridden</span>
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No line items found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Control
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Attribute
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective Procedure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective Evidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.projectControlCode}</div>
                      <div className="text-sm text-gray-500">{item.projectControlName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.applicationName || 'All Applications'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.testAttributeCode}</div>
                      <div className="text-sm text-gray-500">{item.testAttributeName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={item.effectiveProcedure || ''}>
                        {truncateText(item.effectiveProcedure, 80)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate" title={item.effectiveEvidence || ''}>
                        {truncateText(item.effectiveEvidence, 80)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={item.isOverridden ? 'success' : 'default'}>
                        {item.isOverridden ? 'Project Override' : 'Base'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOverride(item)}
                      >
                        {item.isOverridden ? 'Edit Override' : 'Override'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {editingLineItem && (
        <LineItemOverrideModal
          lineItem={editingLineItem}
          baseProcedure={editingLineItem.baseProcedure}
          baseEvidence={editingLineItem.baseEvidence}
          baseFrequency={editingLineItem.baseFrequency}
          isOpen={!!editingLineItem}
          onClose={() => setEditingLineItem(null)}
          onSave={handleSaveOverride}
          onDelete={editingLineItem.isOverridden ? handleDeleteOverride : undefined}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

