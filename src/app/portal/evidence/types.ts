/**
 * Types for Evidence page
 */

export interface Project {
  id: string;
  name: string;
  year?: string; // Optional, can be derived from period_start/period_end
  status?: string;
  period_start?: string | null;
  period_end?: string | null;
}

export interface Control {
  id: string;
  code: string;
  name: string;
  description?: string;
  riskRating: 'High' | 'Medium' | 'Low' | null;
  controlType: 'Preventive' | 'Detective' | 'Corrective' | null;
  frequency: string | null;
  isKey: boolean;
  isAutomated: boolean;
  category?: string | null;
}

export interface Application {
  id: string;
  name: string;
}

export interface Preparer {
  id: string;
  name: string;
}

export interface Reviewer {
  id: string;
  name: string;
}

export interface ControlMetadata {
  preparer: Preparer | null;
  preparedDate: string | null;
  reviewers: Reviewer[];
  status: 'Draft' | 'In Review' | 'Approved' | 'Exception Noted';
}

export interface TestingProgress {
  l1: number; // 0-100
  l2: number;
  l3: number;
  l4: number;
}

export type TabType = 'evidence' | 'l1-extraction' | 'l2-analysis' | 'l3-test-attributes' | 'l4-summary' | 'findings';

export interface EvidenceFile {
  id: string;
  fileName: string;
  source: string; // e.g., "PBC-001"
  uploadedBy: string;
  uploadedDate: string;
  status: 'Processed' | 'Needs Review' | 'Approved' | 'Rejected';
  autoMapped: boolean;
}

