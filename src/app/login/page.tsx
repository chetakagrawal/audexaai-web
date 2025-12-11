'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'sso' | 'direct'>('sso');
  const [companyDomain, setCompanyDomain] = useState('');

  const handleSSOLogin = () => {
    // TODO: Implement SSO flow
    // 1. Detect company from email domain
    // 2. Redirect to company's SSO provider (SAML/OAuth)
    // 3. Handle callback and create session
    alert('SSO login coming soon! This will redirect to your company\'s SSO provider.');
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement direct login
    // 1. Validate credentials
    // 2. Check if user is admin/internal
    // 3. Create session
    alert('Direct login coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo href="/" size="lg" showTagline={true} className="justify-center" />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">
            Sign in to access your Audexa AI dashboard
          </p>

          {/* Login Method Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setLoginMethod('sso')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition ${
                loginMethod === 'sso'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Company SSO
            </button>
            <button
              onClick={() => setLoginMethod('direct')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition ${
                loginMethod === 'direct'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Direct Login
            </button>
          </div>

          {/* SSO Login */}
          {loginMethod === 'sso' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    Employees: Sign in using your company's SSO (Okta, Azure AD, Google Workspace, etc.)
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={companyDomain}
                  onChange={(e) => setCompanyDomain(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@company.com"
                  disabled
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter your company email. We'll redirect you to your SSO provider.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSSOLogin}
                disabled
              >
                Continue with SSO
              </Button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Supported: Okta, Azure AD, Google Workspace, OneLogin, Auth0, and more
                </p>
              </div>
            </div>
          )}

          {/* Direct Login */}
          {loginMethod === 'direct' && (
            <form onSubmit={handleDirectLogin} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-amber-800">
                    Admins & Internal Users: Use direct email/password login
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="direct-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="direct-email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="admin@audexaai.com"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                  disabled
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" disabled />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <Link href="/#waitlist" className="text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>

              <Button variant="primary" size="lg" type="submit" className="w-full" disabled>
                Sign In
              </Button>
            </form>
          )}

          {/* Coming Soon Message */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-primary-900 font-medium mb-1">Login Portal Coming Soon</p>
                  <p className="text-xs text-primary-700 mb-3">
                    Multi-tenant SSO and direct login will be available for pilot program participants.
                  </p>
                  <Link href="/#waitlist">
                    <Button variant="primary" size="sm" className="w-full">
                      Join Waitlist for Early Access
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-sm text-primary-600 hover:text-primary-700">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Enterprise-grade security with multi-tenant data isolation</p>
        </div>
      </div>
    </div>
  );
}
