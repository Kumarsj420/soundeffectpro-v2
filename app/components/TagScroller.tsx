"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Tag from "./Tag";

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
    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-zinc-900/60 px-2 rounded-xl ring-1 ring-gray-300/70 dark:ring-zinc-800">
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`p-1.5 sm:p-2 rounded-full bg-white ring-1 ring-gray-300 disabled:ring-gray-200/70 shadow-md shadow-gray-300 dark:shadow-none  dark:ring-0 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white hover:ring-blue-100 text-gray-500 dark:text-white disabled:bg-gray-50 disabled:text-zinc-300 dark:disabled:bg-zinc-800/55 dark:disabled:text-zinc-600 transition-colors duration-200 cursor-pointer`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="size-3.5 sm:size-4" />
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
          <Tag
            key={`${tag}-${index}`}
          >
            {tag}
          </Tag>
        ))}
      </div>

      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`p-1.5 sm:p-2 rounded-full bg-white ring-1 ring-gray-300 disabled:ring-gray-200/70 shadow-md shadow-gray-300 dark:shadow-none  dark:ring-0 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white hover:ring-blue-100 text-gray-500 dark:text-white disabled:bg-gray-50 disabled:text-zinc-300 dark:disabled:bg-zinc-800/55 dark:disabled:text-zinc-600 transition-colors duration-200 cursor-pointer`}
        aria-label="Scroll right"
      >
        <ChevronRight className="size-3.5 sm:size-4" />
      </button>
    </div>
  );
};

export default TagScroller;