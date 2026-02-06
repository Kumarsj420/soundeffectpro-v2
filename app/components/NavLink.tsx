'use client'
import { cn } from '@/app/services/cn';
import Link from 'next/link';
import React from 'react';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'active' | 'danger' | 'success' | 'custom';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    iconClassName?: string;
    onClick?: () => void;
    external?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
    href,
    children,
    icon: Icon,
    variant = 'default',
    size = 'md',
    className,
    iconClassName,
    onClick,
    external = false,
}) => {
    const baseClasses = 'group flex items-center font-medium transition duration-200 rounded-lg w-full';

    const variants = {
        default: 'text-gray-600/90 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700/70 dark:hover:text-white data-[focus]:bg-white/5 data-[focus]:text-white',
        active: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20',
        danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
        success: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
        custom: ''
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-2',
        md: 'px-4 py-2 text-sm gap-3',
        lg: 'px-5 py-3 text-base gap-4'
    };

    const iconSizes = {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6'
    };

    const defaultIconClasses = 'dark:text-zinc-400/75 dark:group-hover:text-zinc-300 transition-colors';

    const linkContent = (
        <>
            {Icon && (
                <Icon
                    className={cn(
                        iconSizes[size],
                        defaultIconClasses,
                        iconClassName
                    )}
                />
            )}
            {children}
        </>
    );

    const combinedClasses = cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    );

    if (external) {
        return (
            <a
                href={href}
                className={combinedClasses}
                onClick={onClick}
                target="_blank"
                rel="noopener noreferrer"
            >
                {linkContent}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={combinedClasses}
            onClick={onClick}
        >
            {linkContent}
        </Link>
    );
};

export default NavLink;