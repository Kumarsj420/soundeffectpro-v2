"use client"
import { useEffect, useState } from "react";
import TagScroller from "./components/TagScroller";
import SoundCard, { SoundCardProps } from "./components/SoundCard";
import { ChevronRight, History } from "lucide-react";
import { fileService } from "./services/fileService";
import { IFile } from "./models/File";
import SoundCardSkelton from "./components/SoundCardSkelton";


export default function HomePage() {
  const [recentSounds, setRecentSounds] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const fileData = await fileService.getFiles();
      console.log(fileData);
      setRecentSounds(fileData.data)
      setLoading(false);
    } catch (error) {
      console.log('files data not recieved', error);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [])

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
            {/* {popularSounds.map((sound) => (
              <SoundCard key={`popular-${sound.id}`} {...sound} />
            ))} */}
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
            {/* {trendingSounds.map((sound) => (
              <SoundCard key={`trending-${sound.id}`} {...sound} />
            ))} */}
          </div>
        </section>

        {/* Recent Section */}
        <section className="space-y-4 mt-10">
          <div className="flex items-center gap-2">
            <History className="text-gray-500/80 dark:text-zinc-500" size={25} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Recent</h2>
          </div>
          {
            loading && (
              <div className="flex justify-center py-5">
                <div className="size-10 rounded-full border-t-2 border-b-2 border-r-2 border-zinc-500 animate-spin"></div>
              </div>
            )
          }
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* {recentSounds.map((sound) => (
              <SoundCard key={`recent-${sound.id}`} {...sound} />
            ))} */}
            
            <SoundCardSkelton />

            {!loading && recentSounds.map((obj: any) => (
              <SoundCard key={obj._id} obj={obj} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
