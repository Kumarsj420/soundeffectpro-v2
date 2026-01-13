export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 z-99 fixed top-0 left-0 w-full">
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="w-16 h-16 border-4 border-zinc-500 border-t-blue-500 rounded-full animate-spin"></div>
                </div>

            </div>
        </div>
    );
}

