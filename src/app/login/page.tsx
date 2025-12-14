'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { authApi, setDefaultMembershipId } from '@/lib/api';
import { extractTenantSlugFromEmail } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'sso' | 'direct'>('direct');
  const [email, setEmail] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSSOLogin = () => {
    // TODO: Implement SSO flow
    // 1. Detect company from email domain
    // 2. Redirect to company's SSO provider (SAML/OAuth)
    // 3. Handle callback and create session
    alert('SSO login coming soon! This will redirect to your company\'s SSO provider.');
  };

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Extract tenant slug from email if not provided
      const slug = tenantSlug || extractTenantSlugFromEmail(email);

      if (!email) {
        setError('Please enter your email address');
        setIsLoading(false);
        return;
      }

      // Call dev-login endpoint - now returns default_membership_id and next_url
      const loginResponse = await authApi.devLogin(email, slug);

      // If default_membership_id wasn't in login response, fetch memberships
      // This ensures we have the membership ID for X-Membership-Id header
      if (!loginResponse.default_membership_id) {
        try {
          const membershipsResponse = await authApi.getMemberships();
          if (membershipsResponse.default_membership_id) {
            setDefaultMembershipId(membershipsResponse.default_membership_id);
          }
        } catch (membershipsErr) {
          // If fetching memberships fails, continue anyway - user might be platform admin
          console.warn('Could not fetch memberships:', membershipsErr);
        }
      }

      // Navigate to next_url from login response
      // This will be "/portal/dashboard" if user has memberships, "/no-access" otherwise
      router.push(loginResponse.next_url);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Login failed. Please try again.';
      
      // More user-friendly error messages
      let displayError = errorMessage;
      if (errorMessage.includes('Cannot connect to backend')) {
        displayError = 'Cannot connect to backend. Make sure the backend is running on http://localhost:8000';
      } else if (errorMessage.includes('Failed to fetch')) {
        displayError = 'Network error. Check that the backend is running and CORS is configured.';
      }
      
      setError(displayError);
      setIsLoading(false);
      console.error('Login error:', err);
    }
  };

  // Show nothing until mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

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
                    Employees: Sign in using your company&apos;s SSO (Okta, Azure AD, Google Workspace, etc.)
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@company.com"
                  disabled
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter your company email. We&apos;ll redirect you to your SSO provider.
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
                    Dev Login: Enter your email to authenticate. Tenant will be auto-detected from email domain.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="direct-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="direct-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="tenant-slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant Slug (optional - auto-detected from email)
                </label>
                <input
                  type="text"
                  id="tenant-slug"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="company-name"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to auto-detect from email domain
                </p>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
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
                  <Link href="/pilot/">
                    <Button variant="primary" size="sm" className="w-full">
                      Join Free Pilot
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
