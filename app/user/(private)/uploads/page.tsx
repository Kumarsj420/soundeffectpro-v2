'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import SoundCard, { SoundCardSkelton } from '@/app/components/SoundCard';
import { SoundGrid, Para } from '@/app/components/Ui';
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
    queryKey: ['user-sounds', uid],
    enabled: !!uid,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fileService.getFiles({
        page: pageParam,
        limit: PAGE_SIZE,
        sortBy: 'stats.views',
        order: 'desc',
        userId: uid,
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const userSounds = data?.pages.flatMap(p => p.data) ?? [];
  const totalFiles = data?.pages?.[0]?.pagination?.total ?? 0;

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });

  if (isLoading) {
    return (
      <SoundGrid>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SoundCardSkelton key={i} />
        ))}
      </SoundGrid>
    );
  }

  if (totalFiles === 0) {
    return <Para>You do not have uploaded any sound yet.</Para>;
  }

  return (
    <>
      <SoundGrid>
        {userSounds.map(obj => (
          <SoundCard
            key={obj.s_id}
            obj={obj}
            sessionUser={uid === obj.user.uid}
          />
        ))}

        {isFetchingNextPage &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SoundCardSkelton key={i} />
          ))}
      </SoundGrid>

      {!hasNextPage && userSounds.length > 0 && (
        <Para>
          No more sounds to load
        </Para>
      )}

      <div ref={loadMoreRef} className="h-10" />
    </>
  );
}

export default Uploads;
