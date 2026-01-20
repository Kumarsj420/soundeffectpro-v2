import SoundDetailsPage from "./sound";
import { notFound } from "next/navigation";

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
