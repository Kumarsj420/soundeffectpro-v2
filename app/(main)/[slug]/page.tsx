import SoundDetailsPage from "./sound";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 600; 

type Props = {
  params: Promise<{ slug?: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const nameParts = slug?.split('-').slice(0, -1) || [];
  const name = nameParts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Sound';

  return {
    title: `${name} Sound Button | Sound Effect Pro`,
    description: `Play and download the ${name} sound button for free. Instant meme sound effect perfect for videos, streams, and sharing with friends.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;
  const id = slug?.split("-").pop();

  if (!id) {
    notFound();
  }

  return (
    <SoundDetailsPage id={id} />

  )
}
