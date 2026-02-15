"use client"
import React from "react";
import {
    Head1,
    SoundGrid
} from "../../../components/Ui";
import Soundboard, { SoundboardSkelton } from "../../../components/Soundboard";
import { categoryService } from "../../../services/categoryService";
import { useInfiniteLoader } from '../../../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '../../../global';
import { CategoryInterface } from "../../../models/Category";
import GoogleAd from "@/app/components/ad";
import Breadcrumps from "@/app/components/Breadcrumps";

function getSortBy(period: 'week' | 'month' | 'halfyear', field: 'views'): string {
    const periodMap: Record<'week' | 'month' | 'halfyear', string> = {
        week: 'weekly',
        month: 'monthly',
        halfyear: 'halfYearly'
    };

    return `stats.${periodMap[period]}.${field}`;
}

function getPageTitle(period: 'week' | 'month' | 'halfyear', field: 'views'): string {
    const titleMap: Record<'week' | 'month' | 'halfyear', Record<'views', string>> = {
        week: {
            views: 'Trending Soundboards This Week'
        },
        month: {
            views: 'Popular Soundboards This Month'
        },
        halfyear: {
            views: 'Viral Soundboards In Last 6 Months'
        }
    };

    return titleMap[period][field];
}

function FilterBoard({ period, field }: { period: 'week' | 'month' | 'halfyear', field: 'views' }) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["soundboards", period, field],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            categoryService.getCategory({
                page: pageParam,
                limit: PAGE_SIZE,
                sortBy: getSortBy(period, field),
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
            <Breadcrumps cat={{ label: 'Soundboard', link: '/soundboard' }} title={getPageTitle(period, field)} className="mb-5" />
            <Head1>{getPageTitle(period, field)}</Head1>
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

export default FilterBoard
