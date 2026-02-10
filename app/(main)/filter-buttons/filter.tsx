"use client"
import React from 'react'
import SoundCard, { SoundCardSkelton } from '../../components/SoundCard';
import { fileService } from '../../services/fileService';
import { useInfiniteLoader } from '../../hooks/useInfiniteLoader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Head1, SoundGrid } from '../../components/Ui';
import { PAGE_SIZE } from '../../global';
import { IFileWithFav } from '../../services/fileService';
import Breadcrumps from '@/app/components/Breadcrumps';

function getSortBy(period: 'week' | 'month' | 'halfyear', field: 'views' | 'likes' | 'downloads'): string {
  const periodMap: Record<'week' | 'month' | 'halfyear', string> = {
    week: 'weekly',
    month: 'monthly',
    halfyear: 'halfYearly'
  };

  return `stats.${periodMap[period]}.${field}`;
}

function getPageTitle(period: 'week' | 'month' | 'halfyear', field: 'views' | 'likes' | 'downloads'): string {
  const titleMap: Record<'week' | 'month' | 'halfyear', Record<'views' | 'likes' | 'downloads', string>> = {
    week: {
      views: 'Trending Sound Effect Buttons This Week',
      likes: 'Most Viral Sound Effect Buttons This Week',
      downloads: 'Most Popular Sound Effect Buttons This Week'
    },
    month: {
      views: 'Trending Sound Effect Buttons This Month',
      likes: 'Most Viral Sound Effect Buttons This Month',
      downloads: 'Most Popular Sound Effect Buttons This Month'
    },
    halfyear: {
      views: 'Top Trending Sound Effect Buttons In Last 6 Months',
      likes: 'Most Viral Sound Effect Buttons In Last 6 Months',
      downloads: 'Most Popular Sound Effect Buttons In Last 6 Months'
    }
  };

  return titleMap[period][field];
}


export default function FilterSounds({ period, field }: { period: 'week' | 'month' | 'halfyear', field: 'views' | 'likes' | 'downloads' }) {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["filter-sounds", period, field],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fileService.getFiles({
        page: pageParam,
        limit: PAGE_SIZE,
        sortBy: getSortBy(period, field),
        order: 'desc',
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const popularSounds =
    data?.pages.flatMap(page => page.data) ?? [];

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });

  return (
    <>
      <Breadcrumps cat={{ label: 'Sounds', link: '/popular' }} title={getPageTitle(period, field)} className='mb-5' />
      <Head1>{getPageTitle(period, field)}</Head1>

      <SoundGrid className='mt-5'>
        {popularSounds.map((obj: IFileWithFav) => (
          <SoundCard key={obj.slug + '-' + obj.s_id} obj={obj} />
        ))}
        {
          (isLoading || isFetchingNextPage) &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SoundCardSkelton key={i} />
          ))
        }
      </SoundGrid>

      {!hasNextPage && popularSounds.length > 0 && (
        <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
      )}
      <div ref={loadMoreRef} className="h-10" />
    </>

  )
}
