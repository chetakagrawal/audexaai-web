'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/portal/DashboardLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

type ValidationStatus = 'pass' | 'warning' | 'fail';

interface ValidationLevel {
  l1: ValidationStatus;
  l2: ValidationStatus;
  l3: ValidationStatus;
  l4: ValidationStatus;
}

interface AuditMapping {
  id: string;
  name: string;
  framework: string;
  type: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  testCriteria: string;
  samples: { received: number; total: number };
  validation: ValidationLevel;
  status: ValidationStatus;
  aiConfidence: number;
  auditor: string;
  updated: string;
}

export default function AuditMappingPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const mappings: AuditMapping[] = [
    {
      id: 'AC-001',
      name: 'User Access Review',
      framework: 'SOX',
      type: 'Detective',
      riskLevel: 'High',
      testCriteria: 'Quarterly access reviews completed with documented approvals',
      samples: { received: 25, total: 25 },
      validation: { l1: 'pass', l2: 'pass', l3: 'pass', l4: 'pass' },
      status: 'pass',
      aiConfidence: 94,
      auditor: 'Sarah Johnson',
      updated: '2024-01-15',
    },
    {
      id: 'IT-045',
      name: 'Change Management Process',
      framework: 'COBIT',
      type: 'Preventive',
      riskLevel: 'Medium',
      testCriteria: 'All production changes require approval and testing evidence',
      samples: { received: 18, total: 18 },
      validation: { l1: 'pass', l2: 'warning', l3: 'warning', l4: 'pass' },
      status: 'warning',
      aiConfidence: 78,
      auditor: 'Michael Chen',
      updated: '2024-01-14',
    },
    {
      id: 'DB-023',
      name: 'Database Access Monitoring',
      framework: 'SOX',
      type: 'Detective',
      riskLevel: 'High',
      testCriteria: 'Database access logs reviewed monthly for unauthorized access',
      samples: { received: 30, total: 30 },
      validation: { l1: 'pass', l2: 'fail', l3: 'fail', l4: 'warning' },
      status: 'fail',
      aiConfidence: 91,
      auditor: 'Emily Rodriguez',
      updated: '2024-01-13',
    },
    {
      id: 'NET-078',
      name: 'Network Security Controls',
      framework: 'NIST',
      type: 'Preventive',
      riskLevel: 'Medium',
      testCriteria: 'Network firewall rules reviewed and updated quarterly',
      samples: { received: 22, total: 22 },
      validation: { l1: 'pass', l2: 'pass', l3: 'warning', l4: 'pass' },
      status: 'warning',
      aiConfidence: 85,
      auditor: 'Michael Chen',
      updated: '2024-01-12',
    },
  ];

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === mappings.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(mappings.map((m) => m.id)));
    }
  };

  const getValidationIcon = (status: ValidationStatus) => {
    switch (status) {
      case 'pass':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'fail':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case 'pass':
        return <Badge variant="success">Pass</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'Low':
        return <Badge variant="success">Low</Badge>;
      default:
        return <Badge>{risk}</Badge>;
    }
  };

  const passCount = mappings.filter((m) => m.status === 'pass').length;
  const warningCount = mappings.filter((m) => m.status === 'warning').length;
  const failCount = mappings.filter((m) => m.status === 'fail').length;
  const passRate = Math.round((passCount / mappings.length) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Final Audit Mapping Table</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive RACM mapping with AI validation results across all levels
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search controls..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                <option>All Frameworks</option>
                <option>SOX</option>
                <option>COBIT</option>
                <option>COSO</option>
                <option>NIST</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                <option>All Statuses</option>
                <option>Pass</option>
                <option>Warning</option>
                <option>Fail</option>
              </select>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Advanced Filters
              </Button>
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export to Excel
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {mappings.length} controls found
          </div>
        </div>

        {/* Audit Mapping Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === mappings.length && mappings.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Control ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Control Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Framework
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Test Criteria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Samples
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    L1
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    L2
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    L3
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    L4
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    AI %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Auditor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mappings.map((mapping) => (
                  <tr key={mapping.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(mapping.id)}
                        onChange={() => toggleRowSelection(mapping.id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" className="text-primary-600 hover:text-primary-800 font-medium">
                        {mapping.id}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{mapping.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{mapping.framework}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{mapping.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRiskBadge(mapping.riskLevel)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs">{mapping.testCriteria}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {mapping.samples.received}/{mapping.samples.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getValidationIcon(mapping.validation.l1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getValidationIcon(mapping.validation.l2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getValidationIcon(mapping.validation.l3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getValidationIcon(mapping.validation.l4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(mapping.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{mapping.aiConfidence}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{mapping.auditor}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{mapping.updated}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-primary-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Pass Rate</div>
                <div className="text-2xl font-bold text-gray-900">{passRate}%</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Controls</div>
                <div className="text-2xl font-bold text-gray-900">{mappings.length}</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Warnings</div>
                <div className="text-2xl font-bold text-gray-900">{warningCount}</div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Failures</div>
                <div className="text-2xl font-bold text-gray-900">{failCount}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

