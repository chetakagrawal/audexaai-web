import React from 'react';
import Badge from '@/components/ui/Badge';

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="success" className="mb-4 bg-primary-500/20 text-primary-300">
            Enterprise-Grade Security
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Built With Security First
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            SOC2-aligned architecture designed for the most stringent compliance requirements
          </p>
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
            <span className="font-semibold">SOC2 Type II</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
            <span className="font-semibold">ISO 27001</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
            <span className="font-semibold">GDPR Compliant</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
            <span className="font-semibold">AICPA Aligned</span>
          </div>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-primary-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
            <p className="text-gray-300 text-sm">
              AES-256 encryption at rest, TLS 1.3 in transit. Your data is always protected.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-primary-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Tenant Isolation</h3>
            <p className="text-gray-300 text-sm">
              Complete data isolation per tenant with S3 object-layer security.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-primary-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Role-Based Access Control</h3>
            <p className="text-gray-300 text-sm">
              Granular RBAC with tenant-scoped permissions and audit logging.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-primary-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Private Cloud Options</h3>
            <p className="text-gray-300 text-sm">
              Deploy in your VPC or on-premises for maximum control and compliance.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-primary-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Customer-Managed Keys</h3>
            <p className="text-gray-300 text-sm">
              Bring your own encryption keys (BYOK) for ultimate data sovereignty.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-primary-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Complete Audit Trails</h3>
            <p className="text-gray-300 text-sm">
              Every action logged and traceable for compliance and forensics.
            </p>
          </div>
        </div>

        {/* Additional Security Features */}
        <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl p-8 border border-primary-500/30">
          <h3 className="text-2xl font-bold mb-6 text-center">Additional Security Measures</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-semibold mb-1">Zero Direct Public Access</div>
                <p className="text-sm text-gray-300">All internal services protected behind API gateways and WAF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-semibold mb-1">Private LLM Endpoints</div>
                <p className="text-sm text-gray-300">AWS Bedrock private endpoints—no public data egress</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-semibold mb-1">Data Residency Options</div>
                <p className="text-sm text-gray-300">Choose your data storage region for compliance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-semibold mb-1">Regular Penetration Testing</div>
                <p className="text-sm text-gray-300">Third-party security audits and continuous monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

