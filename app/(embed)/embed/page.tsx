import React from 'react';
import SoundButton from '@/app/components/SoundButton';
import Card from '@/app/components/Card';
import { Head1 } from '@/app/components/Ui';

function page() {
    return (
        <>
            <div className='dark'>
                <Card className='max-w-sm pt-0 px-0 overflow-hidden'>
                    <header className='w-full py-4 border-b border-b-gray-300/80 dark:border-b-zinc-700 px-5 bg-linear-to-b from-white via-gray-50 to-gray-200 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-900'>
                        <a href="https://www.soundeffectpro.com/" className='group text-gray-800 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-300'>
                            <span className='text-gray-500/60 dark:text-zinc-400/80 group-hover:text-blue-400'>𒆜</span>soundeffectpro.com<span className='text-gray-500/60 dark:text-zinc-400/80 group-hover:text-blue-400'>★★</span>
                        </a>
                    </header>
                    <div className="px-5 py-5 ">
                        <div className='flex justify-center items-center mt-2'>
                            <SoundButton />
                        </div>
                        <div className='mt-7 overflow-hidden'>
                            <a href='##' className='line-clamp-2 text-gray-900 dark:text-white font-semibold hover:text-blue-400'>Vine Boom Sound Effect Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, laboriosam.</a>
                            <a href="##" className='text-xs hover:underline text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'><span className='text-blue-500 dark:text-blue-400 font-semibold'>@ </span>Rehman Dakait</a>
                            <div className="mt-3 flex items-center flex-wrap gap-2.5">
                                <a href="##" className='text-sm text-gray-700 hover:text-blue-500 dark:text-zinc-200 dark:hover:text-blue-400'>#meme</a>
                                <a href="##" className='text-sm text-gray-700 hover:text-blue-500 dark:text-zinc-200 dark:hover:text-blue-400'>#funny</a>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default page
