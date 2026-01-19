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
        primary: 'ring-p-300/80 from-p-50 to-p-200 text-p-600',
        secondary: 'ring-sc-300 from-sc-50 to-sc-200 text-sc-600',
        error: 'ring-error-300/75 from-error-50 to-error-200 text-error-600 dark:ring-error-500/30 dark:from-error-600/80 dark:to-error-900/10',
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