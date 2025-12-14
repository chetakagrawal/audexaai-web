'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Button from '@/components/ui/Button';

interface FormData {
  email: string;
  companyName: string;
  isIndividual: boolean;
}

interface FormErrors {
  email?: string;
  companyName?: string;
}

type FormStep = 1 | 2;

/**
 * Email validation regex - allows common email formats
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * 2-step pilot signup form component
 */
export default function PilotSignupForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    companyName: '',
    isIndividual: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Check if step 1 is valid
   */
  const isStep1Valid = useMemo(() => {
    const emailError = validateEmail(formData.email);
    return !emailError;
  }, [formData.email]);

  /**
   * Handle input changes
   */
  const handleChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);

    // Clear error when user starts typing
    if (typeof value === 'string' && value.trim()) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, []);

  /**
   * Handle input blur for inline validation
   */
  const handleBlur = useCallback((field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'email') {
      const emailError = validateEmail(formData.email);
      setErrors(prev => ({ ...prev, email: emailError }));
    }
  }, [formData.email]);

  /**
   * Handle individual toggle
   */
  const handleIndividualToggle = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      isIndividual: !prev.isIndividual,
      companyName: !prev.isIndividual ? '' : prev.companyName,
    }));
  }, []);

  /**
   * Handle step 1 submit
   */
  const handleStep1Submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      setTouched({ email: true });
      return;
    }

    setStep(2);
  }, [formData.email]);

  /**
   * Handle final submission
   */
  const handleFinalSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate API call
      console.log('Pilot signup submitted:', {
        email: formData.email,
        companyName: formData.isIndividual ? 'Individual' : formData.companyName,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  /**
   * Go back to step 1
   */
  const handleBack = useCallback(() => {
    setStep(1);
    setSubmitError(null);
  }, []);

  /**
   * Reset form
   */
  const handleReset = useCallback(() => {
    setStep(1);
    setFormData({ email: '', companyName: '', isIndividual: false });
    setErrors({});
    setTouched({});
    setIsLoading(false);
    setSubmitError(null);
    setIsSuccess(false);
  }, []);

  // Success state
  if (isSuccess) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-lg mx-auto border border-white/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Welcome to the Pilot!</h3>
          <p className="text-primary-100 mb-6">
            We&apos;ve received your application. Check your inbox at{' '}
            <span className="font-semibold text-white">{formData.email}</span>{' '}
            for next steps.
          </p>
          <button
            onClick={handleReset}
            className="text-primary-200 hover:text-white underline transition-colors"
          >
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-lg mx-auto border border-white/20">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= 1 ? 'bg-white text-primary-600' : 'bg-white/30 text-white/60'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 rounded-full transition-all ${
            step >= 2 ? 'bg-white' : 'bg-white/30'
          }`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= 2 ? 'bg-white text-primary-600' : 'bg-white/30 text-white/60'
          }`}>
            2
          </div>
        </div>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-200 text-sm">{submitError}</p>
        </div>
      )}

      {/* Step 1: Email */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Join the Free Pilot</h3>
            <p className="text-primary-100 text-sm">
              Get early access to AI-powered audit validation
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="you@company.com or personal@email.com"
                className={`w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 
                  focus:outline-none focus:ring-2 transition-all
                  ${touched.email && errors.email 
                    ? 'ring-2 ring-red-400 focus:ring-red-400' 
                    : 'focus:ring-white'
                  }`}
                autoComplete="email"
              />
              {touched.email && errors.email && (
                <p className="mt-2 text-sm text-red-300 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
              <p className="mt-2 text-xs text-primary-200">
                Work or personal email — we welcome individuals and teams
              </p>
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className={`w-full !bg-white !text-primary-600 hover:!bg-gray-100 ${
                !isStep1Valid ? '!bg-gray-300 !text-gray-500 cursor-not-allowed' : ''
              }`}
              disabled={!isStep1Valid}
            >
              Continue
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Company */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Almost there!</h3>
            <p className="text-primary-100 text-sm">
              Tell us a bit about yourself
            </p>
          </div>

          <div className="space-y-4">
            {/* Individual toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <span className="text-white font-medium">I&apos;m an individual</span>
                <p className="text-primary-200 text-xs mt-0.5">Not part of a company</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.isIndividual}
                onClick={handleIndividualToggle}
                className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  formData.isIndividual ? 'bg-emerald-500' : 'bg-white/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formData.isIndividual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Company name input */}
            {!formData.isIndividual && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-white mb-2">
                  Company Name
                  <span className="text-primary-200 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  autoComplete="organization"
                />
              </div>
            )}

            {/* Email confirmation */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 text-primary-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Signing up as:</span>
              </div>
              <p className="text-white font-medium mt-1">{formData.email}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-4 py-3 rounded-lg border border-white/30 text-white font-medium 
                  hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isLoading}
              >
                Back
              </button>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className={`flex-[2] !bg-white !text-primary-600 hover:!bg-gray-100 ${
                  isLoading ? '!bg-gray-300 !text-gray-500 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </>
                ) : (
                  'Join Pilot'
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Privacy note */}
      <p className="text-center text-primary-200 text-xs mt-6">
        No spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}

