'use client'
import React from 'react';
import SoundCard, { SoundCardSkelton } from '@/app/components/SoundCard';
import { SoundGrid } from '@/app/components/Ui';
import { fileService } from '@/app/services/fileService';
import { useInfiniteLoader } from '@/app/hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '@/app/global';

export default function Likes() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["liked sounds"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fileService.getLikedFiles(),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });


  const likedSounds =
    data?.pages.flatMap(page => page.data) ?? [];


  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });

  return (
    <>
      <SoundGrid>
        {likedSounds.map((obj: any) => (
          <SoundCard key={obj._id} obj={obj} sessionUser={true} />
        ))}
        {
          (isLoading || isFetchingNextPage) &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SoundCardSkelton key={i} />
          ))
        }
      </SoundGrid>
      {!hasNextPage && likedSounds.length > 0 && (
        <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
      )}
      <div ref={loadMoreRef} className="h-10" />
    </>
  )
}
