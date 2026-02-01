import SoundboardPage from "./board";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
    title: `${name} Soundboard | Sound Effect Pro`,
    description: `Play sound buttons, share with your friends, saved your likes and  download you needs from ${name} soundboard collection - completely free !.`,
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
    <SoundboardPage id={id} />

  )
}
