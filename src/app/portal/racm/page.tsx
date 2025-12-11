import React from 'react';
import MetricCard from '@/components/portal/MetricCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Control {
  id: string;
  name: string;
  category: string;
  applicationsInScope: string[];
  businessProcessOwner: {
    name: string;
    title: string;
  };
  itOwner: {
    name: string;
    title: string;
  };
  riskRating: 'High' | 'Medium' | 'Low';
  type: 'Preventive' | 'Detective';
  frequency: string;
  isKeyControl: boolean;
  isAutomated: boolean;
}

export default function RACMPage() {
  const controls: Control[] = [
    {
      id: 'AC-001',
      name: 'User Access Provisioning',
      category: 'Access to Programs and Data',
      applicationsInScope: ['SAP ERP', 'Oracle Financials', 'Workday'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Sarah Chen', title: 'IT Security Manager' },
      riskRating: 'High',
      type: 'Preventive',
      frequency: 'Daily',
      isKeyControl: true,
      isAutomated: false,
    },
    {
      id: 'AC-002',
      name: 'User Access Review',
      category: 'Access to Programs and Data',
      applicationsInScope: ['SAP ERP', 'Oracle Financials', 'Workday', 'Salesforce'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Sarah Chen', title: 'IT Security Manager' },
      riskRating: 'High',
      type: 'Detective',
      frequency: 'Quarterly',
      isKeyControl: true,
      isAutomated: false,
    },
    {
      id: 'AC-003',
      name: 'Privileged Access Management',
      category: 'Access to Programs and Data',
      applicationsInScope: ['SAP ERP', 'Oracle Financials', 'SQL Server', 'PostgreSQL'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'David Park', title: 'Database Administrator' },
      riskRating: 'High',
      type: 'Preventive',
      frequency: 'Continuous',
      isKeyControl: true,
      isAutomated: true,
    },
    {
      id: 'AC-004',
      name: 'Segregation of Duties Review',
      category: 'Access to Programs and Data',
      applicationsInScope: ['SAP ERP', 'Oracle Financials'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Sarah Chen', title: 'IT Security Manager' },
      riskRating: 'High',
      type: 'Detective',
      frequency: 'Semi-Annual',
      isKeyControl: true,
      isAutomated: true,
    },
    {
      id: 'CM-001',
      name: 'Change Management Approval',
      category: 'Program Changes',
      applicationsInScope: ['SAP ERP', 'Oracle Financials', 'Custom Financial Apps'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Jennifer Liu', title: 'IT Operations Manager' },
      riskRating: 'High',
      type: 'Preventive',
      frequency: 'Continuous',
      isKeyControl: true,
      isAutomated: true,
    },
    {
      id: 'CM-002',
      name: 'Emergency Change Review',
      category: 'Program Changes',
      applicationsInScope: ['All Production Systems'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Jennifer Liu', title: 'IT Operations Manager' },
      riskRating: 'Medium',
      type: 'Detective',
      frequency: 'Weekly',
      isKeyControl: false,
      isAutomated: false,
    },
    {
      id: 'CM-003',
      name: 'Change Testing Requirements',
      category: 'Program Changes',
      applicationsInScope: ['SAP ERP', 'Oracle Financials', 'Workday', 'Custom Financial Apps'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Jennifer Liu', title: 'IT Operations Manager' },
      riskRating: 'High',
      type: 'Preventive',
      frequency: 'Continuous',
      isKeyControl: true,
      isAutomated: false,
    },
    {
      id: 'CO-001',
      name: 'Batch Job Monitoring',
      category: 'Computer Operations',
      applicationsInScope: ['SAP ERP', 'Oracle Financials', 'Data Warehouse'],
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Jennifer Liu', title: 'IT Operations Manager' },
      riskRating: 'High',
      type: 'Detective',
      frequency: 'Daily',
      isKeyControl: true,
      isAutomated: true,
    },
  ];

  const getRiskColor = (rating: string) => {
    if (rating === 'High') return 'text-red-600';
    if (rating === 'Medium') return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Risk & Control Matrix (RACM)</h1>
            <p className="text-gray-600 mt-1">Master control inventory that drives PBC requests and evidence requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export RACM
            </Button>
            <Button variant="primary" size="sm">
              + Add Control
            </Button>
          </div>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">SOX IT General Controls Template</h3>
              <p className="text-sm text-blue-800 mb-2">
                This pre-configured RACM contains standard SOX ITGC controls. You can use our template as-is or customize it for your organization.
              </p>
              <p className="text-xs text-blue-700">
                <strong>Automation:</strong> PBC requests are automatically generated from these controls, and control owners listed here become the default recipients.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
            value="18"
            label="Total Controls"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Key</span>
                </div>
              </div>
            }
            value="13"
            label="Key Controls"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            }
            value="13"
            label="High Risk Controls"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            }
            value="9"
            label="Automated Controls"
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search controls, risks, or descriptions..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Categories</option>
            <option>Access to Programs and Data</option>
            <option>Program Changes</option>
            <option>Computer Operations</option>
          </select>
          <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Risk Levels</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        {/* Controls Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Control ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Control Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applications in Scope
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Business Process Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    IT Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Risk Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Key Control
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Automated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {controls.map((control) => (
                  <tr key={control.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-gray-900">{control.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{control.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">{control.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {control.applicationsInScope.length > 2
                          ? `${control.applicationsInScope.slice(0, 2).join(', ')} +${control.applicationsInScope.length - 2}`
                          : control.applicationsInScope.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{control.businessProcessOwner.name}</div>
                      <div className="text-xs text-gray-500">{control.businessProcessOwner.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{control.itOwner.name}</div>
                      <div className="text-xs text-gray-500">{control.itOwner.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        <span className={`text-sm font-medium ${getRiskColor(control.riskRating)}`}>
                          {control.riskRating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{control.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{control.frequency}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {control.isKeyControl ? (
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-purple-700">Key</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-3 h-3 rounded-full ${control.isAutomated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

