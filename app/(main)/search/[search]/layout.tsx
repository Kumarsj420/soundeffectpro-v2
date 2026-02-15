import SearchTab from "./tab";
import { Head1 } from "@/app/components/Ui";
import Breadcrumps from "@/app/components/Breadcrumps";


export default async function PopularLayout({ children, params }: { children: React.ReactNode, params: Promise<{ search: string }> }) {
    const { search } = await params;

    return (
        <>
         <Breadcrumps  title={`${search} search results`} className="mb-5" />
            <Head1>Search Result For {search}</Head1>
            <SearchTab search={search} />

            <div className="mt-7">
                {children}
            </div>
        </>)
}