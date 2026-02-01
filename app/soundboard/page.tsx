import SoundboardPage from "./boards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top hottest trending Soundboards | Sound Effect Pro",
  description: "Explore hottest trending soundboards and sound buttons. Play, share, and download the most popular audio clips from any soundboard free.",
};

function page() {
  return (
    <SoundboardPage />
  )
}

export default page
