import { Metadata } from "next";
import FilterBoard from "./filterBoard";

type Period = 'week' | 'month' | 'halfyear';
type Field = 'views'

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ period?: Period; field?: Field }>;
}): Promise<Metadata> {
    const { period = 'month', field = 'views' } = await searchParams;

    const metadataMap: Record<Period, Record<Field, { title: string; description: string }>> = {
        week: {
            views: {
                title: "Trending Soundboards This Week | Sound Effect Pro",
                description: "Discover the hottest trending soundboards from the past week. Explore the most viewed soundboard collections and popular audio compilations on Sound Effect Pro."
            },
        },
        month: {
            views: {
                title: "Popular Soundboards This Month | Sound Effect Pro",
                description: "Check out this month's most popular soundboards. Discover the most viewed sound collections and trending audio boards from the past 30 days."
            },

        },
        halfyear: {
            views: {
                title: "Viral Soundboards in Last 6 Months | Sound Effect Pro",
                description: "Discover the most viral soundboards from the past 6 months. Explore long-term trending sound collections and the most viewed audio boards on Sound Effect Pro."
            },
        }
    };

    const metadata = metadataMap[period][field];

    return {
        title: metadata.title,
        description: metadata.description,
    };
}

async function page({
    searchParams,
}: {
    searchParams: Promise<{ period?: Period; field?: Field }>;
}) {
    const params = await searchParams;
    const period = params.period ?? 'month';
    const field = params.field ?? 'views';

    return <FilterBoard period={period} field={field} />;
}

export default page;