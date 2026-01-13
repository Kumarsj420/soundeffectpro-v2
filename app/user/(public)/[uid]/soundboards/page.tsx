'use client';
import React from "react";
import { SoundGrid } from "@/app/components/Ui";
import Soundboard, { SoundboardSkelton } from "@/app/components/Soundboard";
import { categoryService } from "@/app/services/categoryService";
import { useInfiniteLoader } from '@/app/hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '@/app/global';
import { Para } from "@/app/components/Ui";

export default function SoundboardPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const {uid} = React.use(params);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["user-soundboards", uid],
    initialPageParam: 1,
    enabled: !!uid,
    queryFn: ({ pageParam }) =>
      categoryService.getCategory({
        page: pageParam,
        limit: PAGE_SIZE,
        thumb: true,
        userID: uid,
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const soundboards = data?.pages.flatMap(p => p.data) ?? [];
  const totalSoundboards = data?.pages?.[0]?.pagination?.total ?? 0;

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });


  if (isLoading) {
    return (
      <SoundGrid className="mt-5">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SoundboardSkelton key={i} />
        ))}
      </SoundGrid>
    );
  }

  if (totalSoundboards === 0) {
    return (
      <div className="mt-10 ">
        <Para className="mt-1">
          This User has not created any soundboard.
        </Para>
      </div>
    );
  }


  return (
    <div>
      <SoundGrid className="mt-5">
        {soundboards.map((obj: any) => (
          <Soundboard key={obj._id} obj={obj} />
        ))}

        {isFetchingNextPage &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SoundboardSkelton key={i} />
          ))}
      </SoundGrid>

      {!hasNextPage && soundboards.length > 0 && (
        <Para className="mt-4 text-center">
          No more soundboards to load
        </Para>
      )}

      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}
