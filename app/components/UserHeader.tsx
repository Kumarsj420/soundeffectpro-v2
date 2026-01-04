"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import { UserIcon, EnvelopeIcon, IdentificationIcon, CalendarDaysIcon, PlusIcon, ShareIcon } from '@heroicons/react/24/solid';
import { Head1 } from './Ui';
import Button from './Button';
import Loading from '../loading';

function UserHeader() {
    const { data: session, status } = useSession();

    if(status === 'loading'){
        return <Loading />
    }

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .slice(0, 1)
            .map(word => word.charAt(0).toUpperCase())
            .join('');
    };
    return (
        <div className="relative bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-gray-300 dark:border-zinc-800 rounded-2xl p-8 shadow-lg dark:shadow-none shadow-gray-300/80  ">
            <div className="flex gap-6">
                {
                    session?.user.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name ?? 'user'}
                            width={28}
                            height={28}
                            className="size-14 rounded-full ring-[0.12em] ring-offset-6 dark:ring-offset-zinc-900 ring-gray-500/95 group-hover:ring-gray-200/70"
                        ></Image>
                    ) : session?.user.name ? (
                        <div className="size-14 bg-linear-to-b from-blue-50 to-blue-300 ring-[0.12em] ring-offset-6 rounded-full ring-blue-300/75 group-hover:from-white group-hover:to-blue-200 flex items-center justify-center dark:ring-offset-zinc-900 group-hover:ring-blue-200 transition-colors duration-200">
                            <span className="text-blue-500">{getInitials(session.user.name)}</span>
                        </div>
                    ) : (
                        <div className="size-14 bg-linear-to-b from-blue-50 to-blue-300 ring-[0.12em] ring-offset-6 rounded-full ring-blue-300/75 group-hover:from-white group-hover:to-blue-200 flex items-center justify-center dark:ring-offset-zinc-900 group-hover:ring-blue-200 transition-colors duration-200">
                            <UserIcon className="size-5 text-blue-500" />
                        </div>
                    )
                }
                <div className="flex-1 overflow-hidden space-y-1.5">
                    <Head1 className='text-xl sm:text-2xl truncate'>{session?.user.name ?? 'Anonymous'}</Head1>
                    <div className='flex items-center gap-2'>
                        <EnvelopeIcon className='size-4 dark:text-zinc-500' />
                        <span className='dark:text-zinc-400 text-sm '>{session?.user.email}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <IdentificationIcon className='size-4 dark:text-zinc-500' />
                        <span className='dark:text-zinc-400 text-sm '>{session?.user.uid}</span>
                    </div>
                    {
                        session?.user?.emailVerified && (
                            <div className='flex items-center gap-2'>
                                <CalendarDaysIcon className='size-4 dark:text-zinc-500' />
                                <span className='dark:text-zinc-400 text-sm '>{new Date(session?.user.emailVerified).toDateString()}</span>
                            </div>
                        )
                    }

                </div>
                <div className="w-32 space-y-4">
                    <Button size='sm' className='w-full'>
                        <PlusIcon className='size-4 scale-120' />
                        Soundboard
                    </Button>
                    <Button size='sm' className='w-full' variant='outline'>
                        <ShareIcon className='size-4 ' />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UserHeader
