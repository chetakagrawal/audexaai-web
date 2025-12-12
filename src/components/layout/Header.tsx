'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo href="/" size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('solution')} className="text-gray-700 hover:text-primary-600 transition">
              Solution
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-primary-600 transition">
              How It Works
            </button>
            <button onClick={() => scrollToSection('security')} className="text-gray-700 hover:text-primary-600 transition">
              Security
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-primary-600 transition">
              Pricing
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleLoginClick}>
              Log In
            </Button>
            <Button variant="outline" size="sm" onClick={() => scrollToSection('demo')}>
              See Demo
            </Button>
            <Button variant="primary" size="sm" onClick={() => scrollToSection('waitlist')}>
              Join Waitlist
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('solution')} className="text-gray-700 hover:text-primary-600 text-left">
                Solution
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-primary-600 text-left">
                How It Works
              </button>
              <button onClick={() => scrollToSection('security')} className="text-gray-700 hover:text-primary-600 text-left">
                Security
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-primary-600 text-left">
                Pricing
              </button>
              <Button variant="outline" size="sm" onClick={handleLoginClick} className="w-full">
                Log In
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection('demo')} className="w-full">
                See Demo
              </Button>
              <Button variant="primary" size="sm" onClick={() => scrollToSection('waitlist')} className="w-full">
                Join Waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

