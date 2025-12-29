"use client"
import React from 'react'
import SoundCard from '../components/SoundCard';
import { fileService } from '../services/fileService';
import SoundCardSkelton from '../components/SoundCardSkelton';
import { useInfiniteLoader } from '../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Head1, SoundGrid } from '../components/Ui';
import { PAGE_SIZE } from '../global';

export default function Popular() {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["sounds", "popular"],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            fileService.getFiles({
                page: pageParam,
                limit: PAGE_SIZE,
                sortBy: 'stats.downloads',
                order: 'desc',
            }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    const popularSounds =
        data?.pages.flatMap(page => page.data) ?? [];

    const loadMoreRef = useInfiniteLoader({
        loading: isFetchingNextPage,
        hasMore: !!hasNextPage,
        onLoadMore: fetchNextPage,
    });

    return (
        <>
            <Head1>Popular Sound Effects</Head1>

            <SoundGrid className='mt-5'>
                {popularSounds.map((obj: any) => (
                    <SoundCard key={obj._id} obj={obj} />
                ))}
                {
                    (isLoading || isFetchingNextPage) &&
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <SoundCardSkelton key={i} />
                    ))
                }
            </SoundGrid>

            {!hasNextPage && popularSounds.length > 0 && (
                <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
            )}
            <div ref={loadMoreRef} className="h-10" />
        </>

    )
}
