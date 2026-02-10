import PopularBoard from "./board";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Time Popular Soundboards | Sound Effect Pro",
  description: "Discover the most popular soundboards of all time on Sound Effect Pro. Browse our collection of viral sound effects, trending memes, and fan-favorite audio clips used by millions worldwide.",
};

function page() {
  return (
    <PopularBoard />
  )
}

export default page
