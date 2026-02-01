import type { Metadata } from "next";
import UserHeader from "../../components/UserHeader";
import { redirect } from 'next/navigation';
import Tab from "./tab";
import { requireAuth } from "../../lib/getSession";

export async function generateMetadata(): Promise<Metadata> {
    const session = await requireAuth();
    const userName = session?.user?.name || "User";

    return {
        title: `${userName} Profile Dashboard | Sound Effect Pro`,
        description: `${userName}'s personalized dashboard - check ${userName}'s uploaded sound effects and created soundboards here.`,
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await requireAuth();
    const userName = session?.user?.name;

    if (!session) {
        redirect('/login')
    }


    return (
        <div>
            <UserHeader variant="private" />
            <Tab />
            <div className="mt-7 ">
                {children}
            </div>
        </div>
    );
}