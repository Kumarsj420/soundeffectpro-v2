"use client"
import { useEffect, useState } from "react";
import TagScroller from "./components/TagScroller";
import SoundCard, {SoundCardSkelton} from "./components/SoundCard";
import { ChevronRight, History } from "lucide-react";
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

export default function HomePage() {
  const {data: session, status} = useSession();
  const [popularSounds, setPopularSounds] = useState<IFile[]>([]);
  const [trendingSounds, setTrendingSounds] = useState<IFile[]>([]);
  const [loading, setLoading] = useState({ popular: true, trending: true });

  const {
    data: boardData,
    isLoading: isBoardLoading,
    isError: isBoardError,
  } = useQuery({
    queryKey: ['soundboard'],
    queryFn: () => categoryService.getCategory({ limit: 5, thumb: true })
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


  const fetchPopular = async () => {
    try {
      const fileData = await fileService.getFiles({ sortBy: 'stats.downloads', order: 'desc', limit: 5 });
      setPopularSounds(fileData.data);
      setLoading(prev => ({ ...prev, popular: false }));
    } catch (error) {
      console.log('popular sound files data not recieved', error);
    }
  }

  const fetchTrending = async () => {
    try {
      const fileData = await fileService.getFiles({ sortBy: 'stats.likes', order: 'desc', limit: 5 });
      setTrendingSounds(fileData.data);
      setLoading(prev => ({ ...prev, trending: false }));
    } catch (error) {
      console.log('trending sound files data not recieved', error);
    }
  }

  useEffect(() => {
    fetchPopular();
    fetchTrending();
  }, [])

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
              <button className="pl-3.5 sm:pl-4 pr-2.5 sm:pr-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700/75 hover:bg-gray-50 hover:ring-gray-400/70 dark:hover:bg-zinc-800 dark:hover:ring-zinc-700 rounded-lg text-xs sm:text-sm font-medium transition duration-200 cursor-pointer flex items-center gap-2 text-gray-500 dark:text-white">
                More
                <ChevronRight className="text-zinc-500" size={16} />
              </button>
            </Link>
          </div>
          <SoundGrid>
            {
              soundboards?.map((item) => (
                <Soundboard key={item.sb_id} obj={item}  />
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
              <button className="pl-3.5 sm:pl-4 pr-2.5 sm:pr-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700/75 hover:bg-gray-50 hover:ring-gray-400/70 dark:hover:bg-zinc-800 dark:hover:ring-zinc-700 rounded-lg text-xs sm:text-sm font-medium transition duration-200 cursor-pointer flex items-center gap-2 text-gray-500 dark:text-white">
                More
                <ChevronRight className="text-zinc-500" size={16} />
              </button>
            </Link>
          </div>
          <SoundGrid>
            {!loading.popular && popularSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} sessionUser={session?.user.uid === obj.user.uid ? true : false} />
            ))}
            {
              loading.popular &&
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
              <button className="pl-3.5 sm:pl-4 pr-2.5 sm:pr-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700/75 hover:bg-gray-50 hover:ring-gray-400/70 dark:hover:bg-zinc-800 dark:hover:ring-zinc-700 rounded-lg text-xs sm:text-sm font-medium transition duration-200 cursor-pointer flex items-center gap-2 text-gray-500 dark:text-white">
                More
                <ChevronRight className="text-zinc-500" size={16} />
              </button>
            </Link>
          </div>
          <SoundGrid>
            {!loading.trending && trendingSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} sessionUser={session?.user.uid === obj.user.uid ? true : false} />
            ))}
            {
              loading.trending &&
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
            {recentSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} sessionUser={session?.user.uid === obj.user.uid ? true : false} />
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
