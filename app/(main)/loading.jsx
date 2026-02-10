export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-zinc-900 z-99 fixed top-0 left-0 w-full">
            <div className="clouds">
                <div className="cloud cloud1"></div>
                <div className="cloud cloud2"></div>
                <div className="cloud cloud3"></div>
                <div className="cloud cloud4"></div>
                <div className="cloud cloud5"></div>
            </div>

            <div className="loader">
                <span><span></span><span></span><span></span><span></span></span>
                <div className="base">
                    <span></span>
                    <div className="face"></div>
                </div>
            </div>

            <div className="longfazers">
                <span></span><span></span><span></span><span></span>
            </div>

        </div>
    );
}

