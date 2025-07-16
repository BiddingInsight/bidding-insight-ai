
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue-light focus:ring-brand-blue',
    secondary: 'bg-brand-gold text-white hover:bg-brand-gold-light focus:ring-brand-gold',
    ghost: 'bg-transparent text-brand-blue-dark hover:bg-blue-100 focus:ring-brand-blue'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
