import SoundboardPage from "./board";
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
    <SoundboardPage id={id} />

  )
}
