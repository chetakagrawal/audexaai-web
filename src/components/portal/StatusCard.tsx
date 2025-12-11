import React from 'react';

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
}

export default function StatusCard({ icon, title, description, details }: StatusCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start gap-4">
        {icon}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-700 mb-1">{description}</p>
          <p className="text-xs text-gray-500">{details}</p>
        </div>
      </div>
    </div>
  );
}

