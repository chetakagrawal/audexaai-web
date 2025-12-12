'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/portal/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface TestAttribute {
  id: string;
  name: string;
  frequency: string;
  testProcedure: string;
  expectedEvidence: string;
}

interface ITGCControl {
  id: string;
  name: string;
  description: string;
  category: string;
  testAttributes: TestAttribute[];
}

export default function TestAttributesPage() {
  const [expandedControls, setExpandedControls] = useState<Set<string>>(new Set(['ITGC-AC-03']));

  const itgcControls: ITGCControl[] = [
    {
      id: 'ITGC-AC-01',
      name: 'Access Controls',
      description: 'User Access Reviews',
      category: 'Access Controls',
      testAttributes: [
        {
          id: 'TA-AC-01-01',
          name: 'Quarterly Access Review Completion',
          frequency: 'Quarterly',
          testProcedure: 'Verify that quarterly access reviews are completed for all financial systems',
          expectedEvidence: 'Access review reports with reviewer signatures and completion dates',
        },
        {
          id: 'TA-AC-01-02',
          name: 'Access Review Remediation',
          frequency: 'Quarterly',
          testProcedure: 'Confirm that access exceptions identified in reviews are remediated within 30 days',
          expectedEvidence: 'Exception remediation log with timestamps and approval documentation',
        },
        {
          id: 'TA-AC-01-03',
          name: 'Terminated User Access Removal',
          frequency: 'Quarterly',
          testProcedure: 'Verify that terminated user access is removed within 24 hours of termination',
          expectedEvidence: 'Termination log and access removal confirmation reports',
        },
        {
          id: 'TA-AC-01-04',
          name: 'Access Review Documentation',
          frequency: 'Quarterly',
          testProcedure: 'Confirm access review documentation is maintained and accessible',
          expectedEvidence: 'Access review documentation repository with version control',
        },
      ],
    },
    {
      id: 'ITGC-AC-03',
      name: 'Access Controls',
      description: 'Access Provisioning & De-provisioning',
      category: 'Access Controls',
      testAttributes: [
        {
          id: 'TA-AC-03-01',
          name: 'Orphaned Account Management',
          frequency: 'Quarterly',
          testProcedure: 'Verify orphaned accounts (no manager) are identified and remediated',
          expectedEvidence: 'List of orphaned accounts with manager assignments or access removal',
        },
        {
          id: 'TA-AC-03-02',
          name: 'Privileged Access Justification',
          frequency: 'Quarterly',
          testProcedure: 'Confirm all privileged access has documented business justification',
          expectedEvidence: 'Privileged access listing with justification and approval',
        },
        {
          id: 'TA-AC-03-03',
          name: 'Role-Based Access Consistency',
          frequency: 'Quarterly',
          testProcedure: 'Verify access levels are consistent with documented role profiles',
          expectedEvidence: 'User access vs. role profile comparison report',
        },
        {
          id: 'TA-AC-03-04',
          name: 'Segregation of Duties',
          frequency: 'Quarterly',
          testProcedure: 'Confirm no SOD conflicts exist in critical business processes',
          expectedEvidence: 'SOD conflict analysis report with resolution documentation',
        },
      ],
    },
  ];

  const toggleControl = (controlId: string) => {
    const newExpanded = new Set(expandedControls);
    if (newExpanded.has(controlId)) {
      newExpanded.delete(controlId);
    } else {
      newExpanded.add(controlId);
    }
    setExpandedControls(newExpanded);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RACM & Test Attributes</h1>
          <p className="text-gray-600 mt-1">
            Manage SOX IT General Controls and their test attributes. Updates here automatically sync to Level 3 validation.
          </p>
        </div>

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

        {/* ITGC Controls */}
        <div className="space-y-4">
          {itgcControls.map((control) => {
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
                      <h3 className="text-lg font-semibold text-gray-900">{control.id}</h3>
                      <span className="text-gray-600">{control.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{control.description}</p>
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
                      <Button variant="primary" size="sm">
                        + Add Attribute
                      </Button>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                      {control.testAttributes.map((attribute) => (
                        <Card key={attribute.id} className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900">{attribute.id}</span>
                                <span className="text-gray-900">{attribute.name}</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">Frequency:</span> {attribute.frequency}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Test Procedure:</div>
                              <div className="text-sm text-gray-600">{attribute.testProcedure}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Expected Evidence:</div>
                              <div className="text-sm text-gray-600">{attribute.expectedEvidence}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

