import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

