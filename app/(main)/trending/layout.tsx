import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Top hottest trending Sound Buttons in this month | Sound Effect Pro",
  description: "Explore this month's hottest trending sound buttons and meme sounds. Play, share, and download the most popular audio clips from our community — completely free.",
};

export default function trendingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>)
}