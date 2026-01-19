'use client'
import { cn } from '../services/cn'
import React from 'react'

export function Head1({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
    return (
        <h1 className={cn('text-3xl font-bold text-gray-900 dark:text-zinc-200 capitalize', className)} {...props}>{children}</h1>
    )
}

export function Head2({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
    return (
        <h2 className={cn('text-xl font-bold text-gray-900 dark:text-zinc-200 capitalize', className)} {...props}>{children}</h2>
    )
}

export function Head3({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
    return (
        <h3 className={cn('text-base font-bold text-gray-900 dark:text-zinc-200 capitalize', className)} {...props}>{children}</h3>
    )
}

export function Para({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
    return (
        <p className={cn('text-gray-600/90 dark:text-zinc-400', className)} {...props}>{children}</p>
    )
}

export function CardSpan({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn('text-xs font-medium text-gray-600/90 dark:text-zinc-300', className)} {...props}>{children}</span>
    )
}


export function SoundGrid({ children, className, ...props }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn('grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6', className)} {...props}>
            {children}
        </div>
    )
}