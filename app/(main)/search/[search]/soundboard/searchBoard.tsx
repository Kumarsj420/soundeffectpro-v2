'use client'
import React from "react";
import {
    SoundGrid
} from "@/app/components/Ui";
import Soundboard, { SoundboardSkelton } from "@/app/components/Soundboard";
import { categoryService } from "@/app/services/categoryService";
import { useInfiniteLoader } from '@/app/hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '@/app/global';
import { CategoryInterface } from "@/app/models/Category";
import GoogleAd from "@/app/components/ad";

function SearchBoard(
    {
        search,
    }: {
        search: string
    }
) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["soundboards", "search", search],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            categoryService.getCategory({
                page: pageParam,
                limit: PAGE_SIZE,
                search,
                thumb: true
            }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    const topSoundboards = data?.pages.flatMap(page => page.data) ?? [];

    const loadMoreRef = useInfiniteLoader({
        loading: isFetchingNextPage,
        hasMore: !!hasNextPage,
        onLoadMore: fetchNextPage,
    });

    return (
        <>
            <SoundGrid className="mt-5">
                {topSoundboards.map((obj: CategoryInterface, index) => (
                    <React.Fragment key={obj.sb_id}>
                        <Soundboard key={obj.sb_id} obj={obj} />

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
                        <SoundboardSkelton key={i} />
                    ))
                }
            </SoundGrid>

            {!hasNextPage && topSoundboards.length > 0 && (
                <p className="text-center mt-4 text-gray-500">No more soundboards to load</p>
            )}
            <div ref={loadMoreRef} className="h-10" />
        </>
    )
}

export default SearchBoard
