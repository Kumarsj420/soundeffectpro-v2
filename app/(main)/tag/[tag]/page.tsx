import TagRes from "./Tag";
import { Metadata } from "next";

type Props = {
  params: Promise<{ tag?: string }>;
};

function capitalize(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { tag } = await params;

  const tagVal = tag ?? 'Search';

return {
    title: `${capitalize(tagVal)} Tag Sound Buttons | Sound Effect Pro`,
    description: `Explore ${capitalize(tagVal)} sound effects and sound buttons. Play, download, and share high-quality ${tagVal} audio clips instantly.`,
  };
}

async function page({
  params,
}: {
  params: Promise<{ tag?: string }>;
}) {
    const {tag} = await params;

    if(!tag) return;

  return (
    <TagRes tag={tag} />
  )
}

export default page
