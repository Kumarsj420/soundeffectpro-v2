import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Recently Uploaded Sound Effect Buttons | Sound Effect Pro",
  description: "Explore recently uploaded sound buttons and meme sounds. Play, share, and download the most recent audio clips from our community — completely free.",
};

export default function trendingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>)
}