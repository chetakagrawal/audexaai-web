'use client';

import React from 'react';
import { TabType } from '../types';

interface EvidenceTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'evidence', label: 'Evidence' },
  { id: 'l1-extraction', label: 'AI L1: Extraction' },
  { id: 'l2-analysis', label: 'AI L2: Analysis' },
  { id: 'l3-test-attributes', label: 'AI L3: Test Attributes' },
  { id: 'l4-summary', label: 'AI L4: Summary' },
  { id: 'findings', label: 'Findings' },
];

export default function EvidenceTabs({ activeTab, onTabChange }: EvidenceTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

