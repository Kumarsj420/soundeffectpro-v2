'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '../services/cn';

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    skeletonClassName?: string;
    wrapperClassName?: string
}

export default function CustomImg({
    src,
    alt,
    width,
    height,
    className,
    skeletonClassName,
    wrapperClassName,
}: ImageWithSkeletonProps) {
    const [loading, setLoading] = useState(true);


    return (
        <div
            className={cn("relative overflow-hidden", wrapperClassName)}
            style={{ width, height }}
        >
            {loading && (
                <div
                    className={cn(
                        'absolute inset-0 animate-pulse bg-gray-200 dark:bg-zinc-800',
                        skeletonClassName
                    )}
                />
            )}

            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={cn(
                    'object-cover transition-opacity duration-300',
                    loading ? 'opacity-0' : 'opacity-100',
                    className
                )}
                onLoadingComplete={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                }}
                priority={false}
            />
        </div>
    );
}
