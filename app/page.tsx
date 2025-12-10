"use client"
import TagScroller from "./components/TagScroller";
import SoundCard, { SoundCardProps } from "./components/SoundCard";
import { ChevronRight, History } from "lucide-react";
import { useEffect } from "react";

const mockSounds: SoundCardProps[] = [
  {
    id: 1,
    title: "Meme Sound Effect Just For Testing",
    duration: "0:12",
    likes: 120,
    downloads: 80,
    tag: "Meme",
  },
  {
    id: 2,
    title: "Anime Wow Sound",
    duration: "0:08",
    likes: 95,
    downloads: 150,
    tag: "Anime",
  },
  {
    id: 3,
    title: "Epic Gaming Horn",
    duration: "0:20",
    likes: 210,
    downloads: 300,
    tag: "Gaming",
  },
  {
    id: 4,
    title: "Meme Sound Effect",
    duration: "0:12",
    likes: 120,
    downloads: 80,
    tag: "Meme",
  },
  {
    id: 5,
    title: "Anime Wow Sound",
    duration: "0:08",
    likes: 95,
    downloads: 150,
    tag: "Anime",
  },
  {
    id: 6,
    title: "Epic Gaming Horn",
    duration: "0:20",
    likes: 210,
    downloads: 300,
    tag: "Gaming",
  },
  {
    id: 7,
    title: "Meme Sound Effect",
    duration: "0:12",
    likes: 120,
    downloads: 80,
    tag: "Meme",
  },
  {
    id: 8,
    title: "Anime Wow Sound",
    duration: "0:08",
    likes: 95,
    downloads: 150,
    tag: "Anime",
  },
  {
    id: 9,
    title: "Epic Gaming Horn",
    duration: "0:20",
    likes: 210,
    downloads: 300,
    tag: "Gaming",
  },
];






export default function HomePage() {
  // Mock data for different categories
  const popularSounds = mockSounds.slice(0, 5);
  const trendingSounds = mockSounds.slice(5, 10);
  const recentSounds = mockSounds;


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
            {popularSounds.map((sound) => (
              <SoundCard key={`popular-${sound.id}`} {...sound} />
            ))}
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
            {trendingSounds.map((sound) => (
              <SoundCard key={`trending-${sound.id}`} {...sound} />
            ))}
          </div>
        </section>

        {/* Recent Section */}
        <section className="space-y-4 mt-10">
          <div className="flex items-center gap-2">
            <History className="text-gray-500/80 dark:text-zinc-500" size={25} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Recent</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recentSounds.map((sound) => (
              <SoundCard key={`recent-${sound.id}`} {...sound} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
