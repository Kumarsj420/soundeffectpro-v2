'use client';

import React from 'react';
import { cn } from '@/app/services/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padded?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padded = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative z-10 rounded-xl shadow-lg shadow-gray-300/70 dark:shadow-none',
        'bg-white ring-[0.1em] ring-gray-200 dark:ring-0',
        'dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900',
        'dark:after:absolute dark:after:inset-0.5 dark:after:-z-10',
        'dark:after:bg-zinc-900 dark:after:rounded-[inherit]',
        padded && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
