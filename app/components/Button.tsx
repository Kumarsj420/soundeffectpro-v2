import { cn } from '../services/cn';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'auto';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'rounded-xl flex items-center gap-2 font-medium transition duration-200 cursor-pointer active:scale-95';
  
  const variants = {
    primary: 'bg-p-500 hover:bg-p-400 text-white shadow-md shadow-p-300/40',
    secondary: 'bg-gray-600/80 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    outline: 'bg-white hover:bg-sc-50 text-sc-500 shadow-md shadow-gray-200 ring-1 ring-inset ring-sc-300 hover:ring-sc-400/80',
    ghost: 'text-orange-600 hover:bg-orange-50 focus:ring-orange-500 disabled:text-orange-300',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    auto: ''
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;