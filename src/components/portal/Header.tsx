'use client';

import React, { useState, useEffect } from 'react';
import Logo from '@/components/ui/Logo';
import { authApi } from '@/lib/api';

export default function Header() {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    tenant_id: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const me = await authApi.getMe();
        setUserInfo({
          name: me.name,
          tenant_id: me.tenant_id,
        });
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <Logo href="/portal/dashboard" size="sm" />

        {/* Center: Dashboard Title with Tenant/User Info */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg">
              {loading ? (
                <span className="text-sm text-gray-500">Loading...</span>
              ) : userInfo ? (
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-900">
                    {userInfo.tenant_id ? (
                      <>
                        <span className="text-gray-600">Tenant:</span>{' '}
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {userInfo.tenant_id}
                        </span>
                        {' | '}
                        <span className="text-gray-600">User:</span>{' '}
                        <span className="font-semibold">{userInfo.name}</span>
                      </>
                    ) : (
                      <span className="font-semibold">{userInfo.name} (Platform Admin)</span>
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Audexa AI Dashboard</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm">
            Share
          </button>
        </div>
      </div>
    </header>
  );
}

