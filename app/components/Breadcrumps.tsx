'use client'
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { cn } from '../services/cn';

function Breadcrumps({ cat = null, title, className }: { cat?: { label: string, link: string } | null, title: string, className?: string }) {
    return (
        <nav className={cn("flex items-center gap-1.5 text-sm", className)}>
            <Link href='/' className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                <HomeIcon className='size-4.5' />
            </Link>
            {
                cat && (
                    <>
                        <ChevronRightIcon className="text-gray-600 dark:text-zinc-500 size-3.5" />
                        <Link href={cat.link} className="text-gray-500 dark:text-zinc-300 hover:text-blue-400 transition-colors">
                            {cat.label}
                        </Link>
                    </>
                )
            }

            <ChevronRightIcon className="text-gray-600 dark:text-zinc-500 size-3.5" />
            <span className="text-gray-900 dark:text-white truncate max-w-xs">
                {title}
            </span>
        </nav>
    )
}

export default Breadcrumps
