import SearchRes from "./searchRes";
import { Metadata } from "next";

type Props = {
  params: Promise<{ search?: string }>;
};

function capitalize(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { search } = await params;

  const searchVal = search ?? 'Search';

  return {
    title: `${capitalize(searchVal)} Sound Buttons | Sound Effect Pro`,
    description: `Search and explore sound effects from the biggest sound effect library for Trending, Meme, Gaming and Viral sounds.`,
  };
}

async function page({
  params,
}: {
  params: Promise<{ search?: string }>;
}) {
    const {search} = await params;

    if(!search) return;

  return (
    <SearchRes search={search} />
  )
}

export default page
