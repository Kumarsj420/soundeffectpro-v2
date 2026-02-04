import Profile from '@/app/components/userProfile';
import type { Metadata } from "next";

type Props = {
    searchParams: Promise<{ name?: string }>;
};

export async function generateMetadata({
    searchParams,
}: Props): Promise<Metadata> {
    const params = await searchParams;
    const userName = params?.name ?? "User";

    return {
        title: `${userName} Profile Dashboard | Sound Effect Pro`,
        description: `${userName}'s personalized dashboard — check uploaded sound effects and created soundboards.`,
    };
}

async function UserIDPage({
    params,
}: {
    params: Promise<{ uid: string }>;
}) {
    const { uid } = await params;

    return (
        <>
            <Profile userType="public" uid={uid} />
        </>
    );
}

export default UserIDPage
