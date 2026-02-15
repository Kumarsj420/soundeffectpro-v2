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
import GoogleAd from '@/app/components/ad';
import { useSession } from 'next-auth/react';

export default function CategoryRes({
    name,
}: {
    name: string
}) {

    const { data: session } = useSession();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["sounds", "search", name],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            fileService.getFiles({
                page: pageParam,
                limit: PAGE_SIZE,
                category: name,
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

    if (!name) return notFound();

    const catSounds =
        data?.pages.flatMap(page => page.data) ?? [];


    return (
        <>
            <Head1>{name} Sound Effect Buttons</Head1>

            <SoundGrid className='mt-5'>
                {catSounds.map((obj: IFileWithFav, index) => (
                    <React.Fragment key={obj.s_id}>
                        <SoundCard key={obj.s_id} obj={obj} sessionUser={session?.user.uid === obj.user.uid} />

                        {(index + 1) % 10 === 0 && (
                            <GoogleAd slot="8414307791" format="fluid" variant="post-infeed" />
                        )}

                        {(index + 1) % 50 === 0 && (
                            <GoogleAd
                                slot="7619276466"
                                format="autorelaxed"
                                variant="multiplex"
                            />

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

            {!hasNextPage && catSounds.length > 0 && (
                <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
            )}
            <div ref={loadMoreRef} className="h-10" />
            <GoogleAd
                slot="7619276466"
                format="autorelaxed"
                variant="multiplex"
            />
        </>
    )
}
