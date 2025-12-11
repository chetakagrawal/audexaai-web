import React from 'react';
import Badge from '@/components/ui/Badge';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-4">The Audexa Engine</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            4-Tier AI Analysis Pipeline
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced multimodal AI processes your evidence through four specialized analysis tiers
          </p>
        </div>

        <div className="space-y-12">
          {/* Tier 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-2">1</div>
                <div className="text-xl font-semibold">Raw Facts Extraction</div>
              </div>
            </div>
            <div className="md:w-2/3 bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Per-Evidence Analysis</h3>
              <p className="text-gray-600 mb-4">
                AI extracts structured facts directly from images, Excel files, Word documents, PDFs, and more.
                Each piece of evidence is analyzed individually using advanced multimodal AI to capture all relevant data points—no OCR parsing required.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Image Analysis</Badge>
                <Badge variant="info">Excel Processing</Badge>
                <Badge variant="info">Word/PDF Analysis</Badge>
                <Badge variant="info">Multimodal AI</Badge>
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-2">2</div>
                <div className="text-xl font-semibold">Consolidation & Cross-Analysis</div>
              </div>
            </div>
            <div className="md:w-2/3 bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Clustering</h3>
              <p className="text-gray-600 mb-4">
                AI clusters samples, builds timelines, detects anomalies, and consolidates multi-image evidence.
                Understand patterns and outliers across your entire sample set.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Sample Clustering</Badge>
                <Badge variant="info">Timeline Building</Badge>
                <Badge variant="info">Anomaly Detection</Badge>
                <Badge variant="info">Cross-Reference</Badge>
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-primary-700 to-primary-800 text-white rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-2">3</div>
                <div className="text-xl font-semibold">Test Criteria Validation</div>
              </div>
            </div>
            <div className="md:w-2/3 bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">RACM Mapping</h3>
              <p className="text-gray-600 mb-4">
                Extracted facts are mapped to RACM test criteria to determine pass/fail with transparent reasoning chains.
                Every conclusion is backed by traceable logic.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Pass/Fail Logic</Badge>
                <Badge variant="info">Reasoning Chains</Badge>
                <Badge variant="info">RACM Alignment</Badge>
                <Badge variant="warning">Exception Flagging</Badge>
              </div>
            </div>
          </div>

          {/* Tier 4 */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-white rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-2">4</div>
                <div className="text-xl font-semibold">System Aggregation</div>
              </div>
            </div>
            <div className="md:w-2/3 bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Application-Level Insights</h3>
              <p className="text-gray-600 mb-4">
                AI aggregates Tier 3 outputs into application-level summaries, deviations, and risk insights.
                Get the big picture with executive-ready reporting.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">System Summaries</Badge>
                <Badge variant="warning">Risk Analysis</Badge>
                <Badge variant="info">Trend Detection</Badge>
                <Badge variant="success">Audit Reports</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            This 4-tier engine is the foundation of all Audexa AI workflows
          </p>
          <div className="inline-flex items-center gap-2 bg-primary-50 px-6 py-3 rounded-lg">
            <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-primary-900 font-semibold">
              Processes thousands of files in parallel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

