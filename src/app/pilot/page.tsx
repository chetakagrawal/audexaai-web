'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import PilotSignupForm from '@/components/landing/PilotSignupForm';

export default function PilotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <Link 
            href="/" 
            className="text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Join the Free Pilot
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Be among the first to experience AI-powered SOX audit validation.
              Limited spots available for our 3-month pilot program.
            </p>
          </div>

          <PilotSignupForm />

          {/* Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-white text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">Free</div>
              <div className="text-primary-100">3-Month Pilot Program</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Files Analyzed Per Trial</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">90%</div>
              <div className="text-primary-100">Time Savings Average</div>
            </div>
          </div>

          {/* What you get */}
          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
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
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-primary-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto text-center text-primary-200 text-sm">
          <p>
            Questions? Email us at{' '}
            <a href="mailto:pilot@audexaai.com" className="text-white hover:underline">
              pilot@audexaai.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

