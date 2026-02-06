import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Most Viewed Sound Effect Buttons | Sound Effect Pro",
  description: "Discover the most viewed sound effect buttons on Sound Effect Pro. Browse community viewed and download sounds loved by users.",
};

export default function PopularLayout({children}:{children: React.ReactNode}){
    return(
    <>
     {children}
    </>)
}