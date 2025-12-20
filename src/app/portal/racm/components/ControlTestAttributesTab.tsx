'use client';

import React, { useState, useEffect } from 'react';
import { testAttributesApi, TestAttribute, TestAttributeCreate } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AddTestAttributeModal from './AddTestAttributeModal';
import EditTestAttributeModal from './EditTestAttributeModal';

interface ControlTestAttributesTabProps {
  controlId: string;
  controlCode?: string;
  controlName?: string;
}

export default function ControlTestAttributesTab({ 
  controlId, 
  controlCode, 
  controlName 
}: ControlTestAttributesTabProps) {
  const [testAttributes, setTestAttributes] = useState<TestAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTestAttribute, setEditingTestAttribute] = useState<TestAttribute | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTestAttributes();
  }, [controlId]);

  const fetchTestAttributes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const attributes = await testAttributesApi.listTestAttributes(controlId);
      setTestAttributes(attributes);
    } catch (err) {
      console.error('Failed to fetch test attributes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load test attributes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestAttribute = async (data: TestAttributeCreate) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await testAttributesApi.createTestAttribute(controlId, data);
      await fetchTestAttributes();
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create test attribute:', err);
      setError(err instanceof Error ? err.message : 'Failed to create test attribute');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTestAttribute = async (data: TestAttributeCreate) => {
    if (!editingTestAttribute) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await testAttributesApi.updateTestAttribute(editingTestAttribute.id, data);
      await fetchTestAttributes();
      setShowEditModal(false);
      setEditingTestAttribute(null);
    } catch (err) {
      console.error('Failed to update test attribute:', err);
      setError(err instanceof Error ? err.message : 'Failed to update test attribute');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (testAttribute: TestAttribute) => {
    setEditingTestAttribute(testAttribute);
    setShowEditModal(true);
  };

  const handleDeleteTestAttribute = async (testAttributeId: string) => {
    if (!confirm('Are you sure you want to delete this test attribute?')) {
      return;
    }

    try {
      setIsDeleting(testAttributeId);
      setError(null);
      await testAttributesApi.deleteTestAttribute(testAttributeId);
      await fetchTestAttributes();
    } catch (err) {
      console.error('Failed to delete test attribute:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete test attribute');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading test attributes...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Test Attributes</h2>
              <span className="text-sm text-gray-500">{testAttributes.length} test attributes</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              + Add Test Attribute
            </Button>
          </div>

          {testAttributes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No test attributes defined for this control.</p>
              <p className="text-sm mt-2">Click "+ Add Test Attribute" to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testAttributes.map((attribute) => (
                <Card key={attribute.id} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
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
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditClick(attribute)}
                        disabled={isDeleting === attribute.id}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit test attribute"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTestAttribute(attribute.id)}
                        disabled={isDeleting === attribute.id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete test attribute"
                      >
                        {isDeleting === attribute.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Test Attribute Modal */}
      <AddTestAttributeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateTestAttribute}
        isSubmitting={isSubmitting}
        controlCode={controlCode}
        controlName={controlName}
      />

      {/* Edit Test Attribute Modal */}
      <EditTestAttributeModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTestAttribute(null);
        }}
        onSubmit={handleUpdateTestAttribute}
        testAttribute={editingTestAttribute}
        isSubmitting={isSubmitting}
        controlCode={controlCode}
        controlName={controlName}
      />
    </>
  );
}

