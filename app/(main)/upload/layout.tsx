import type { Metadata } from "next";
import { requireAuth } from "../../lib/getSession";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: "Upload your sound effect and share it in the Sound Effect Pro community",
    description: "Contribute your sound effects to the largest meme and trending sound button community. Our mission is to create a free environment for accessing popular sounds.",
};

export default async function UploadLayout({ children }: { children: React.ReactNode }) {
    const session = await requireAuth();

    if (!session) {
        redirect('/login?redirection=upload&callbackUrl=/upload');
    }

    return (
        <>
            {children}
        </>)
}