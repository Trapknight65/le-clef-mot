'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.error(error)
    return (
        <html>
            <body className="bg-slate-950 text-white flex items-center justify-center min-h-screen">
                <div className="text-center p-6">
                    <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                    <p className="mb-6 text-slate-400">The application encountered a critical error.</p>
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
