"use client"
import React, { useEffect, useState, useMemo } from 'react';
import SoundButton from '../components/SoundButton';
import { fileService } from '../services/fileService';
import { HomeIcon } from '@heroicons/react/20/solid';
import Loading from '@/app/loading';
import { useLazyAudio } from '../hooks/useAudio';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useInfiniteLoader } from '../hooks/useInfiniteLoader';
import { SoundGrid, Head2 } from '../components/Ui';
import SoundCard, { SoundCardSkelton } from '../components/SoundCard';
import { PAGE_SIZE } from '../global';
import { notFound } from 'next/navigation';
import {
  Download,
  Heart,
  Clock,
  Eye,
  Share2,
  Plus,
  ChevronRight,
  Flag
} from 'lucide-react';
import { HeartIcon, PlusIcon, CodeBracketIcon, ArrowDownOnSquareStackIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import Button from '../components/form/Button';
import { useModal } from '../hooks/useModal';


interface SoundDetailsPageProps {
  slug: string;
}

const SoundDetailsPage = ({ slug }: SoundDetailsPageProps) => {
  const openModal = useModal((s) => s.openModal);
  const id = useMemo(() => slug?.split("-").pop(), [slug]);
  if (!id) return notFound();

  const { play, pause, loading, playing, buffering } =
    useLazyAudio(`/store/${id}.mp3`);

  const {
    data: soundRes,
    isLoading: isSoundLoading,
    isError: isSoundError,
  } = useQuery({
    queryKey: ["sound", id],
    queryFn: () => fileService.getFilesById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const sfxInfo = soundRes?.data ?? null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRelatedLoading,
  } = useInfiniteQuery({
    queryKey: ["related-sounds", id],
    initialPageParam: 1,
    enabled: !!sfxInfo, // 🔥 wait until sound is loaded
    queryFn: ({ pageParam }) =>
      fileService.getRelatedFiles(
        id!,
        pageParam,
        PAGE_SIZE,
        {
          title: sfxInfo?.title,
          tags: sfxInfo?.tags,
          category: sfxInfo?.category,
        }
      ),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.pages
        ? lastPage.pagination.page + 1
        : undefined,
    staleTime: 1000 * 60 * 5,
  });


  const relatedSounds =
    data?.pages.flatMap(page => page.data) ?? [];

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });


  if (isSoundLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className=" min-h-screen text-zinc-200">
      <section >
        {/* breadcrumps */}
        <nav className="flex items-center gap-1 text-sm mb-6">
          <button className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
            <HomeIcon className='size-4' />
          </button>
          <ChevronRight size={14} className="text-gray-600 dark:text-zinc-600" />
          <button className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors">
            {sfxInfo?.category ? sfxInfo?.category : 'Random'}
          </button>
          <ChevronRight size={14} className="text-gray-600 dark:text-zinc-600" />
          <span className="text-gray-900 dark:text-zinc-300 truncate max-w-xs">
            {sfxInfo?.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-8 mb-12">
          {/* sound player */}
          <div className="bg-gradient-to-br from-white to-gray-100/70 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 flex flex-col gap-5 justify-between min-h-[390px] ring-1 ring-gray-300/80 dark:ring-0 shadow-xl shadow-gray-300/60 dark:shadow-none">
            <div className='flex justify-center items-center flex-1 mt-5 '>
              <div className="scale-220">
                <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${sfxInfo?.btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ">
              <Button variant='outline'>
                <HeartOutlineIcon className='text-gray-500/80 dark:text-zinc-500 size-5' />
                Like <span className="hidden sm:inline">Sound</span>
              </Button>
              <Button variant='outline' onClick={() => openModal('ats-modal', { id: 44 })}>
                <PlusIcon className='text-gray-500/80 dark:text-zinc-500 size-5' />
                Soundboard
              </Button>

              <Button variant='outline'>
                <span>
                  <CodeBracketIcon className='text-gray-500/80 dark:text-zinc-500 size-5' />
                </span>
                Embed <span className="hidden sm:inline">Button</span>
              </Button>

              <Button>
                <ArrowDownOnSquareStackIcon className='size-5' />
                Download <span className="hidden sm:inline">Sound</span>
              </Button>

            </div>
          </div>

          {/* sound details */}
          <div className="space-y-6 py-1">
            {/* Title and Uploader */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2 leading-tight capitalize">
                {sfxInfo?.title} | Sound Effect Pro
              </h1>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                <span>by</span>
                <button className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium">
                  {sfxInfo?.user.name}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Clock size={18} className="text-gray-400 dark:text-zinc-500" />
                <span>{sfxInfo?.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Eye size={18} className="text-gray-400 dark:text-zinc-500 scale-110" />
                <span>{sfxInfo?.stats.views}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Download size={18} className="text-gray-400 dark:text-zinc-500" />
                <span>{sfxInfo?.stats.downloads}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Heart size={18} className="text-gray-400 dark:text-zinc-500" />
                <span>{sfxInfo?.stats.likes}</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex flex-wrap gap-2">
                {
                  sfxInfo?.tags.map((tag: any, index: any) => (
                    <button key={index}
                      className="bg-gradient-to-b from-gray-200 to-white text-gray-900 dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-300 rounded-full px-3 py-1 text-sm hover:bg-blue-600 dark:hover:text-white relative z-10 dark:after:absolute dark:after:inset-[0.1em] dark:after:bg-zinc-800 dark:after:rounded-[inherit] dark:after:-z-10 hover:brightness-105 dark:hover:brightness-140 transition duration-200 shadow-md shadow-gray-300 ring-1 ring-inset ring-gray-300/60 dark:ring-0 dark:shadow-none"
                    >
                      {tag}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">Description</h3>
              <p className="text-gray-600/90 dark:text-zinc-300 text-sm leading-relaxed">
                {sfxInfo?.description}
                {!sfxInfo?.description && ('There is no description available for this sound..')}
              </p>
            </div>

            {/* Report Button */}
            <div className="pt-2 flex gap-4">
              <button
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl px-4 py-2.5 text-sm transition-colors"
              >
                <Flag size={16} />
                Report Sound
              </button>


              <button className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-white dark:hover:bg-zinc-800  dark:hover:ring-zinc-600">
                <Share2 size={16} className='text-gray-500/80 dark:text-zinc-400/90' />
                Share Sound
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Head2>Related Sounds</Head2>

        <SoundGrid className='mt-5'>
          {relatedSounds.map((obj: any) => (
            <SoundCard key={obj._id} obj={obj} />
          ))}
          {
            (isRelatedLoading || isFetchingNextPage) &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SoundCardSkelton key={i} />
            ))
          }
        </SoundGrid>

        {!hasNextPage && relatedSounds.length > 0 && (
          <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
        )}
        <div ref={loadMoreRef} className="h-10" />

      </section>

    </div>



  );
};

export default SoundDetailsPage;