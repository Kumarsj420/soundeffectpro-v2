"use client"
import React from 'react'
import SoundCard, { SoundCardSkelton } from '../../components/SoundCard';
import { fileService } from '../../services/fileService';
import { useInfiniteLoader } from '../../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Head1, SoundGrid } from '../../components/Ui';
import { PAGE_SIZE } from '../../global';
import { notFound } from 'next/navigation';
import { IFileWithFav } from '../../services/fileService';

export default function Search({
  params,
}: {
  params: { search?: string };
}) {
  const search = params.search;

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
        search: search,
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

  if (!search) return notFound();

  const searchSounds =
    data?.pages.flatMap(page => page.data) ?? [];


  return (
    <>
      <Head1>Search Results For {search}</Head1>

      <SoundGrid className='mt-5'>
        {searchSounds.map((obj: IFileWithFav) => (
          <SoundCard key={obj.s_id} obj={obj} />
        ))}
        {
          (isLoading || isFetchingNextPage) &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SoundCardSkelton key={i} />
          ))
        }
      </SoundGrid>

      {!hasNextPage && searchSounds.length > 0 && (
        <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
      )}
      <div ref={loadMoreRef} className="h-10" />
    </>
  )
}
