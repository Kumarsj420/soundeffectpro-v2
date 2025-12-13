import { useEffect, useRef } from "react";

interface UseInfiniteLoaderProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export function useInfiniteLoader({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = "200px",
}: UseInfiniteLoaderProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { rootMargin }
    );

    if (triggerRef.current) {
      observerRef.current.observe(triggerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, hasMore, onLoadMore, rootMargin]);

  return triggerRef;
}
