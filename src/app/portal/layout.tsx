'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '@/components/portal/DashboardLayout';
import { getAuthToken } from '@/lib/api';
import { ToastProvider } from '@/components/ui/ToastProvider';

/**
 * Portal Layout with SSO status check
 * 
 * This layout checks if the user needs to complete SSO setup.
 * If API calls return 403 with X-Requires-SSO-Setup header,
 * the apiRequest function will automatically redirect to onboarding.
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check if disabled via environment variable
    const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
    if (disableAuth) {
      return; // Allow access without authentication
    }

    // Check if user is authenticated
    const token = getAuthToken();
    
    // If no token and not already on login, redirect to login
    // Note: SSO setup redirect is handled by apiRequest when making API calls
    if (!token && !pathname?.includes('/login')) {
      router.push('/login');
    }
  }, [router, pathname]);

  return (
    <ToastProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ToastProvider>
  );
}
