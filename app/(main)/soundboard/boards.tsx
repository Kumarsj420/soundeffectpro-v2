"use client"
import React from "react";
import {
    Head1,
    SoundGrid
} from "../../components/Ui";
import Soundboard, { SoundboardSkelton } from "../../components/Soundboard";
import { categoryService } from "../../services/categoryService";
import { useInfiniteLoader } from '../../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '../../global';
import { CategoryInterface } from "../../models/Category";
import GoogleAd from "@/app/components/ad";
import Breadcrumps from "@/app/components/Breadcrumps";

export default function SoundboardPage() {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["soundboards", "recents"],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            categoryService.getCategory({
                page: pageParam,
                limit: PAGE_SIZE,
                sortBy: 'createdAt',
                order: 'desc',
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
        <div>
            <Breadcrumps title="Soundboard" className="mb-5" />
            <Head1>Recent Soundboards</Head1>
            <SoundGrid className="mt-5">
                {topSoundboards.map((obj: CategoryInterface, index) => (
                    <React.Fragment key={obj.sb_id}>
                        <Soundboard key={obj.sb_id} obj={obj} />

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
                        <SoundboardSkelton key={i} />
                    ))
                }
            </SoundGrid>

            {!hasNextPage && topSoundboards.length > 0 && (
                <p className="text-center mt-4 text-gray-500">No more soundboards to load</p>
            )}
            <div ref={loadMoreRef} className="h-10" />
            <GoogleAd
                slot="7619276466"
                format="autorelaxed"
                variant="multiplex"
            />
        </div>
    );
}