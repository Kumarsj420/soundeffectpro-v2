import EmbedPage from "./embed";

async function page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ theme?: 'dark' | 'light', type?: 'card' | 'button' }>;
}) {
    const { id } = await params;
    const { theme, type } = await searchParams;

    return (
        <EmbedPage
            id={id}
            theme={theme || 'light'}
            type={type || 'card'}
        />
    )
}

export default page;