'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import PilotSignupForm from '@/components/landing/PilotSignupForm';

export default function PilotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
      {/* Grid background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full text-sm font-medium">
                🚀 Free Pilot Program
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Join the Free Pilot
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Be among the first to experience AI-powered SOX audit validation.
              Limited spots available for our 3-month pilot program.
            </p>
          </div>

          <PilotSignupForm />

          {/* Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-white text-center">
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-xl p-6 border border-primary-500/30">
              <div className="text-3xl font-bold mb-2">Free</div>
              <div className="text-gray-300">3-Month Pilot Program</div>
            </div>
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-xl p-6 border border-primary-500/30">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-gray-300">Files Analyzed Per Trial</div>
            </div>
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-xl p-6 border border-primary-500/30">
              <div className="text-3xl font-bold mb-2">90%</div>
              <div className="text-gray-300">Time Savings Average</div>
            </div>
          </div>

          {/* What you get */}
          <div className="mt-16 bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What&apos;s Included in the Pilot
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Up to 500 evidence files',
                'Full 4-tier AI analysis',
                'Up to 5 users',
                'Email support',
                'Feedback sessions with product team',
                'Early access to new features',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
          <p>
            Questions? Email us at{' '}
            <a href="mailto:pilot@audexaai.com" className="text-primary-400 hover:text-primary-300 hover:underline transition-colors">
              pilot@audexaai.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

