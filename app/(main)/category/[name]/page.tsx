import CategoryRes from "./category";
import { Metadata } from "next";

type Props = {
    params: Promise<{ name?: string }>;
};

function capitalize(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { name } = await params;

    const nameVal = name ?? 'Search';

    return {
        title: `${capitalize(nameVal)} Category Sound Buttons | Sound Effect Pro`,
        description: `Explore our ${capitalize(nameVal)} sound effects library. Discover high-quality ${nameVal} audio clips, sound buttons, and free downloads for videos, games, and multimedia projects.`,
    };
}

async function page({
    params,
}: {
    params: Promise<{ name?: string }>;
}) {
    const { name } = await params;

    if (!name) return;

    return (
        <CategoryRes name={name} />
    )
}

export default page
