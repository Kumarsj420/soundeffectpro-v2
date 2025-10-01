"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tags: string[] = [
  "Meme", "Anime", "Gaming", "Movies", "Comedy", 
  "Sports", "Series", "Politics", "Creators", "Celebrities", "Music", "Technology", "Food", "Travel", "Fashion", 
"Fitness", "Education", "Science", "Business", "Art"
];

const TagScroller: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-zinc-950 px-2 rounded-xl">
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`p-2 rounded-full bg-zinc-800 hover:bg-blue-500 text-white disabled:bg-zinc-800/55 disabled:text-zinc-600 transition-colors duration-200 cursor-pointer`}
        aria-label="Scroll left"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Tag Scroller */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-2 py-3 no-scrollbar flex-1"
        onScroll={checkScrollability}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {tags.map((tag: string, index: number) => (
          <button
            key={`${tag}-${index}`}
            className="px-4 py-1 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-800  text-sm whitespace-nowrap text-white relative z-10 after:absolute after:inset-[0.1em] after:bg-zinc-800 after:-z-10 after:rounded-[inherit] hover:brightness-125 transition duration-200 cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Right Navigation Button */}
      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`p-2 rounded-full bg-zinc-800 hover:bg-blue-500 text-white disabled:bg-zinc-800/55 disabled:text-zinc-600 transition-colors duration-200 cursor-pointer`}
        aria-label="Scroll right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default TagScroller;