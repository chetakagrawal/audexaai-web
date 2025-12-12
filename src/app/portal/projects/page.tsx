import React from 'react';
import DashboardLayout from '@/components/portal/DashboardLayout';
import MetricCard from '@/components/portal/MetricCard';
import ProjectCard from '@/components/portal/ProjectCard';
import Button from '@/components/ui/Button';

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: 'Q4 2024 SOX Audit',
      status: 'Active',
      statusColor: 'blue',
      client: 'Acme Corporation',
      period: 'Oct - Dec 2024',
      progress: 68,
      controls: 230,
      evidence: 1450,
      validated: 156,
      issues: 8,
      assignedUsers: ['JD', 'SM', 'KL'],
      lastUpdated: '2 hours ago',
    },
    {
      id: 2,
      name: 'Annual IT General Controls',
      status: 'In Review',
      statusColor: 'orange',
      client: 'TechStart Inc',
      period: '2024',
      progress: 100,
      controls: 145,
      evidence: 890,
      validated: 145,
      issues: 3,
      assignedUsers: ['JD', 'AS'],
      lastUpdated: '1 day ago',
    },
    {
      id: 3,
      name: 'Access Control Assessment',
      status: 'Complete',
      statusColor: 'green',
      client: 'Global Finance Ltd',
      period: 'Q3 2024',
      progress: 100,
      controls: 89,
      evidence: 567,
      validated: 89,
      issues: 0,
      assignedUsers: ['SM', 'KL', 'AS'],
      lastUpdated: '5 days ago',
    },
    {
      id: 4,
      name: 'Database Security Audit',
      status: 'Active',
      statusColor: 'blue',
      client: 'RetailMax Corp',
      period: 'Nov 2024',
      progress: 63,
      controls: 67,
      evidence: 423,
      validated: 42,
      issues: 5,
      assignedUsers: ['JD', 'KL'],
      lastUpdated: '3 hours ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your audit engagements.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm">
              + New Project
            </Button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Status</option>
              <option>Active</option>
              <option>In Review</option>
              <option>Complete</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects or clients..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            }
            value="4"
            label="Total Projects"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            }
            value="2"
            label="Active Projects"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
            value="531"
            label="Total Controls"
          />
          <MetricCard
            icon={
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            }
            value="16"
            label="Open Issues"
          />
        </div>

        {/* Project Cards */}
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

