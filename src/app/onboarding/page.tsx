'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { setupApi, setSetupToken, removeSetupToken } from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    tenant_name: string;
    tenant_slug: string;
  } | null>(null);

  // Get token from URL query param
  const tokenFromUrl = searchParams.get('token');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const validateToken = async () => {
      // Check if token exists in URL
      if (!tokenFromUrl) {
        setTokenError('No setup token provided. Please use the link from your setup email.');
        setIsValidating(false);
        return;
      }

      try {
        setIsValidating(true);
        setTokenError(null);

        // Validate token with backend
        const validation = await setupApi.validateToken(tokenFromUrl);

        if (!validation.valid) {
          const errorMessage = validation.reason || 'Invalid or expired setup token';
          setTokenError(errorMessage);
          setIsValidating(false);
          return;
        }

        // Token is valid - store it and user info
        setSetupToken(tokenFromUrl);

        if (validation.user_name && validation.user_email && validation.tenant_name && validation.tenant_slug) {
          setUserInfo({
            name: validation.user_name,
            email: validation.user_email,
            tenant_name: validation.tenant_name,
            tenant_slug: validation.tenant_slug,
          });
        } else {
          setTokenError('Invalid response from server. Missing user or tenant information.');
        }

        setIsValidating(false);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to validate setup token. Please try again.';
        
        setTokenError(errorMessage);
        setIsValidating(false);
        console.error('Token validation error:', err);
      }
    };

    validateToken();
  }, [mounted, tokenFromUrl]);

  const handleGoToLogin = () => {
    removeSetupToken();
    router.push('/login');
  };

  // Show nothing until mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <Logo href="/" size="lg" showTagline={true} className="justify-center mb-8" />
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-600">Validating setup token...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (tokenError || !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Logo href="/" size="lg" showTagline={true} className="justify-center" />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Setup Token</h1>
              <p className="text-gray-600 mb-6">
                {tokenError || 'The setup token is invalid or expired.'}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">What to do:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Check that you&apos;re using the most recent setup email</li>
                    <li>Ensure the setup link hasn&apos;t expired (tokens expire after 7 days)</li>
                    <li>Contact your administrator if you need a new setup token</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mb-4"
              onClick={handleGoToLogin}
            >
              Go to Login
            </Button>

            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show welcome and progress
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo href="/" size="lg" showTagline={true} className="justify-center" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
              <svg
                className="h-8 w-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Audexa AI, {userInfo.name}!
            </h1>
            <p className="text-lg text-gray-600">
              Let&apos;s set up Single Sign-On (SSO) for <strong>{userInfo.tenant_name}</strong>
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-4">
                {/* Step 1: SSO Setup */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white font-semibold">
                      1
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-900">SSO Setup</span>
                  </div>
                </div>

                {/* Connector */}
                <div className="w-16 h-0.5 bg-gray-300"></div>

                {/* Step 2: Complete */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 text-gray-600 font-semibold">
                      2
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-500">Complete</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Step 1 of 2: Configure your SSO provider
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">What&apos;s Next?</p>
                <p className="mb-2">
                  You&apos;ll configure your SSO provider (SAML 2.0 or OIDC) on the next page. This typically takes 5-10 minutes and requires admin access to your SSO provider (Okta, Azure AD, Google Workspace, etc.).
                </p>
                <p>
                  Once configured, all users from <strong>{userInfo.tenant_name}</strong> will be able to sign in using your company&apos;s SSO.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto px-12"
              onClick={() => {
                // Navigate to SSO configuration form (Phase 2)
                router.push('/onboarding/configure-sso');
              }}
            >
              Continue to SSO Configuration
            </Button>
          </div>

          {/* User Info (subtle) */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Setting up for: <strong>{userInfo.email}</strong> • {userInfo.tenant_name}
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGoToLogin}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
