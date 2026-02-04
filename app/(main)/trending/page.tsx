"use client"
import React from 'react'
import SoundCard, { SoundCardSkelton } from '../../components/SoundCard';
import { fileService } from '../../services/fileService';
import { useInfiniteLoader } from '../../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Head1, SoundGrid } from '../../components/Ui';
import { PAGE_SIZE } from '../../global';
import { IFileWithFav } from '../../services/fileService';
import GoogleAd from '@/app/components/ad';
import { useSession } from 'next-auth/react';


export default function Trending() {

    const { data: session } = useSession();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["sounds", "trending"],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            fileService.getFiles({
                page: pageParam,
                limit: PAGE_SIZE,
                sortBy: 'stats.likes',
                order: 'desc',
            }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    const trendingSounds =
        data?.pages.flatMap(page => page.data) ?? [];

    const loadMoreRef = useInfiniteLoader({
        loading: isFetchingNextPage,
        hasMore: !!hasNextPage,
        onLoadMore: fetchNextPage,
    });

    return (
        <>
            <Head1>Trending Sound Effects</Head1>

            <SoundGrid className='mt-5'>
                {trendingSounds.map((obj: IFileWithFav, index) => (
                    <React.Fragment key={obj.s_id}>
                        <SoundCard key={obj.s_id} obj={obj} sessionUser={session?.user.uid === obj.user.uid} />

                        {(index + 1) % 20 === 0 && (
                            <div className="col-span-full">
                                <GoogleAd slot="4718938506" />
                            </div>
                        )}

                    </React.Fragment>

                ))}
                {
                    (isLoading || isFetchingNextPage) &&
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <SoundCardSkelton key={i} />
                    ))
                }
            </SoundGrid>

            {!hasNextPage && trendingSounds.length > 0 && (
                <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
            )}
            <div ref={loadMoreRef} className="h-10" />
        </>

    )
}
