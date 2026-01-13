'use client'
import { useFetchLoading } from "../hooks/useFetchLoading";
export default function FetchLoading() {
    const { isOpen } = useFetchLoading();

    if (isOpen) {
        return (
            <div className="fixed inset-0 bg-gray-400/55 dark:bg-black/60 backdrop-blur-sm z-99 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="size-20 border-4 border-zinc-500 border-t-green-500 rounded-full animate-spin"></div>
                    </div>

                </div>
            </div>
        );
    }

}

