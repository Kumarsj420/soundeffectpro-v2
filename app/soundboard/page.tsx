"use client"
import {
    Head1,
    SoundGrid
} from "../components/Ui";
import Soundboard, { SoundboardSkelton } from "../components/Soundboard";
import { categoryService } from "../services/categoryService";
import { useInfiniteLoader } from '../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '../global';

export default function SoundboardPage() {

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
            categoryService.getCategory({
                page: pageParam,
                limit: PAGE_SIZE,
                sortBy: 'stats.downloads',
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
            <Head1>Popular Soundboards</Head1>
            <SoundGrid className="mt-5">
                {topSoundboards.map((obj: any) => (
                    <Soundboard key={obj._id} obj={obj} />
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
        </div>
    );
}