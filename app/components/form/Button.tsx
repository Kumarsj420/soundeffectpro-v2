import { cn } from '@/app/services/cn';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'success' | 'warning' | 'custom';
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
  const baseClasses = 'rounded-xl flex items-center justify-center gap-2 font-medium transition duration-200 cursor-pointer active:scale-95';

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-400 text-white shadow-md shadow-blue-300/40',
    secondary: 'bg-gray-600/80 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    outline: 'bg-white hover:bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 shadow-md shadow-gray-200 dark:shadow-zinc-700/40 ring-1 ring-inset ring-gray-300 hover:ring-gray-400/80 dark:ring-zinc-700 dark:ring-zinc-600',
    error: 'bg-error-500 hover:bg-error-400 text-white shadow-md shadow-error-300/40',
    success: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-300/40',
    warning: 'bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-300/40',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:text-blue-300',
    custom: 'shadow-md'
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