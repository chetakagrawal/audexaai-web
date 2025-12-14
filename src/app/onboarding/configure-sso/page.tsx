'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { setupApi, getSetupToken, removeSetupToken } from '@/lib/api';

type ProviderType = 'saml' | 'oidc';
type SAMLConfigMethod = 'metadata_url' | 'manual';

interface SAMLConfig {
  method: SAMLConfigMethod;
  metadata_url?: string;
  entity_id?: string;
  sso_url?: string;
  x509_certificate?: string;
}

interface OIDCConfig {
  client_id: string;
  client_secret: string;
  discovery_url: string;
  redirect_uri: string;
}

export default function ConfigureSSOPage() {
  const router = useRouter();
  const [providerType, setProviderType] = useState<ProviderType>('saml');
  const [samlConfig, setSamlConfig] = useState<SAMLConfig>({ method: 'metadata_url' });
  const [oidcConfig, setOidcConfig] = useState<OIDCConfig>({
    client_id: '',
    client_secret: '',
    discovery_url: '',
    redirect_uri: 'https://app.audexaai.com/auth/oidc/callback',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [setupToken, setSetupToken] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = getSetupToken();
    if (!token) {
      // No token, redirect back to onboarding
      router.push('/onboarding?error=no-token');
      return;
    }
    setSetupToken(token);
  }, [router]);

  const validateSAMLConfig = (): string | null => {
    if (samlConfig.method === 'metadata_url') {
      if (!samlConfig.metadata_url?.trim()) {
        return 'Metadata URL is required';
      }
      if (!isValidUrl(samlConfig.metadata_url)) {
        return 'Metadata URL must be a valid URL';
      }
    } else {
      // Manual configuration
      if (!samlConfig.entity_id?.trim()) {
        return 'Entity ID is required';
      }
      if (!samlConfig.sso_url?.trim()) {
        return 'SSO URL is required';
      }
      if (!samlConfig.x509_certificate?.trim()) {
        return 'x509 Certificate is required';
      }
      if (!isValidUrl(samlConfig.sso_url)) {
        return 'SSO URL must be a valid URL';
      }
      if (!isValidCertificate(samlConfig.x509_certificate)) {
        return 'Certificate must include -----BEGIN CERTIFICATE----- and -----END CERTIFICATE-----';
      }
    }
    return null;
  };

  const validateOIDCConfig = (): string | null => {
    if (!oidcConfig.client_id?.trim()) {
      return 'Client ID is required';
    }
    if (!oidcConfig.client_secret?.trim()) {
      return 'Client Secret is required';
    }
    if (!oidcConfig.discovery_url?.trim()) {
      return 'Discovery URL is required';
    }
    if (!isValidUrl(oidcConfig.discovery_url)) {
      return 'Discovery URL must be a valid URL';
    }
    return null;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidCertificate = (cert: string): boolean => {
    return cert.includes('-----BEGIN CERTIFICATE-----') && cert.includes('-----END CERTIFICATE-----');
  };

  const handleTestConnection = async () => {
    if (!setupToken) {
      setError('Setup token not found. Please start over from the setup email.');
      return;
    }

    setError(null);
    setTestSuccess(null);
    setIsLoading(true);

    try {
      let config: {
        provider_type: 'saml' | 'oidc';
        saml_config?: {
          metadata_url?: string;
          entity_id?: string;
          sso_url?: string;
          x509_certificate?: string;
        };
        oidc_config?: {
          client_id: string;
          client_secret: string;
          discovery_url: string;
          redirect_uri?: string;
        };
      };

      if (providerType === 'saml') {
        const validationError = validateSAMLConfig();
        if (validationError) {
          setError(validationError);
          setIsLoading(false);
          return;
        }

        config = {
          provider_type: 'saml',
          saml_config: samlConfig.method === 'metadata_url'
            ? { metadata_url: samlConfig.metadata_url }
            : {
                entity_id: samlConfig.entity_id,
                sso_url: samlConfig.sso_url,
                x509_certificate: samlConfig.x509_certificate,
              },
        };
      } else {
        const validationError = validateOIDCConfig();
        if (validationError) {
          setError(validationError);
          setIsLoading(false);
          return;
        }

        config = {
          provider_type: 'oidc',
          oidc_config: {
            client_id: oidcConfig.client_id,
            client_secret: oidcConfig.client_secret,
            discovery_url: oidcConfig.discovery_url,
            redirect_uri: oidcConfig.redirect_uri,
          },
        };
      }

      const result = await setupApi.testSSO(setupToken, config);
      setTestSuccess(result.message || 'Connection test successful!');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to test connection. Please check your configuration.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!setupToken) {
      setError('Setup token not found. Please start over from the setup email.');
      return;
    }

    setError(null);
    setTestSuccess(null);
    setIsLoading(true);

    try {
      let config: {
        provider_type: 'saml' | 'oidc';
        saml_config?: {
          metadata_url?: string;
          entity_id?: string;
          sso_url?: string;
          x509_certificate?: string;
        };
        oidc_config?: {
          client_id: string;
          client_secret: string;
          discovery_url: string;
          redirect_uri?: string;
        };
      };

      if (providerType === 'saml') {
        const validationError = validateSAMLConfig();
        if (validationError) {
          setError(validationError);
          setIsLoading(false);
          return;
        }

        config = {
          provider_type: 'saml',
          saml_config: samlConfig.method === 'metadata_url'
            ? { metadata_url: samlConfig.metadata_url }
            : {
                entity_id: samlConfig.entity_id,
                sso_url: samlConfig.sso_url,
                x509_certificate: samlConfig.x509_certificate,
              },
        };
      } else {
        const validationError = validateOIDCConfig();
        if (validationError) {
          setError(validationError);
          setIsLoading(false);
          return;
        }

        config = {
          provider_type: 'oidc',
          oidc_config: {
            client_id: oidcConfig.client_id,
            client_secret: oidcConfig.client_secret,
            discovery_url: oidcConfig.discovery_url,
            redirect_uri: oidcConfig.redirect_uri,
          },
        };
      }

      // Save configuration
      await setupApi.configureSSO(setupToken, config);

      // Complete setup
      await setupApi.completeSetup(setupToken);

      // Clear setup token
      removeSetupToken();

      // Redirect to portal dashboard
      router.push('/portal/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to save configuration. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (!mounted || !setupToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo href="/" size="lg" showTagline={true} className="justify-center" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
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
                <div className="w-16 h-0.5 bg-primary-500"></div>

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

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Configure Single Sign-On
            </h1>
            <p className="text-lg text-gray-600">
              Choose your SSO provider type and enter configuration details
            </p>
          </div>

          {/* Provider Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              SSO Provider Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProviderType('saml')}
                className={`p-4 rounded-lg border-2 transition ${
                  providerType === 'saml'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isLoading}
              >
                <div className="font-semibold text-gray-900 mb-1">SAML 2.0</div>
                <div className="text-sm text-gray-600">
                  Okta, Azure AD, Google Workspace, OneLogin
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProviderType('oidc')}
                className={`p-4 rounded-lg border-2 transition ${
                  providerType === 'oidc'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isLoading}
              >
                <div className="font-semibold text-gray-900 mb-1">OIDC (OpenID Connect)</div>
                <div className="text-sm text-gray-600">
                  Azure AD, Google Workspace, Auth0, Okta
                </div>
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {testSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-800">{testSuccess}</p>
              </div>
            </div>
          )}

          {/* SAML Configuration Form */}
          {providerType === 'saml' && (
            <div className="space-y-6">
              {/* Configuration Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Configuration Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSamlConfig({ ...samlConfig, method: 'metadata_url' })}
                    className={`p-3 rounded-lg border-2 transition text-left ${
                      samlConfig.method === 'metadata_url'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="font-medium text-gray-900 mb-1">Metadata URL (Recommended)</div>
                    <div className="text-xs text-gray-600">Automatic configuration</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSamlConfig({ ...samlConfig, method: 'manual' })}
                    className={`p-3 rounded-lg border-2 transition text-left ${
                      samlConfig.method === 'manual'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    <div className="font-medium text-gray-900 mb-1">Manual Configuration</div>
                    <div className="text-xs text-gray-600">Enter fields manually</div>
                  </button>
                </div>
              </div>

              {/* Metadata URL Method */}
              {samlConfig.method === 'metadata_url' && (
                <div>
                  <label htmlFor="metadata-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Metadata URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="metadata-url"
                    value={samlConfig.metadata_url || ''}
                    onChange={(e) => setSamlConfig({ ...samlConfig, metadata_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://yourcompany.okta.com/app/abc123/sso/saml/metadata"
                    disabled={isLoading}
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Paste the metadata URL from your SSO provider. This URL points to your SAML metadata XML.
                  </p>
                </div>
              )}

              {/* Manual Configuration */}
              {samlConfig.method === 'manual' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="entity-id" className="block text-sm font-medium text-gray-700 mb-2">
                      Entity ID (Audience URI) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="entity-id"
                      value={samlConfig.entity_id || ''}
                      onChange={(e) => setSamlConfig({ ...samlConfig, entity_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://app.audexaai.com/auth/saml/metadata"
                      disabled={isLoading}
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      The Entity ID that identifies your application to the identity provider.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="sso-url" className="block text-sm font-medium text-gray-700 mb-2">
                      SSO URL (Single Sign-On URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="sso-url"
                      value={samlConfig.sso_url || ''}
                      onChange={(e) => setSamlConfig({ ...samlConfig, sso_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://yourcompany.okta.com/app/abc123/sso/saml"
                      disabled={isLoading}
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      The URL where users are redirected for authentication.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="certificate" className="block text-sm font-medium text-gray-700 mb-2">
                      x509 Certificate <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="certificate"
                      value={samlConfig.x509_certificate || ''}
                      onChange={(e) => setSamlConfig({ ...samlConfig, x509_certificate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                      placeholder="-----BEGIN CERTIFICATE-----&#10;MIIE...&#10;-----END CERTIFICATE-----"
                      rows={6}
                      disabled={isLoading}
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Copy the full certificate including the BEGIN and END lines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OIDC Configuration Form */}
          {providerType === 'oidc' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="client-id" className="block text-sm font-medium text-gray-700 mb-2">
                  Client ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="client-id"
                  value={oidcConfig.client_id}
                  onChange={(e) => setOidcConfig({ ...oidcConfig, client_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0oa1abc2def3ghi4jkl5"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label htmlFor="client-secret" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Secret <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="client-secret"
                  value={oidcConfig.client_secret}
                  onChange={(e) => setOidcConfig({ ...oidcConfig, client_secret: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="xyz789_secret_key_abc123"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label htmlFor="discovery-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Discovery URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="discovery-url"
                  value={oidcConfig.discovery_url}
                  onChange={(e) => setOidcConfig({ ...oidcConfig, discovery_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://yourcompany.okta.com/.well-known/openid-configuration"
                  disabled={isLoading}
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  The OpenID Connect discovery document URL (usually ends with /.well-known/openid-configuration).
                </p>
              </div>

              <div>
                <label htmlFor="redirect-uri" className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect URI
                </label>
                <input
                  type="url"
                  id="redirect-uri"
                  value={oidcConfig.redirect_uri}
                  onChange={(e) => setOidcConfig({ ...oidcConfig, redirect_uri: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                  disabled={true}
                />
                <p className="mt-2 text-xs text-gray-500">
                  This is the redirect URI you need to configure in your SSO provider. Copy this value.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSaveConfiguration}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save & Complete Setup'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Need Help?</p>
                  <p>
                    Check the <a href="/docs/sso-setup" target="_blank" rel="noopener noreferrer" className="underline">SSO Setup Guide</a> for detailed instructions for your specific SSO provider (Okta, Azure AD, Google Workspace, etc.).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/onboarding')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            ← Back to Onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
