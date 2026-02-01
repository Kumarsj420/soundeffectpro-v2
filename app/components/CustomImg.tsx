'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '../services/cn';


type FixedSizeProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fill?: never;
  sizes?: never;
};

type FillProps = {
  src: string;
  alt: string;
  fill: true;
  sizes?: string;
  width?: never;
  height?: never;
};

type ImageWithSkeletonProps = (FixedSizeProps | FillProps) & {
  className?: string;
  skeletonClassName?: string;
  wrapperClassName?: string;
};


export default function CustomImg(props: ImageWithSkeletonProps) {
  const [loading, setLoading] = useState(true);

  const {
    src,
    alt,
    className,
    skeletonClassName,
    wrapperClassName,
  } = props;

  return (
    <div
      className={cn('relative overflow-hidden', wrapperClassName)}
      style={
        'width' in props && 'height' in props
          ? { width: props.width, height: props.height }
          : undefined
      }
    >
      {loading && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gray-200 dark:bg-zinc-800',
            skeletonClassName
          )}
        />
      )}

      {'fill' in props ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={props.sizes ?? '100vw'}
          className={cn(
            'object-cover transition-opacity duration-300',
            loading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoadingComplete={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={props.width}
          height={props.height}
          className={cn(
            'object-cover transition-opacity duration-300',
            loading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoadingComplete={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      )}
    </div>
  );
}
