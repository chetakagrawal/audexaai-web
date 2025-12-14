'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Hero() {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToPilot = () => {
    router.push('/pilot/');
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-20 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <div className="inline-block mb-6">
              <span className="bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full text-sm font-medium">
                🚀 Enterprise AI for SOX Audits
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Validate SOX Evidence
              <span className="text-primary-400"> 90% Faster</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Audexa AI automates evidence validation end-to-end using advanced multimodal AI.
              Transform weeks of manual review into minutes of auditable insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                variant="primary" 
                size="lg"
                onClick={goToPilot}
              >
                Join Free Pilot →
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900"
                onClick={() => scrollToSection('demo')}
              >
                See Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SOC2 Aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Multi-Tenant</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visual/Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl p-8 backdrop-blur-sm border border-primary-500/30">
              <div className="bg-white/10 rounded-lg p-6 space-y-4">
                <div className="h-4 bg-primary-400/50 rounded w-3/4"></div>
                <div className="h-4 bg-primary-400/30 rounded w-1/2"></div>
                <div className="h-32 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary-300 text-sm">Evidence Analysis Visualization</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-white/10 rounded"></div>
                  <div className="h-20 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

