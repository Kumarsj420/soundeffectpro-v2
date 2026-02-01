import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Most Popular Sound Buttons & Meme Sounds | Sound Effect Pro",
  description: "Explore the most popular sound buttons and meme sounds loved by millions. Play, share, and download viral audio clips, trending sound effects, and community favorites — all free.",
};

export default function PopularLayout({children}:{children: React.ReactNode}){
    return(
    <>
     {children}
    </>)
}