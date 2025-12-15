import React from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface PBCRequest {
  id: string;
  name: string;
  samples: number;
  application: string;
  controls: string[];
  requestedEvidence: string;
  owner: string;
  dueDate: string;
  status: 'Completed' | 'In-Progress' | 'Sent';
  received: number;
  total: number;
  filesUploaded: number;
}

export default function PBCRequestsPage() {
  const requests: PBCRequest[] = [
    {
      id: 'PBC-001',
      name: 'Q4 2024 User Access Provisioning Approvals',
      samples: 25,
      application: 'SAP ERP',
      controls: ['ITGC-AC-01'],
      requestedEvidence: 'Access provisioning requests, manager approvals, role assignments, system access grants',
      owner: 'IT Security Team',
      dueDate: '2024-12-20',
      status: 'Completed',
      received: 25,
      total: 25,
      filesUploaded: 5,
    },
    {
      id: 'PBC-002',
      name: 'Q4 2024 Quarterly Access Review Documentation',
      samples: 25,
      application: 'SAP ERP',
      controls: ['ITGC-AC-03'],
      requestedEvidence: 'Quarterly access review documentation, approvals, remediation actions',
      owner: 'IT Security Team',
      dueDate: '2024-12-20',
      status: 'In-Progress',
      received: 18,
      total: 25,
      filesUploaded: 3,
    },
    {
      id: 'PBC-003',
      name: 'November 2024 Batch Job Monitoring Logs',
      samples: 25,
      application: 'Oracle Database',
      controls: ['ITGC-BC-01'],
      requestedEvidence: 'Batch job execution logs, error reports, resolution documentation',
      owner: 'Database Team',
      dueDate: '2024-12-15',
      status: 'Completed',
      received: 25,
      total: 25,
      filesUploaded: 4,
    },
    {
      id: 'PBC-004',
      name: 'Q4 2024 Production Changes with Approvals',
      samples: 30,
      application: 'SAP ERP',
      controls: ['ITGC-CM-01', 'ITGC-CM-02'],
      requestedEvidence: 'Change tickets, approval workflows, testing evidence, deployment confirmations',
      owner: 'DevOps Team',
      dueDate: '2024-12-22',
      status: 'Sent',
      received: 8,
      total: 30,
      filesUploaded: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In-Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Sent':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PBC Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage PBC requests and validate submitted evidence through the 4-tier AI analysis workflow.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search evidence requests..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Bulk Upload Requests
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            New Request
          </Button>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Evidence
          </Button>
        </div>

        {/* PBC Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Controls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Requested Evidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Due Date
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
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Badge variant="info" className="bg-purple-100 text-purple-800">
                          {request.id}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        PBC Request • {request.samples} samples
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{request.application}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {request.controls.map((control, index) => (
                          <Badge key={index} variant="info" className="bg-gray-100 text-gray-700">
                            {control}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-md">{request.requestedEvidence}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{request.owner}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{request.dueDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <div className="text-xs text-gray-600">
                          {request.received}/{request.total} received
                        </div>
                        <div className="text-xs text-gray-600">
                          {request.filesUploaded} files uploaded
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="outline" size="sm" className="text-xs">
                        Upload Evidence
                      </Button>
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

