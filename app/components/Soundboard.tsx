'use client'
import React from 'react';
import CustomImg from './CustomImg';
import { CategoryInterface } from '../models/Category';
import { Head3, CardSpan } from './Ui';
import Link from 'next/link';
import { RectangleGroupIcon } from '@heroicons/react/24/solid';
import { getR2Url } from '../lib/r2/r2Url';

function Soundboard({ obj }: { obj: CategoryInterface }) {
  return (
    <div className='group w-full aspect-3/2 rounded-2xl overflow-hidden relative isolate flex flex-col justify-end bg-gray-50 dark:bg-zinc-900 px-2.5 py-2'>
      <div className="absolute size-6 bg-gray-900/35 dark:bg-zinc-900/35 top-3.5 left-3.5 rounded-md flex justify-center items-center backdrop-blur-[1px]">
        <RectangleGroupIcon className='size-3.5 text-zinc-200/95' />
      </div>
      <CustomImg
        src={getR2Url(`thumb/${obj.thumb}`) ?? ''}
        alt={obj.name}
        width={224}
        height={168}
        wrapperClassName='absolute inset-0 w-full h-full rounded-[inherit] group-hover:scale-120 group-hover:brightness-85 transition duration-200 ease-in-out -z-10'
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40 dark:from-zinc-900 dark:via-zinc-900/40" />
      <div className="absolute inset-0 -z-10 rounded-2xl inset-ring inset-ring-gray-900/10" />
      <div className="flex justify-between gap-1 overflow-hidden">
        <CardSpan>
          <time dateTime='june 25' className="mr-8 whitespace-nowrap">
            {new Date(
              obj.createdAt
            ).toLocaleDateString()}
          </time>
        </CardSpan>
        <CardSpan className="block  truncate">
          <span className="group/anker ">by <span className="text-gray-900 dark:text-white group-hover/anker:text-blue-400">{obj.user.name ?? 'Anonymous'}</span></span>
        </CardSpan>
      </div>
      <Head3 className='line-clamp-2 mt-1 leading-tight'>
        <Link href={`/soundboard/${obj.slug}-${obj.sb_id}`} className='group-hover:underline'>
          <span className="absolute inset-0" />
          {obj.name}
        </Link>
      </Head3>

    </div>
  )
}

export function SoundboardSkelton() {
  return (
    <div className='group w-56 h-42 rounded-2xl overflow-hidden relative isolate flex flex-col justify-end bg-gray-900 dark:bg-zinc-900 px-2.5 py-2'>
      <div className="absolute size-6 bg-gray-900/35 dark:bg-zinc-900/35 top-3.5 left-3.5 rounded-md flex justify-center items-center backdrop-blur-[1px] animate-pulse">
        <RectangleGroupIcon className='size-3.5 text-gray-500 dark:text-zinc-500 animate-pulse' />
      </div>
      <div
        className='absolute inset-0 w-full h-full rounded-[inherit] -z-10 bg-zinc-800 animate-pulse'
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40  dark:from-zinc-900 dark:via-zinc-900/60 " />
      <div className="absolute inset-0 -z-10 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-zinc-900/10" />

      <div className="w-full h-5 bg-zinc-700 rounded-lg animate-pulse">
      </div>
      <div className='mt-1 w-full h-6 bg-zinc-700 rounded-lg animate-pulse'>
      </div>
    </div>
  )
}

export default Soundboard
