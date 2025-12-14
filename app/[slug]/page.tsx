import SoundDetailsPage from "./sound";

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  return (
      <SoundDetailsPage slug={params.slug} />

  )
}
