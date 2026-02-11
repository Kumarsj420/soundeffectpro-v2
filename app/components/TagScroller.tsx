"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Tag from "./Tag";
import Button from "./form/Button";
import { useTags } from "../context/TagContext";
import { SiBuymeacoffee } from "react-icons/si";
import { FaFonticonsFi } from "react-icons/fa";
import PTag from "./PTags";



const TagScroller: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { tags, prTags } = useTags();

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
    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-zinc-900 px-2 rounded-xl ring-1 ring-gray-300/70 dark:ring-zinc-700/70 ">
      <Button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className="rounded-full p-1.5 sm:p-2 after:inset-[0.35em] after:h-[65%]"
        variant="outline"
        size="auto"
        aria-label="Scroll left"
      >
        <ChevronLeft className="size-3.5 sm:size-4" />
      </Button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-2 py-2 no-scrollbar flex-1 divide-x divide-gray-300/70 dark:divide-zinc-700/70"
        onScroll={checkScrollability}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="pr-2 flex gap-2 items-center">
          {
            prTags.map((tag, index: number) => (
              <PTag key={index} size="sm" as="link" href={tag.link} variant={tag.btnVariant} className="flex gap-1.5" >
                <tag.icon className="size-4.5" />
                {tag.label}
              </PTag>
            ))
          }
        </div>
        <div className="pr-2 flex gap-2 items-center">
          <PTag size="sm" as="link" target="_blank" href='https://buymeacoffee.com/memecup' variant='purplePink' className="flex gap-1.5" >
            <SiBuymeacoffee className="size-4.5" />
            Buy me a coffee
          </PTag>
          <PTag size="sm" as="link" target="_blank"  href='https://www.tastynicks.com/' variant='greenTeal' className="flex gap-1.5" >
            <FaFonticonsFi className="size-4.5" />
            Tasty Nicks Fonts
          </PTag>
        </div>
        <div className="flex gap-2 items-center">
          {tags.map((tag, index: number) => (
            <Tag
              key={`${tag}-${index}`}
              size="sm"
              href={tag.link}
              as="link"
            >
              {tag.label}
            </Tag>
          ))}
        </div>

      </div>

      <Button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className="rounded-full p-1.5 sm:p-2 after:inset-[0.35em] after:h-[65%]"
        variant='outline'
        aria-label="Scroll right"
      >
        <ChevronRight className="size-3.5 sm:size-4" />
      </Button>
    </div>
  );
};

export default TagScroller;