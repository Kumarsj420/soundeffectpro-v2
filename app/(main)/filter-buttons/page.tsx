import { Metadata } from "next";
import FilterSounds from "./filter";

type Period = 'week' | 'month' | 'halfyear';
type Field = 'views' | 'likes' | 'downloads';

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ period?: Period; field?: Field }>;
}): Promise<Metadata> {
    const { period = 'month', field = 'views' } = await searchParams;

    const metadataMap: Record<Period, Record<Field, { title: string; description: string }>> = {
        week: {
            views: {
                title: "Trending Sound Effect Buttons This Week | Sound Effect Pro",
                description: "Discover the hottest trending sound effect buttons from the past week. Explore the most viewed sounds and viral audio clips on Sound Effect Pro."
            },
            likes: {
                title: "Viral Sound Effect Buttons This Week | Sound Effect Pro",
                description: "Browse this week's most viral and liked sound effect buttons. Find the top-rated sounds and fan-favorite audio clips chosen by our community."
            },
            downloads: {
                title: "Popular Sound Effect Buttons This Week | Sound Effect Pro",
                description: "Explore the most popular and downloaded sound effects from the past week. Get the hottest audio clips and popular sound buttons everyone is using."
            }
        },
        month: {
            views: {
                title: "Trending Sound Effect Buttons This Month | Sound Effect Pro",
                description: "Check out this month's trending sound effect buttons. Discover the most viewed and popular sounds dominating Sound Effect Pro."
            },
            likes: {
                title: "Viral Sound Effect Buttons This Month | Sound Effect Pro",
                description: "Explore this month's most viral and liked sound effect buttons. Browse top-rated sounds and community favorites from the past 30 days."
            },
            downloads: {
                title: "Most Popular Sound Effect Buttons This Month | Sound Effect Pro",
                description: "Find the most popular and downloaded sound effects this month. Access popular audio clips and trending sound buttons used by thousands."
            }
        },
        halfyear: {
            views: {
                title: "Top Trending Sound Effect Buttons in Last 6 Months | Sound Effect Pro",
                description: "Discover the biggest trending sound effect buttons from the past 6 months. Explore long-term popular sounds and viral audio clips."
            },
            likes: {
                title: "Top Viral Sound Effect Buttons in Last 6 Months | Sound Effect Pro",
                description: "Browse the most viral and liked sound effect buttons from the past 6 months. Find all-time favorites and consistently top-rated sounds."
            },
            downloads: {
                title: "Top Popular Sound Effect Buttons in Last 6 Months | Sound Effect Pro",
                description: "Explore the most popular and downloaded sound effects from the past 6 months. Access proven popular audio clips and essential sound buttons."
            }
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

    return <FilterSounds period={period} field={field} />;
}

export default page;