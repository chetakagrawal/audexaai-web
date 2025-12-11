import React from 'react';
import DashboardLayout from '@/components/portal/DashboardLayout';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

