'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email capture service (e.g., Mailchimp, ConvertKit)
    console.log('Email submitted:', email);
    setSubmitted(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="waitlist" className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Join the Waitlist
        </h2>
        <p className="text-xl text-primary-100 mb-12">
          Be among the first to experience AI-powered SOX audit validation.
          Limited pilot spots available.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                required
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button 
                type="submit"
                variant="secondary"
                size="lg"
                className="whitespace-nowrap"
              >
                Join Waitlist
              </Button>
            </div>
            <p className="text-primary-100 text-sm mt-4">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </form>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h3>
            <p className="text-primary-100">
              We&apos;ll be in touch soon with early access details.
            </p>
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-white">
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

