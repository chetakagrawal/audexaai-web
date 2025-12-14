'use client';

import React from 'react';
import PilotSignupForm from './PilotSignupForm';

export default function WaitlistSection() {
  return (
    <section id="waitlist" className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the Free Pilot
          </h2>
          <p className="text-xl text-primary-100">
            Be among the first to experience AI-powered SOX audit validation.
            Limited pilot spots available.
          </p>
        </div>

        <PilotSignupForm />

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-white text-center">
          <div>
            <div className="text-4xl font-bold mb-2">Free</div>
            <div className="text-primary-100">3-Month Pilot Program</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-primary-100">Files Analyzed Per Trial</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">90%</div>
            <div className="text-primary-100">Time Savings Average</div>
          </div>
        </div>
      </div>
    </section>
  );
}

