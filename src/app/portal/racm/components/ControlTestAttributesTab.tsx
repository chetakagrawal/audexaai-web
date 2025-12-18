'use client';

import React, { useState, useEffect } from 'react';
import { testAttributesApi, TestAttribute } from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ControlTestAttributesTabProps {
  controlId: string;
}

export default function ControlTestAttributesTab({ controlId }: ControlTestAttributesTabProps) {
  const [testAttributes, setTestAttributes] = useState<TestAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusBadge = (status: string) => {
    // This is a placeholder - test attributes don't have status in the API
    // but we can add visual indicators if needed
    return null;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading test attributes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-900">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Test Attributes</h2>
          <span className="text-sm text-gray-500">{testAttributes.length} test attributes</span>
        </div>

        {testAttributes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No test attributes defined for this control.</p>
            <p className="text-sm mt-2">Add test attributes from the Test Attributes page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testAttributes.map((attribute) => (
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
  );
}

