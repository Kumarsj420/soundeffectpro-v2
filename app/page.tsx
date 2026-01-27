"use client"
import { useEffect, useState } from "react";
import TagScroller from "./components/TagScroller";
import SoundCard, { SoundCardSkelton } from "./components/SoundCard";
import { History } from "lucide-react";
import { fileService } from "./services/fileService";
import { IFile } from "./models/File";
import { useInfiniteLoader } from "./hooks/useInfiniteLoader";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { SoundGrid, Head2 } from "./components/Ui";
import Link from "next/link";
import { PAGE_SIZE } from './global';
import Soundboard, { SoundboardSkelton } from "./components/Soundboard";
import { categoryService } from "./services/categoryService";
import { useSession } from "next-auth/react";
import Button from "./components/form/Button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";


export default function HomePage() {
  const { data: session } = useSession();

  const {
    data: boardData,
    isLoading: isBoardLoading,
  } = useQuery({
    queryKey: ['soundboard'],
    queryFn: () => categoryService.getCategory({ limit: 5, thumb: true }),
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
    data: popularSfx,
    isLoading: isPopularSfxLoading,
  } = useQuery({
    queryKey: ['popular-sfx'],
    queryFn: () => fileService.getFiles({ sortBy: 'stats.downloads', order: 'desc', limit: 5 }),
    staleTime: 1000 * 60 * 5,
  })

  const popularSfxFiles = popularSfx?.data ?? null;

  const {
    data: trendingSfx,
    isLoading: isTrendingSfxLoading,
  } = useQuery({
    queryKey: ['trending-sfx'],
    queryFn: () => fileService.getFiles({ sortBy: 'stats.likes', order: 'desc', limit: 5 }),
    staleTime: 1000 * 60 * 5,
  })

  const trendingSfxFiles = trendingSfx?.data ?? null;

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });


  return (
    <main className="min-h-screen text-white">
      <div className="space-y-8">
        <TagScroller />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Head2>Soundboards</Head2>
            <Link href='/soundboard'>
              <Button variant="outline" size="sm">
                More
                <ChevronRightIcon className="text-zinc-500 size-4" />
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

        {/* Popular Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Head2>Popular <span className="text-gray-600/90 dark:text-zinc-300/80 font-light">| Sound Buttons</span></Head2>
            <Link href='/popular'>
              <Button variant="outline" size="sm">
                More
                <ChevronRightIcon className="text-zinc-500 size-4" />
              </Button>
            </Link>
          </div>
          <SoundGrid>
            {!isPopularSfxLoading && popularSfxFiles?.map((obj: IFile) => (
              <SoundCard key={obj.s_id} obj={obj} sessionUser={session?.user.uid === obj.user.uid ? true : false} />
            ))}
            {
              isPopularSfxLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <SoundCardSkelton key={i} />
              ))
            }
          </SoundGrid>
        </section>


        <section className="space-y-4 mt-10">
          <div className="flex items-center justify-between">
            <Head2>Trending <span className="text-gray-600/90 dark:text-zinc-300/80 font-light">| Sound Buttons</span></Head2>
            <Link href='/trending'>
              <Button variant="outline" size="sm">
                More
                <ChevronRightIcon className="text-zinc-500 size-4" />
              </Button>
            </Link>
          </div>
          <SoundGrid>
            {!isTrendingSfxLoading && trendingSfxFiles?.map((obj: IFile) => (
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
            <History className="text-gray-500/80 dark:text-zinc-500" size={25} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Recent</h2>
          </div>

          <SoundGrid>
            {recentSounds.map((obj: IFile) => (
              <SoundCard key={obj.s_id} obj={obj} sessionUser={session?.user.uid === obj.user.uid ? true : false} />
            ))}
            {
              (isLoading || isFetchingNextPage) &&
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SoundCardSkelton key={i} />
              ))
            }
          </SoundGrid>

          {!hasNextPage && recentSounds.length > 0 && (
            <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
          )}
          <div ref={loadMoreRef} className="h-10" />
        </section>
      </div>
    </main>
  );
}
