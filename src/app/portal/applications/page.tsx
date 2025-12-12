import React from 'react';
import DashboardLayout from '@/components/portal/DashboardLayout';
import MetricCard from '@/components/portal/MetricCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Application {
  id: number;
  name: string;
  category: string;
  categoryColor: string;
  businessProcessOwner: {
    name: string;
    title: string;
  };
  itOwner: {
    name: string;
    title: string;
  };
  controls: number;
  keyControls: number;
  scopeRationale: string;
}

export default function ApplicationsPage() {
  const applications: Application[] = [
    {
      id: 1,
      name: 'SAP ERP',
      category: 'Core Financial System',
      categoryColor: 'blue',
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Sarah Chen', title: 'IT Security Manager' },
      controls: 12,
      keyControls: 11,
      scopeRationale: 'Primary system for financial transaction processing, general ledger, accounts payable/receivable, and financial reporting',
    },
    {
      id: 2,
      name: 'Oracle Financials',
      category: 'Core Financial System',
      categoryColor: 'blue',
      businessProcessOwner: { name: 'Rachel Kim', title: 'Controller' },
      itOwner: { name: 'Sarah Chen', title: 'IT Security Manager' },
      controls: 12,
      keyControls: 11,
      scopeRationale: 'Secondary financial system used for subsidiary operations and consolidation of financial statements',
    },
    {
      id: 3,
      name: 'Workday',
      category: 'Financial-Significant System',
      categoryColor: 'blue',
      businessProcessOwner: { name: 'Lisa Anderson', title: 'Chief HR Officer' },
      itOwner: { name: 'Jennifer Liu', title: 'IT Operations Manager' },
      controls: 5,
      keyControls: 4,
      scopeRationale: 'Human capital management system that processes payroll and employee compensation impacting financial statements',
    },
    {
      id: 4,
      name: 'Salesforce',
      category: 'Financial-Significant System',
      categoryColor: 'blue',
      businessProcessOwner: { name: 'Mark Stevens', title: 'VP of Sales' },
      itOwner: { name: 'Alex Rodriguez', title: 'Development Manager' },
      controls: 1,
      keyControls: 1,
      scopeRationale: 'Customer relationship management system that feeds revenue recognition and accounts receivable processes',
    },
    {
      id: 5,
      name: 'SQL Server',
      category: 'Infrastructure',
      categoryColor: 'green',
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'David Park', title: 'Database Administrator' },
      controls: 3,
      keyControls: 3,
      scopeRationale: 'Database platform hosting critical financial data for custom applications and data warehousing',
    },
    {
      id: 6,
      name: 'PostgreSQL',
      category: 'Infrastructure',
      categoryColor: 'green',
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'David Park', title: 'Database Administrator' },
      controls: 1,
      keyControls: 1,
      scopeRationale: 'Database platform supporting financial applications with sensitive financial and customer data',
    },
    {
      id: 7,
      name: 'Data Warehouse',
      category: 'Reporting System',
      categoryColor: 'blue',
      businessProcessOwner: { name: 'Rachel Kim', title: 'Controller' },
      itOwner: { name: 'David Park', title: 'Database Administrator' },
      controls: 1,
      keyControls: 1,
      scopeRationale: 'Centralized repository for financial data used in regulatory reporting and management decision-making',
    },
    {
      id: 8,
      name: 'Custom Financial Apps',
      category: 'Custom Development',
      categoryColor: 'blue',
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Alex Rodriguez', title: 'Development Manager' },
      controls: 5,
      keyControls: 3,
      scopeRationale: 'Internally developed applications that automate financial calculations, reconciliations, and reporting processes',
    },
    {
      id: 9,
      name: 'Integration Middleware',
      category: 'Integration',
      categoryColor: 'blue',
      businessProcessOwner: { name: 'Michael Torres', title: 'Finance Director' },
      itOwner: { name: 'Alex Rodriguez', title: 'Development Manager' },
      controls: 3,
      keyControls: 1,
      scopeRationale: 'Integration layer that transfers financial data between systems, ensuring data integrity and completeness',
    },
    {
      id: 10,
      name: 'Active Directory',
      category: 'Infrastructure',
      categoryColor: 'green',
      businessProcessOwner: { name: 'Lisa Anderson', title: 'Chief HR Officer' },
      itOwner: { name: 'Sarah Chen', title: 'IT Security Manager' },
      controls: 1,
      keyControls: 1,
      scopeRationale: 'Central authentication and authorization system controlling access to all financial systems',
    },
  ];

  const getCategoryBadgeColor = (category: string) => {
    if (category === 'Core Financial System') return 'info';
    if (category === 'Infrastructure') return 'success';
    if (category === 'Development Environments') return 'warning';
    return 'info';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IT Application Scope</h1>
            <p className="text-gray-600 mt-1">Master inventory of applications in scope for SOX IT General Controls.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Export Applications
            </Button>
            <Button variant="primary" size="sm">
              + Add Application
            </Button>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Application-Control Mapping</h3>
              <p className="text-sm text-blue-800">
                This view shows all applications in scope and their associated SOX IT General Controls. Changes here automatically sync with the RACM. Note: The scope rationale explains why each application is included in SOX compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
            value="15"
            label="Total Applications"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            }
            value="2"
            label="Core Financial Systems"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
            }
            value="6"
            label="Infrastructure"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            }
            value="2"
            label="Development Environments"
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search applications, owners, or rationale..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Categories</option>
            <option>Core Financial System</option>
            <option>Financial-Significant System</option>
            <option>Infrastructure</option>
            <option>Reporting System</option>
            <option>Custom Development</option>
            <option>Integration</option>
            <option>Development Environments</option>
          </select>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Application Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Business Process Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    IT Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Controls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Key Controls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Scope Rationale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-gray-900">{app.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getCategoryBadgeColor(app.category) as any}>
                        {app.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{app.businessProcessOwner.name}</div>
                      <div className="text-xs text-gray-500">{app.businessProcessOwner.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{app.itOwner.name}</div>
                      <div className="text-xs text-gray-500">{app.itOwner.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{app.controls} controls</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-purple-700">{app.keyControls}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-md">{app.scopeRationale}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

