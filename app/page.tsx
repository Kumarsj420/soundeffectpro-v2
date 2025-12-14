"use client"
import { useEffect, useState } from "react";
import TagScroller from "./components/TagScroller";
import SoundCard, { SoundCardProps } from "./components/SoundCard";
import { ChevronRight, History } from "lucide-react";
import { fileService } from "./services/fileService";
import { IFile } from "./models/File";
import SoundCardSkelton from "./components/SoundCardSkelton";
import { useInfiniteLoader } from "./hooks/useInfiniteLoader";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function HomePage() {
  const PAGE_SIZE = 20;
  const [popularSounds, setPopularSounds] = useState<IFile[]>([]);
  const [trendingSounds, setTrendingSounds] = useState<IFile[]>([]);
  const [recentPage, setRecentPage] = useState(1);
  const [loading, setLoading] = useState({ popular: true, trending: true });


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["recent-sounds"],
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

        {/* Popular Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Popular <span className="text-gray-600/90 dark:text-zinc-300/80 font-light">| Sound Buttons</span></h2>
            <button className="pl-3.5 sm:pl-4 pr-2.5 sm:pr-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700/75 hover:bg-gray-50 hover:ring-gray-400/70 dark:hover:bg-zinc-800 dark:hover:ring-zinc-700 rounded-lg text-xs sm:text-sm font-medium transition duration-200 cursor-pointer flex items-center gap-2 text-gray-500 dark:text-white">
              More
              <ChevronRight className="text-zinc-500" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {!loading.popular && popularSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} />
            ))}
            {
              loading.popular &&
              Array.from({ length: 5 }).map((_, i) => (
                <SoundCardSkelton key={i} />
              ))
            }
          </div>
        </section>


        <section className="space-y-4 mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Trending <span className="text-gray-600/90 dark:text-zinc-300/80 font-light">| Sound Buttons</span></h2>
            <button className="pl-3.5 sm:pl-4 pr-2.5 sm:pr-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700/75 hover:bg-gray-50 hover:ring-gray-400/70 dark:hover:bg-zinc-800 dark:hover:ring-zinc-700 rounded-lg text-xs sm:text-sm font-medium transition duration-200 cursor-pointer flex items-center gap-2 text-gray-500 dark:text-white">
              More
              <ChevronRight className="text-zinc-500" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {!loading.trending && trendingSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} />
            ))}
            {
              loading.trending &&
              Array.from({ length: 5 }).map((_, i) => (
                <SoundCardSkelton key={i} />
              ))
            }
          </div>
        </section>

        {/* Recent Section */}
        <section className="space-y-4 mt-10">
          <div className="flex items-center gap-2">
            <History className="text-gray-500/80 dark:text-zinc-500" size={25} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Recent</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

            {recentSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} />
            ))}
            {
              (isLoading || isFetchingNextPage) &&
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SoundCardSkelton key={i} />
              ))
            }
          </div>

          {!hasNextPage && recentSounds.length > 0 && (
            <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
          )}
          <div ref={loadMoreRef} className="h-10" />
        </section>
      </div>
    </main>
  );
}
