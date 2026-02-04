'use client'
import React from 'react';
import SoundButton from '@/app/components/SoundButton';
import Card from '@/app/components/Card';
import { Head1 } from '@/app/components/Ui';
import { TbExternalLink } from "react-icons/tb";
import { IFileWithFav } from '@/app/services/fileService';
import { useQuery } from '@tanstack/react-query';
import { useLazyAudio } from '@/app/hooks/useAudio';
import { getR2Url } from '@/app/lib/r2/r2Url';
import { fileService } from '@/app/services/fileService';


function EmbedPage({ id, theme, type }: { id: string, theme: 'light' | 'dark', type: 'button' | 'card' }) {
    const audioUrl = id ? getR2Url(`store/${id}.mp3`) : null;

    const { play, pause, loading, playing } = useLazyAudio(audioUrl ?? "");

    const {
        data: soundRes,
        isLoading: isSoundLoading,
    } = useQuery({
        queryKey: ["embed", id],
        queryFn: () => fileService.getFilesById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });

    const sfxInfo = soundRes?.data ?? null;


    return (
        <>
            {
                type === 'card' ? (
                    <div className={`${theme === 'dark' ? 'dark' : 'light'} p-1`}>
                        <Card className=' py-0 px-0 overflow-hidden'>
                            <header className='w-full py-4 border-b border-b-gray-300/80 dark:border-b-zinc-700 px-5 bg-linear-to-b from-white via-gray-50 to-gray-200 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-900'>
                                <a href="https://www.soundeffectpro.com/" className='group text-gray-800 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-300'>
                                    <span className='text-gray-500/60 dark:text-zinc-400/80 group-hover:text-blue-400'>𒆜</span>soundeffectpro.com<span className='text-gray-500/60 dark:text-zinc-400/80 group-hover:text-blue-400'>★★</span>
                                </a>
                            </header>
                            <div className="py-5 h-66 overflow-y-auto">
                                <div className="px-5">
                                    {
                                        isSoundLoading ? (
                                            <>
                                                <div className="flex justify-center items-center mt-2">
                                                    <div className="size-21 bg-gray-400 dark:bg-zinc-600 animate-pulse rounded-full">
                                                    </div>
                                                </div>
                                                <div className='mt-7 space-y-1'>
                                                    <div className="w-full h-6 bg-gray-400 dark:bg-zinc-600 animate-pulse rounded-md"></div>
                                                    <div className="w-full h-4 bg-gray-400 dark:bg-zinc-600 animate-pulse rounded-md"></div>
                                                    <div className="w-full h-5 bg-gray-400 dark:bg-zinc-600 animate-pulse mt-3 rounded-md"></div>
                                                </div>

                                            </>
                                        ) : (
                                            <>
                                                <div className='flex justify-center items-center mt-2'>
                                                    <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${sfxInfo?.btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
                                                </div>
                                                <div className='mt-7 overflow-hidden space-y-1'>
                                                    <a href={`https://www.soundeffectpro.com//${sfxInfo?.slug}-${sfxInfo?.s_id}`} target='_blank' className='line-clamp-2 text-gray-900 dark:text-white font-semibold hover:text-blue-400 capitalize'>{sfxInfo?.title} </a>
                                                    <a href={`https://www.soundeffectpro.com/user/${sfxInfo?.user.uid}?name=${sfxInfo?.user.name}`} target='_blank' className='text-xs hover:underline text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 line-clamp-1'><span className='text-blue-500 dark:text-blue-400 font-semibold'>@ </span>{sfxInfo?.user.name}</a>
                                                    <div className="mt-3 flex items-center flex-wrap gap-2.5">
                                                        {
                                                            sfxInfo?.tags.map((tag: string, index: number) => (
                                                                <a key={index} href={`https://www.soundeffectpro.com/tag/${tag}`} className='text-sm text-gray-700 hover:text-blue-500 dark:text-zinc-200 dark:hover:text-blue-400' target='_blank'>#{tag}</a>
                                                            ))
                                                        }

                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }

                                </div>

                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-2.5 w-max'>
                        <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${sfxInfo?.btnColor} ${(loading || isSoundLoading) ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
                        <a href={`https://www.soundeffectpro.com//${sfxInfo?.slug}-${sfxInfo?.s_id}`} className='text-[8px] w-full px-2 py-0.5 bg-gray-200/75 text-gray-700 hover:text-gray-900 rounded-full flex items-center gap-1 opacity-60 hover:opacity-75 shadow-sm' target='_blank'>
                            soundeffectpro.com
                            <TbExternalLink className='size-2.5' />
                        </a>
                    </div>
                )
            }


        </>
    )
}

export default EmbedPage;
