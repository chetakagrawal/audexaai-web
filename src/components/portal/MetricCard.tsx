import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: string;
  trendPositive?: boolean;
  status?: string;
}

export default function MetricCard({ icon, value, label, trend, trendPositive, status }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        {icon}
        {trend && (
          <span className={`text-sm font-medium ${trendPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
        {status && (
          <span className="text-sm font-medium text-orange-600">
            {status}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

