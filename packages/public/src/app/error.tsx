'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">⚠️</h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900">
          Что-то пошло не так
        </h2>
        <p className="text-gray-500 mb-8">
          Приносим извинения, произошла непредвиденная ошибка
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}

