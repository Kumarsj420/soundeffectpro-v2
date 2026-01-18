'use client';

import React from 'react';
import { cn } from '@/app/services/cn';


type TagBaseProps = {
  children: React.ReactNode;
  size?: 'xs' | 'sm';
  variant?: 'default' | 'active';
  className?: string;
};


type TagButtonProps = TagBaseProps & {
  as?: 'button';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;


type TagSpanProps = TagBaseProps & {
  as: 'span';
} & React.HTMLAttributes<HTMLSpanElement>;


type TagProps = TagButtonProps | TagSpanProps;

const Tag: React.FC<TagProps> = (props) => {
  const {
    children,
    size = 'sm',
    variant = 'default',
    className,
    as = 'button',
    ...rest
  } = props;

  const sizeClasses = {
    xs: 'px-3 py-0.5 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-1 text-xs sm:text-sm',
  };

  const baseClasses =
    'rounded-full whitespace-nowrap relative z-10 transition duration-200 shadow-sm';

  const variantClasses = {
    default:
      'bg-gradient-to-b from-gray-200 to-white text-gray-900 shadow-gray-300 ' +
      'dark:from-zinc-700 dark:to-zinc-800 dark:text-white dark:shadow-none ' +
      'after:absolute after:inset-[0.1em] after:rounded-[inherit] after:-z-10 ' +
      'after:bg-white dark:after:bg-zinc-800 hover:brightness-105 dark:hover:brightness-125',

    active:
      'bg-gradient-to-b from-blue-500 to-blue-600 text-white ' +
      'after:absolute after:inset-[0.1em] after:rounded-[inherit] after:-z-10 ' +
      'after:bg-blue-600 hover:brightness-110',
  };

  const disabledClasses =
    'opacity-60 cursor-not-allowed hover:brightness-100';

  const classes = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    'cursor-pointer',
    as === 'button' && (props as TagButtonProps).disabled && disabledClasses,
    className
  );


  if (as === 'span') {
    const spanProps = rest as React.HTMLAttributes<HTMLSpanElement>;

    return (
      <span className={classes} {...spanProps}>
        {children}
      </span>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type="button"
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Tag;
