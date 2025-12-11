import React from 'react';
import Button from '@/components/ui/Button';

export default function DemoSection() {
  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="text-4xl font-bold mb-6">
              See Audexa AI In Action
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Watch how our 4-tier AI analysis engine transforms evidence validation from weeks to minutes.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold mb-1">Real Evidence Processing</div>
                  <p className="text-gray-400 text-sm">See actual audit evidence being analyzed in real-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold mb-1">4-Tier Pipeline Walkthrough</div>
                  <p className="text-gray-400 text-sm">Understand how each analysis tier builds on the previous</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold mb-1">Audit Trail Transparency</div>
                  <p className="text-gray-400 text-sm">Every conclusion backed by visible reasoning chains</p>
                </div>
              </div>
            </div>

            <Button variant="primary" size="lg" className="bg-primary-500 hover:bg-primary-600">
              Request Demo →
            </Button>
          </div>

          {/* Right Column - Glassmorphism Visualization */}
          <div className="relative">
            {/* Main Glassmorphism Panel */}
            <div className="relative rounded-2xl overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}>
              {/* Outer layer for depth */}
              <div className="absolute inset-0 rounded-2xl" style={{
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(13, 148, 136, 0.05) 100%)',
                backdropFilter: 'blur(10px)'
              }}></div>

              {/* Content Container */}
              <div className="relative p-8 space-y-6">
                {/* Top Section - Header/Navigation Bars */}
                <div className="space-y-3">
                  {/* Top Bar - Full Width */}
                  <div className="h-3 rounded-lg" style={{
                    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.4) 0%, rgba(20, 184, 166, 0.2) 100%)',
                    width: '100%'
                  }}></div>
                  {/* Bottom Bar - Left Aligned, Shorter */}
                  <div className="h-3 rounded-lg" style={{
                    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.5) 0%, rgba(20, 184, 166, 0.3) 100%)',
                    width: '60%'
                  }}></div>
                </div>

                {/* Middle Section - Evidence Analysis Visualization */}
                <div className="rounded-xl p-8 flex items-center justify-center min-h-[200px]" style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(13, 148, 136, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(20, 184, 166, 0.2)'
                }}>
                  <h3 className="text-2xl font-semibold text-primary-300 text-center">
                    Evidence Analysis Visualization
                  </h3>
                </div>

                {/* Bottom Section - Two Side-by-Side Blocks */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-6 min-h-[120px]" style={{
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(20, 184, 166, 0.2)'
                  }}>
                    {/* Placeholder for data/chart */}
                  </div>
                  <div className="rounded-xl p-6 min-h-[120px]" style={{
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(20, 184, 166, 0.2)'
                  }}>
                    {/* Placeholder for data/chart */}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Below Visualization */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-primary-400">{'< 30s'}</div>
                <div className="text-xs text-gray-300 mt-1">Per Evidence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-primary-400">100%</div>
                <div className="text-xs text-gray-300 mt-1">Consistent</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-primary-400">24/7</div>
                <div className="text-xs text-gray-300 mt-1">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
