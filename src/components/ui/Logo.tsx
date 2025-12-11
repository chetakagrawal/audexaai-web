import React from 'react';
import Link from 'next/link';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
}

export default function Logo({ showTagline = false, size = 'md', href, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-12 h-12', text: 'text-xl' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl' },
  };

  const LogoContent = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div className={`${sizes[size].icon} flex-shrink-0 relative`}>
        <img
          src="/images/logo.jpeg"
          alt="Audexa AI Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className={`font-bold ${sizes[size].text}`}>
          <span className="text-slate-800">Audexa</span>{' '}
          <span className="text-primary-500">AI</span>
        </span>
        {showTagline && (
          <div className="text-xs text-gray-600 leading-tight mt-1">
            <div>THE FUTURE OF AUDIT</div>
            <div>IS AUTONOMOUS</div>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
