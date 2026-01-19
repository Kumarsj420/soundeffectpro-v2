'use client'
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center px-6">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
                    <div className="h-1 w-24 bg-blue-500 mx-auto mb-8"></div>
                </div>

                <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Sorry, we couldn't find the page you're looking for.
                    It might have been moved or deleted.
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                    <a
                        href="/"
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                    >
                        Go Home
                    </a>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}