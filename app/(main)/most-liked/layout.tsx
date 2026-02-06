import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Most Liked Sound Effect Buttons | Sound Effect Pro",
  description: "Discover the most popular and liked sound effect buttons on Sound Effect Pro. Browse community favorites and trending sounds loved by users.",
};

export default function PopularLayout({children}:{children: React.ReactNode}){
    return(
    <>
     {children}
    </>)
}