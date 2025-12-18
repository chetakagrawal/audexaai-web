'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { controlsApi, testAttributesApi, TestAttribute, TestAttributeCreate } from '@/lib/api';
import AddTestAttributeModal from './components/AddTestAttributeModal';

interface ControlWithTestAttributes {
  id: string;
  control_code: string;
  name: string;
  category: string | null;
  testAttributes: TestAttribute[];
}

export default function TestAttributesPage() {
  const [expandedControls, setExpandedControls] = useState<Set<string>>(new Set());
  const [controls, setControls] = useState<ControlWithTestAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch controls and their test attributes on mount
  useEffect(() => {
    fetchControlsAndTestAttributes();
  }, []);

  const fetchControlsAndTestAttributes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all controls
      const apiControls = await controlsApi.listControls();
      
      // For each control, fetch its test attributes
      const controlsWithAttributes = await Promise.all(
        apiControls.map(async (control) => {
          try {
            const testAttributes = await testAttributesApi.listTestAttributes(control.id);
            return {
              id: control.id,
              control_code: control.control_code,
              name: control.name,
              category: control.category,
              testAttributes,
            };
          } catch (err) {
            console.error(`Failed to fetch test attributes for control ${control.id}:`, err);
            return {
              id: control.id,
              control_code: control.control_code,
              name: control.name,
              category: control.category,
              testAttributes: [],
            };
          }
        })
      );
      
      setControls(controlsWithAttributes);
      
      // Expand first control if any exist
      if (controlsWithAttributes.length > 0 && expandedControls.size === 0) {
        setExpandedControls(new Set([controlsWithAttributes[0].id]));
      }
    } catch (err) {
      console.error('Failed to fetch controls:', err);
      setError(err instanceof Error ? err.message : 'Failed to load controls');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleControl = (controlId: string) => {
    const newExpanded = new Set(expandedControls);
    if (newExpanded.has(controlId)) {
      newExpanded.delete(controlId);
    } else {
      newExpanded.add(controlId);
    }
    setExpandedControls(newExpanded);
  };

  const handleAddAttributeClick = (controlId: string) => {
    setSelectedControlId(controlId);
    setShowAddModal(true);
  };

  const handleCreateTestAttribute = async (data: TestAttributeCreate) => {
    if (!selectedControlId) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      await testAttributesApi.createTestAttribute(selectedControlId, data);
      
      // Refresh the data
      await fetchControlsAndTestAttributes();
      
      // Close modal
      setShowAddModal(false);
      setSelectedControlId(null);
    } catch (err) {
      console.error('Failed to create test attribute:', err);
      setError(err instanceof Error ? err.message : 'Failed to create test attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestAttribute = async (testAttributeId: string, controlId: string) => {
    if (!confirm('Are you sure you want to delete this test attribute?')) {
      return;
    }

    try {
      await testAttributesApi.deleteTestAttribute(testAttributeId);
      
      // Refresh the data
      await fetchControlsAndTestAttributes();
    } catch (err) {
      console.error('Failed to delete test attribute:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete test attribute');
    }
  };

  const selectedControl = selectedControlId 
    ? controls.find(c => c.id === selectedControlId)
    : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RACM & Test Attributes</h1>
          <p className="text-gray-600 mt-1">
            Manage SOX IT General Controls and their test attributes. Updates here automatically sync to Level 3 validation.
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading controls and test attributes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">RACM & Test Attributes</h1>
        <p className="text-gray-600 mt-1">
          Manage SOX IT General Controls and their test attributes. Updates here automatically sync to Level 3 validation.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-red-900">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-900 mb-2">
              These test attributes define what Level 3 validates against. Any changes you make here will immediately affect:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Level 3 test criteria validation process</li>
              <li>Evidence assessment requirements</li>
              <li>Audit findings and recommendations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Controls */}
      {controls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No controls found. Create controls in the RACM page first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {controls.map((control) => {
            const isExpanded = expandedControls.has(control.id);
            return (
              <div key={control.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Control Header */}
                <button
                  onClick={() => toggleControl(control.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{control.control_code}</h3>
                      <span className="text-gray-600">{control.name}</span>
                    </div>
                    {control.category && (
                      <p className="text-sm text-gray-600">{control.category}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{control.testAttributes.length} test attributes</span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Test Attributes (Expanded) */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">Test Attributes</h4>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleAddAttributeClick(control.id)}
                      >
                        + Add Attribute
                      </Button>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                      {control.testAttributes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No test attributes yet. Click "+ Add Attribute" to create one.
                        </div>
                      ) : (
                        control.testAttributes.map((attribute) => (
                          <Card key={attribute.id} className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-gray-900">{attribute.code}</span>
                                  <span className="text-gray-900">{attribute.name}</span>
                                </div>
                                {attribute.frequency && (
                                  <div className="text-sm text-gray-600 mb-3">
                                    <span className="font-medium">Frequency:</span> {attribute.frequency}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                  title="Edit (coming soon)"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => handleDeleteTestAttribute(attribute.id, control.id)}
                                  title="Delete"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="space-y-3">
                              {attribute.test_procedure && (
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Test Procedure:</div>
                                  <div className="text-sm text-gray-600">{attribute.test_procedure}</div>
                                </div>
                              )}
                              {attribute.expected_evidence && (
                                <div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">Expected Evidence:</div>
                                  <div className="text-sm text-gray-600">{attribute.expected_evidence}</div>
                                </div>
                              )}
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Test Attribute Modal */}
      <AddTestAttributeModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedControlId(null);
        }}
        onSubmit={handleCreateTestAttribute}
        isSubmitting={isSubmitting}
        controlCode={selectedControl?.control_code}
        controlName={selectedControl?.name}
      />
    </div>
  );
}
