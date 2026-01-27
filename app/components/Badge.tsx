'use client'
import { cn } from '../services/cn';
import React from 'react';

interface BadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'error' | 'success' | 'warning' | 'info' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg' | 'auto';
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'sm',
}) => {

    const baseClasses = 'ring-1 ring-inset bg-linear-to-b flex flex-row gap-2 justify-center items-center font-semibold rounded-full';

    const variatns = {
        primary: 'ring-p-300/80 from-blue-50 to-blue-200 text-p-600',
        secondary: 'ring-gray-300 from-gray-50 to-gray-200 text-gray-600 dark:ring-zinc-500/20 dark:from-zinc-700/70 dark:to-zinc-900/20',
        error: 'ring-error-300/75 from-error-50 to-error-200 text-error-600 dark:ring-error-500/20 dark:from-error-700/70 dark:to-error-900/20',
        success: 'ring-emerald-300/75 from-emerald-50 to-emerald-200 text-emerald-600 ',
        warning: 'ring-amber-300/75 from-amber-50 to-amber-200 text-amber-600',
        info: 'ring-sky-300/75 from-sky-50 to-sky-200 text-sky-600'
    }

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1.5 text-xs',
        lg: 'px-3 py-2 text-sm',
        xl: 'px-3.5 py-2.5 text-sm',
        auto: ''
    };

    return (
        <div className={cn(baseClasses, variatns[variant], sizes[size], className)} >
            {children}
        </div>
    )
}

export default Badge;