'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/app/services/cn';

type PTagBaseProps = {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'indigoSky' | 'redAmber' | 'greenTeal' | 'purplePink' | 'violetFuchsia' | 'orangeYellow' |  'custom';
  className?: string;
};

type PTagButtonProps = PTagBaseProps & {
  as?: 'button';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type PTagSpanProps = PTagBaseProps & {
  as: 'span';
} & React.HTMLAttributes<HTMLSpanElement>;

type PTagLinkProps = PTagBaseProps & {
  as: 'link';
  href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type PTagProps = PTagButtonProps | PTagSpanProps | PTagLinkProps;

const PTag: React.FC<PTagProps> = (props) => {
  const {
    children,
    size = 'sm',
    variant = 'indigoSky',
    className,
    as = 'button',
    ...rest
  } = props;

   const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-2.5 py-0.5 md:px-3 md:py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const baseClasses =
    'rounded-xl whitespace-nowrap relative z-10 transition duration-200 font-medium inline-flex items-center justify-center';

  const variantClasses = {
    indigoSky:
      'bg-linear-to-b text-white from-indigo-500/90 via-blue-500/90 dark:from-indigo-500 dark:via-blue-500 to-sky-400  shadow-md shadow-sky-200/40  ring-1 ring-inset ring-sky-300 hover:ring-indigo-200 after:absolute after:inset-y-[0.2em] after:inset-x-[0.34em] after:-z-10 after:bg-linear-to-b after:from-sky-300/50 after:via-sky-100/10 after:to-sky-100/5 after:rounded-[inherit] after:h-1/2 hover:brightness-110 hover:shadow-sky-300/60',

    redAmber:
      'bg-linear-to-b text-white from-red-500/90 via-orange-500/90 dark:from-red-500 dark:via-orange-500 to-amber-400  shadow-md shadow-amber-200/40  ring-1 ring-inset ring-amber-300 hover:ring-red-200 after:absolute after:inset-y-[0.2em] after:inset-x-[0.34em] after:-z-10 after:bg-linear-to-b after:from-amber-300/50 after:via-amber-100/10 after:to-amber-100/5 after:rounded-[inherit] after:h-1/2 hover:brightness-110 hover:shadow-amber-300/60',

    greenTeal:
      'bg-linear-to-b text-white from-green-600/90 via-emerald-500/90 dark:from-green-600 dark:via-emerald-500 to-teal-400  shadow-md shadow-teal-200/40  ring-1 ring-inset ring-teal-300 hover:ring-green-200 after:absolute after:inset-y-[0.2em] after:inset-x-[0.34em] after:-z-10 after:bg-linear-to-b after:from-teal-300/50 after:via-teal-100/10 after:to-teal-100/5 after:rounded-[inherit] after:h-1/2 hover:brightness-110 hover:shadow-teal-300/60',

    purplePink:
      'bg-linear-to-b text-white from-purple-500/90 via-fuchsia-500/90 dark:from-purple-500 dark:via-fuchsia-500 to-pink-400  shadow-md shadow-pink-200/40  ring-1 ring-inset ring-pink-300 hover:ring-purple-200 after:absolute after:inset-y-[0.2em] after:inset-x-[0.34em] after:-z-10 after:bg-linear-to-b after:from-pink-300/50 after:via-pink-100/10 after:to-pink-100/5 after:rounded-[inherit] after:h-1/2 hover:brightness-110 hover:shadow-pink-300/60',

    violetFuchsia:
      'bg-linear-to-b text-white from-violet-500/90 via-purple-500/90 dark:from-violet-500 dark:via-purple-500 to-fuchsia-400  shadow-md shadow-fuchsia-200/40  ring-1 ring-inset ring-fuchsia-300 hover:ring-violet-200 after:absolute after:inset-y-[0.2em] after:inset-x-[0.34em] after:-z-10 after:bg-linear-to-b after:from-fuchsia-300/50 after:via-fuchsia-100/10 after:to-fuchsia-100/5 after:rounded-[inherit] after:h-1/2 hover:brightness-110 hover:shadow-fuchsia-300/60',

    orangeYellow:
      'bg-linear-to-b text-white from-orange-500/90 via-amber-500/90 dark:from-orange-500 dark:via-amber-500 to-yellow-400  shadow-md shadow-yellow-200/40  ring-1 ring-inset ring-yellow-300 hover:ring-orange-200 after:absolute after:inset-y-[0.2em] after:inset-x-[0.34em] after:-z-10 after:bg-linear-to-b after:from-yellow-300/50 after:via-yellow-100/10 after:to-yellow-100/5 after:rounded-[inherit] after:h-1/2 hover:brightness-110 hover:shadow-yellow-300/60',


    custom: 'shadow-md',
  };

  const disabledClasses =
    'opacity-50 cursor-not-allowed hover:brightness-100';

  const classes = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    'cursor-pointer',
    as === 'button' && (props as PTagButtonProps).disabled && disabledClasses,
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

  if (as === 'link') {
    const { href, ...linkProps } = rest as PTagLinkProps;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
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

export default PTag;