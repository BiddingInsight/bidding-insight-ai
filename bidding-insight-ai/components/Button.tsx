
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'plain';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-brand-gold text-white hover:bg-brand-gold-light focus:ring-brand-gold',
    secondary: 'bg-brand-blue text-white hover:bg-brand-blue-light focus:ring-brand-blue',
    ghost: 'bg-transparent text-brand-blue-dark hover:bg-blue-100 focus:ring-brand-blue',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    plain: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
