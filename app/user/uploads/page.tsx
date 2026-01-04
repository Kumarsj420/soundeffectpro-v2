'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import SoundCard, { SoundCardSkelton } from '@/app/components/SoundCard';
import { SoundGrid } from '@/app/components/Ui';
import { fileService } from '@/app/services/fileService';
import { useInfiniteLoader } from '@/app/hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE } from '@/app/global';

function Uploads() {

  const { data: session } = useSession();
  const uid = session?.user.uid;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["user sounds", uid],
    enabled: !!uid,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fileService.getFiles({
        page: pageParam,
        limit: PAGE_SIZE,
        sortBy: 'stats.views',
        order: 'desc',
        userId: uid
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const userSounds =
    data?.pages.flatMap(page => page.data) ?? [];

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });

  return (
    <>
      <SoundGrid>
        {userSounds.map((obj: any) => (
          <SoundCard key={obj._id} obj={obj} sessionUser={uid === obj.user.uid ? true : false} />
        ))}
        {
          (isLoading || isFetchingNextPage) &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SoundCardSkelton key={i} />
          ))
        }
      </SoundGrid>
      {!hasNextPage && userSounds.length > 0 && (
        <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
      )}
      <div ref={loadMoreRef} className="h-10" />
    </>
  )
}

export default Uploads
