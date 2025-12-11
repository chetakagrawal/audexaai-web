import React from 'react';
import Card from '@/components/ui/Card';

export default function ProblemSolution() {
  return (
    <section id="solution" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Problem With Traditional SOX Audits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manual evidence review is slow, inconsistent, and resource-intensive
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card hover>
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Weeks of Manual Review</h3>
            <p className="text-gray-600">
              Auditors spend countless hours reviewing screenshots, exports, and PDFs manually
            </p>
          </Card>

          <Card hover>
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Inconsistent Results</h3>
            <p className="text-gray-600">
              Different auditors apply criteria differently, leading to varied conclusions
            </p>
          </Card>

          <Card hover>
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resource Drain</h3>
            <p className="text-gray-600">
              Senior auditors get bogged down in repetitive evidence validation
            </p>
          </Card>
        </div>

        {/* Solution Section */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Audexa AI Solution
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Automated, consistent, and auditable evidence validation powered by enterprise AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8">
              <div className="text-primary-600 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">90% Faster</h3>
              <p className="text-gray-600">
                Reduce weeks of manual review to minutes. AI processes thousands of files in parallel.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="text-primary-600 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Consistent</h3>
              <p className="text-gray-600">
                Same criteria applied every time. Transparent reasoning chains for audit trails.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="text-primary-600 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Context-Aware AI</h3>
              <p className="text-gray-600">
                Understands IT controls, SOX frameworks, and regulatory requirements out of the box.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="text-primary-600 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600">
                SOC2-aligned architecture with end-to-end encryption and multi-tenant isolation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

