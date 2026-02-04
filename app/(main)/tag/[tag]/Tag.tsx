"use client"
import React from 'react'
import SoundCard, { SoundCardSkelton } from '../../../components/SoundCard';
import { fileService } from '../../../services/fileService';
import { useInfiniteLoader } from '../../../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Head1, SoundGrid } from '../../../components/Ui';
import { PAGE_SIZE } from '../../../global';
import { notFound } from 'next/navigation';
import { IFileWithFav } from '../../../services/fileService';

export default function TagRes({
    tag,
}: {
    tag: string
}) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["sounds", "search", tag],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            fileService.getFiles({
                page: pageParam,
                limit: PAGE_SIZE,
                category: tag,
            }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    const loadMoreRef = useInfiniteLoader({
        loading: isFetchingNextPage,
        hasMore: !!hasNextPage,
        onLoadMore: fetchNextPage,
    });

    if (!tag) return notFound();

    const catSounds =
        data?.pages.flatMap(page => page.data) ?? [];


    return (
        <>
            <Head1>{tag} Tag Sound Buttons</Head1>

            <SoundGrid className='mt-5'>
                {catSounds.map((obj: IFileWithFav) => (
                    <SoundCard key={obj.s_id} obj={obj} />
                ))}
                {
                    (isLoading || isFetchingNextPage) &&
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <SoundCardSkelton key={i} />
                    ))
                }
            </SoundGrid>

            {!hasNextPage && catSounds.length > 0 && (
                <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
            )}
            <div ref={loadMoreRef} className="h-10" />
        </>
    )
}
