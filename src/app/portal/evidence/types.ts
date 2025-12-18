/**
 * Types for Evidence page
 */

export interface Project {
  id: string;
  name: string;
  year: string;
}

export interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  riskRating: 'High' | 'Medium' | 'Low';
  controlType: 'Preventive' | 'Detective' | 'Corrective';
  frequency: string;
  isKey: boolean;
  isAutomated: boolean;
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

