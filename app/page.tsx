"use client"
import { useEffect, useState } from "react";
import TagScroller from "./components/TagScroller";
import SoundCard, { SoundCardProps } from "./components/SoundCard";
import { ChevronRight, History } from "lucide-react";
import { fileService } from "./services/fileService";
import { IFile } from "./models/File";
import SoundCardSkelton from "./components/SoundCardSkelton";
import { useInfiniteLoader } from "./hooks/useInfiniteLoader"

export default function HomePage() {
  const [popularSounds, setPopularSounds] = useState<IFile[]>([]);
  const [trendingSounds, setTrendingSounds] = useState<IFile[]>([]);
  const [recentSounds, setRecentSounds] = useState<IFile[]>([]);
  const [recentPage, setRecentPage] = useState(1);
  const [loading, setLoading] = useState({ popular: true, trending: true, recent: false });
  const [hasMore, setHasMore] = useState(true);
  const [loadingCount, setLoadingCount] = useState({ main: 20, preview: 5 });

  const fetchFiles = async () => {
    if (loading.recent || !hasMore) return;

    setLoading(prev => ({ ...prev, recent: true }));

    try {
      const pageToFetch = recentPage;

      const fileData = await fileService.getFiles({
        page: pageToFetch,
        limit: loadingCount.main,
      });

      setRecentSounds(prev => [...prev, ...fileData.data]);
      setRecentPage(prev => prev + 1);

      setHasMore(fileData.data.length === loadingCount.main);

      const pagination = fileData.pagination;

      if (pagination && pageToFetch === pagination.pages) {
        const remainingFiles = Math.max(
          pagination.total - loadingCount.main * (pageToFetch - 1),
          0
        );

        setLoadingCount(prev => ({
          ...prev,
          main: remainingFiles || prev.main,
        }));
      }
    } catch (error) {
      console.error("recent sound files data not received", error);
    } finally {
      setLoading(prev => ({ ...prev, recent: false }));
    }
  };



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
    fetchFiles();
  }, [])

  const loadMoreRef = useInfiniteLoader({
    loading: loading.recent,
    hasMore,
    onLoadMore: fetchFiles,
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
              Array.from({ length: loadingCount.preview }).map((_, i) => (
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
              Array.from({ length: loadingCount.preview }).map((_, i) => (
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

            {recentSounds.length > 0 && recentSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} />
            ))}
            {
              (loading.recent || recentPage === 1) &&
              Array.from({ length: loadingCount.main }).map((_, i) => (
                <SoundCardSkelton key={i} />
              ))
            }
          </div>

          <div ref={loadMoreRef} className="h-10" />

          {!hasMore && recentSounds.length > 0 && (
            <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
          )}
        </section>
      </div>
    </main>
  );
}
