"use client"
import React from "react";
import SoundCard, { SoundCardSkelton } from "../components/SoundCard";
import { fileService } from "../services/fileService";
import { useInfiniteLoader } from "../hooks/useInfiniteLoader";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { SoundGrid, Head2, Para } from "../components/Ui";
import Link from "next/link";
import { PAGE_SIZE } from '../global';
import Soundboard, { SoundboardSkelton } from "../components/Soundboard";
import { categoryService } from "../services/categoryService";
import { useSession } from "next-auth/react";
import Button from "../components/form/Button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { IFileWithFav } from "../services/fileService";
import GoogleAd from "../components/ad";
import { SiAudioboom } from "react-icons/si";
import { useT } from "../hooks/useT";

export default function HomePage() {
  const { data: session } = useSession();

  const t = useT();

  const {
    data: boardData,
    isLoading: isBoardLoading,
  } = useQuery({
    queryKey: ['soundboard', 'monthly-trending'],
    queryFn: () => categoryService.getCategory({ limit: 5, thumb: true, sortBy: 'stats.monthly.views', order: 'desc' }),
    staleTime: 1000 * 60 * 5,
  })

  const soundboards = boardData?.data ?? null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["sounds", "recent-sounds"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fileService.getFiles({
        page: pageParam,
        limit: PAGE_SIZE,
        sortBy: 'stats.halfYearly.views',
        order: 'desc'
      }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const recentSounds =
    data?.pages.flatMap(page => page.data) ?? [];


  const {
    data: trendingSfx,
    isLoading: isTrendingSfxLoading,
  } = useQuery({
    queryKey: ['trending-sfx'],
    queryFn: () => fileService.getFiles({ sortBy: 'stats.weekly.views', order: 'desc', limit: 5 }),
    staleTime: 1000 * 60 * 5,
  })

  const trendingSfxFiles = trendingSfx?.data ?? null;

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });


  return (
    <main className="min-h-screen text-white ">
      <div className="space-y-8 ">

        <h1 className="sr-only">Welcome to Sound Effect Pro — discover meme sound buttons and download viral, trending, and popular sound effects in one place for free.</h1>


        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Head2>{t('popularSoundboards')}</Head2>
            <Link href='/soundboard/filter-board?period=month&field=views'>
              <Button variant="outline" size="sm">
                {t('more')}
                <ChevronRightIcon className="text-zinc-400/80 size-4" />
              </Button>
            </Link>
          </div>
          <SoundGrid>
            {
              soundboards?.map((item) => (
                <Soundboard key={item.sb_id} obj={item} />
              ))
            }
            {
              isBoardLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <SoundboardSkelton key={i} />
                ))
              )
            }
          </SoundGrid>
        </section>


        <GoogleAd slot="5332024478" format="fluid" variant="below-popular" />

        <section className="space-y-4 mt-10">
          <div className="flex items-center justify-between">
            <Head2>{t('weeklyTrending')} <span className="text-gray-600/90 dark:text-zinc-300/80 font-light">| {t('soundEffectButtons')}</span></Head2>
            <Link href='/filter-buttons?period=week&field=views'>
              <Button variant="outline" size="sm">
                {t('more')}
                <ChevronRightIcon className="text-zinc-500 size-4" />
              </Button>
            </Link>
          </div>
          <SoundGrid>
            {!isTrendingSfxLoading && trendingSfxFiles?.map((obj: IFileWithFav) => (
              <SoundCard key={obj.s_id} obj={obj} sessionUser={session?.user.uid === obj.user.uid ? true : false} />
            ))}
            {
              isTrendingSfxLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <SoundCardSkelton key={i} />
              ))
            }
          </SoundGrid>
        </section>

        {/* Recent Section */}
        <section className="space-y-4 mt-10">
          <div className="flex items-center gap-2">
            <SiAudioboom className="text-gray-500/80 dark:text-zinc-300/80" size={25} />
            <Head2>{t('viralSound')} {t('soundEffectButtons')}</Head2>
          </div>

          <SoundGrid>
            {recentSounds.map((obj: IFileWithFav, index) => (
              <React.Fragment key={obj.s_id}>
                <SoundCard
                  obj={obj}
                  sessionUser={session?.user.uid === obj.user.uid}
                />

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
                <SoundCardSkelton key={i} />
              ))
            }
          </SoundGrid>

          {!hasNextPage && recentSounds.length > 0 && (
            <p className="text-center mt-4 text-gray-500">{t('noMoreSoundsToLoad')}</p>
          )}
          <div ref={loadMoreRef} className="h-10" />
          <GoogleAd
            slot="7619276466"
            format="autorelaxed"
            variant="multiplex"
          />
        </section>
      </div>
    </main>
  );
}
