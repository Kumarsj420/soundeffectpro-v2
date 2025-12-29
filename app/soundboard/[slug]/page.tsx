"use client"
import React, { useState } from 'react';
import { Share2, Music } from 'lucide-react';
import SoundCard from '@/app/components/SoundCard';
import SoundCardSkelton from '@/app/components/SoundCardSkelton';
import { notFound } from 'next/navigation';
import { Head1, Head2, SoundGrid } from '@/app/components/Ui';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useInfiniteLoader } from '@/app/hooks/useInfiniteLoader';
import { categoryService } from '@/app/services/categoryService';
import Loading from '@/app/loading';
import Image from 'next/image';
import { PAGE_SIZE } from '@/app/global';
import { fileService } from '@/app/services/fileService';


export default function SoundboardPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = React.use(params);
    const id = slug.split('-').pop();

    if (!id) return notFound();

    const {
        data: boardRes,
        isLoading: isBoardLoading,
        isError: isBoardError
    } = useQuery({
        queryKey: ["soundboard", id],
        queryFn: () => categoryService.getCategoryByID(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    })

    const boardData = boardRes?.data ?? null;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["soundboard_sounds", id],
        initialPageParam: 1,
        enabled: !!id && !!boardData,
        queryFn: ({ pageParam }) =>
            fileService.getFilesBySbID({
                id,
                page: pageParam,
                limit: PAGE_SIZE,
            }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });


    const sbSounds = data?.pages.flatMap(page => page.data) ?? [];

    const loadMoreRef = useInfiniteLoader({
        loading: isFetchingNextPage,
        hasMore: !!hasNextPage,
        onLoadMore: fetchNextPage,
    });

    if (isBoardLoading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="min-h-screen text-gray-900 dark:text-zinc-100">
            <div>
                {/* Soundboard Header */}
                <section className="flex flex-col md:flex-row gap-6 items-start ">
                    {/* Thumbnail */}
                    <div className="aspect-square w-48 h-36 bg-white dark:bg-zinc-900 rounded-xl shadow-lg shadow-gray-300 dark:shadow-zinc-900 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {boardData.thumb ? (
                            <Image
                                src={`/thumb/${boardData.thumb}`}
                                alt={boardData.name}
                                width={160}
                                height={160}
                                className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                            />
                        ) : (
                            <Music className="w-16 h-16 text-gray-400 dark:text-zinc-600" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 overflow-hidden">
                        <Head1 >
                            {boardData.name} | Sound Effect Pro Soundboard
                        </Head1>
                        <p className="text-gray-500 dark:text-zinc-400 mb-4">
                            {boardData.total_sfx} Sounds · {boardData.stats.views} Views
                        </p>
                        <button
                            className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-3 py-2 mt-2 flex items-center gap-2 transition"
                        >
                            <Share2 className="w-4 h-4" />
                            Share Board
                        </button>
                    </div>
                </section>

                <div className="border-t border-gray-300 dark:border-zinc-800 my-6"></div>

                {/* Sounds Section */}
                <section>
                    <Head2>Sounds in this Board</Head2>
                    <SoundGrid className='mt-5'>
                        {
                            sbSounds.map((obj: any) => (
                                <SoundCard key={obj._id} obj={obj} />
                            ))
                        }
                        {
                            (isLoading || isFetchingNextPage) &&
                            Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <SoundCardSkelton key={i} />
                            ))
                        }
                    </SoundGrid>
                    {!hasNextPage && sbSounds.length > 0 && (
                        <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
                    )}
                    <div ref={loadMoreRef} className="h-10" />

                </section>
            </div>
        </div>
    );
}